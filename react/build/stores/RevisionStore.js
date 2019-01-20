var AppDispatcher = require("../dispatcher/AppDispatcher");
var ApiConstants = require("../constants/ApiConstants");
var ActionConstants = require("../constants/ActionConstants");

var ProductStore = require("../stores/ProductStore");
var BomStore = require("../stores/BomStore");
var BomExportStore = require("../stores/BomExportStore");

var ExtendedModel = require("../utils/ExtendedModel");
var ExtendedCollection = require("../utils/ExtendedCollection");

var Revision = ExtendedModel.extend({
    //urlRoot: ApiConstants.PATH_PREFIX + "/revision"
    _syncing: false,
    _synced: false,
    _retries: 0,

    setSync: function(syncing, synced) {
        this._syncing = syncing;
        this._synced = synced;
        //this.set({synced: synced});
        if (this._syncing) {
            this._retries++;
        }
        this.trigger("change");
    },

    isSyncing: function() {
        return this._syncing;
    },

    isSynced: function() {
        return this._synced;
    },

    triedSyncing: function() {
        return !!this._retries;
    }
});

var RevisionCollection = ExtendedCollection.extend({
    model: Revision,
    //url: ApiConstants.PATH_PREFIX + "/revisions",
    _queued: undefined,
    _connected: true,
    _pingId: undefined,

    initialize: function() {
        this.dispatchToken = AppDispatcher.register(this.dispatchCallback.bind(this));
        this.ping();
    },

    //TODO ping could become a request for update when we want
    // to support multiple users at the same time
    ping: function() {
        this._pingId = setTimeout(function() {
            var options = {};

            options.success = function(response) {
                this.ping();
            }.bind(this);

            options.error = function(xhr, textStatus, errorThrown) {
                var status = xhr ? xhr.status : undefined;

                switch (status) {
                    //If we get a 403 Forbidden error, the session timeout, try to refresh
                    case 403:
                        this.setConnected(false);
                        break;

                    //For other errors, retry
                    default:
                        this.ping();
                        break;
                }
            }.bind(this);

            $.ajax(ApiConstants.PATH_PREFIX + "/me/ping", options);

        }.bind(this), ApiConstants.PING_INTERVAL);
    },

    stopPing: function() {
        clearTimeout(this._pingId);
    },

    isSyncing: function() {
        return !!this._queued && this._queued.isSyncing();
    },

    isSynced: function() {
        return this.getQueueLength() === 0;
    },

    setConnected: function(connected) {
        var changed = this._connected !== connected;

        this._connected = connected;

        if (changed) {
            if (!connected) { this.stopPing(); }
            this.trigger("change");
        }
    },

    isConnected: function() {
        return this._connected;
    },

    push: function(model, options) {
        //push the model in the collection
        var revision = ExtendedCollection.prototype.push.apply(this, arguments);

        //if the model comes with a request, add it to the queue
        if (!this._queued && revision.has("request")) {
            this.queue(revision);
        }

        return revision;
    },

    hasNext: function() {
      return !!this.next();
    },

    next: function() {
        return this.find(function(revision) {
            return !revision.isSynced();
        });
    },

    getQueueLength: function() {
      return this.filter(function(revision) {
        return !revision.isSynced();
      }).length;
    },

    clearQueue: function() {
        this._queued = undefined;
        this.trigger("change");
    },

    queue: function(revision, retries) {
        if (retries === undefined) {
            retries = ApiConstants.MAX_RETRIES;
        }
        //If we reached zero, we're done
        else if (retries === 0) {
            revision.setSync(false, false);
            return;
        }

        if (!revision.has("request")) {
            return;
        }

        this._queued = revision;
        revision.setSync(true, false);

        revision.get("request").apply(revision).then(function(result) {
            var next;

            this.setConnected(true);
            revision.setSync(false, true);

            //queue the next one
            next = this.next();
            if (next) {
                this.queue(next);
            } else {
                this.clearQueue();
            }

            return Promise.resolve();

        }.bind(this)).then(undefined, function(error) {
            var status;

            if (error && error.xhr) {
                status = error.xhr.status;
            }

            switch (status) {
                //If we get a 403 Forbidden error, the session timeout, try to refresh
                case 403:
                    revision.setSync(false, false);
                    this.setConnected(false);
                    break;

                //For other errors, retry
                default:
                    //TODO store the timeout id in case we want to stop it manually
                    setTimeout(this.queue(revision, retries - 1), ApiConstants.RETRY_INTERVAL);
                    break;
            }

            console.log(error);
        }.bind(this));

        this.trigger("change");
    },

    dispatchCallback: function(payload) {
        var action = payload.action;
        switch (action.type) {

            case ActionConstants.SYNC_REVISION:
                if (!this.isSyncing()) {
                    next = this.next();
                    if (next) {
                        this.queue(next);
                    }
                }
                break;

            // PRODUCT

            case ActionConstants.CREATE_PRODUCT:
                (function() {
                    var product;
                    var bom;

                    AppDispatcher.waitFor([BomStore.dispatchToken, ProductStore.dispatchToken]);
                    product = action.result.product;
                    bom = action.result.bom;

                    this.push({
                        name: "Created product " + product.get("name"),
                        request: function() {
                            return product.save(null, {
                                waitForRelation: true
                            }).then(function(model) {
                                bom.set({
                                    id: model.get("bomIds")[0]
                                });
                            });
                        }
                    });
                }).apply(this);
                break;

            case ActionConstants.DESTROY_PRODUCT:
                //TODO add option to destroy BoMs recursively
                (function() {
                    var product;

                    AppDispatcher.waitFor([ProductStore.dispatchToken]);
                    product = action.result.product;

                    this.push({
                        name: "Deleted product " + product.get("name"),
                        request: function() {
                                return product.destroy();
                            }
                            // undo: function() {
                            //   //TODO
                            // }
                    });
                }).apply(this);
                break;

            case ActionConstants.UPDATE_PRODUCT_NAME:
                (function() {
                    var product;

                    AppDispatcher.waitFor([ProductStore.dispatchToken]);
                    product = action.result.product;

                    this.push({
                        name: "Renamed product to " + product.get("name"),
                        request: function() {
                                return product.save();
                            }
                            // undo: function() {
                            //   //TODO
                            // }
                    });
                }).apply(this);
                break;

                // BOMS

            case ActionConstants.CREATE_BOM:
                (function() {
                    var bom;
                    var product;

                    AppDispatcher.waitFor([ProductStore.dispatchToken]);

                    bom = action.result.bom;
                    product = action.result.product;

                    if (!bom || !product) {
                        return;
                    }

                    // queue revision
                    this.push({
                        name: "Added BoM " + bom.get("name"),
                        request: function() {
                            //add the parant ID to the attributes
                            //TODO this might be better handled in a save method of the model
                            var attrs = _.extend(bom.toJSON(), {
                                productId: product.id || product.cid
                            });
                            return bom.save(null, {
                                attrs: attrs
                            }).then(function(model) {
                                product.fixChildBomId(model.cid, model.id);
                            });
                        },
                        // undo: function() {
                        //   //TODO
                        // }
                    });
                }).apply(this);
                break;

            case ActionConstants.UPDATE_BOM_NAME:
                (function() {
                    var bom;

                    AppDispatcher.waitFor([BomStore.dispatchToken]);

                    bom = action.result.bom;
                    if (!bom) {
                        return;
                    }

                    // queue revision
                    this.push({
                        name: "Renamed BoM to " + bom.get("name"),
                        request: function() {
                            return bom.save();
                        },
                        // undo: function() {
                        //   //TODO
                        // }
                    });
                }).apply(this);
                break;

            case ActionConstants.DESTROY_BOM:
                (function() {
                    var bom;

                    AppDispatcher.waitFor([BomStore.dispatchToken]);

                    bom = action.result.bom;
                    if (!bom) {
                        return;
                    }

                    // queue revision
                    this.push({
                        name: "Deleted BoM " + bom.get("name"),
                        request: function() {
                            //TODO pass parent id here
                            return bom.destroy();
                        },
                        // undo: function() {
                        //   //TODO
                        // }
                    });

                }).apply(this);
                break;

                // BOM ITEMS

            case ActionConstants.UPDATE_BOM_ITEM:
                (function() {
                    var bom;
                    var field;

                    AppDispatcher.waitFor([BomStore.dispatchToken]);

                    bom = action.result.bom;
                    field = action.result.field;

                    if (!bom || !field) {
                        return;
                    }

                    //queue revision
                    this.push({
                        name: "Updated " + field.id + " to " + field.value,
                        request: function() {
                                return bom.save();
                            }
                            // undo: function() {
                            //   //TODO
                            // }
                    });

                }).apply(this);
                break;

            case ActionConstants.REMOVE_BOM_ITEMS:
                (function() {
                    var items;
                    var boms;

                    AppDispatcher.waitFor([BomStore.dispatchToken]);

                    items = action.result.items;
                    boms = action.result.boms;

                    if (!boms || !items) {
                        return;
                    }

                    //queue revision
                    this.push({
                        name: "Removed " + items.length + " items" + (items.length > 1 ? "s" : ""),
                        request: function() {
                            return Promise.all(
                                boms.map(function(bom) {
                                    return bom.save();
                                })
                            );
                        },
                        // undo: function() {
                        //   //TODO
                        // }
                    });
                }).apply(this);
                break;

            case ActionConstants.SET_BOM_COLUMN:
                (function() {
                    var bom;
                    var oldColumn;

                    AppDispatcher.waitFor([BomStore.dispatchToken]);

                    bom = action.result.bom;
                    oldColumn = action.result.oldColumn;
                    newColumn = action.result.newColumn;
                    if (!bom || !oldColumn || !newColumn) {
                        return;
                    }

                    //queue revision
                    this.push({
                        name: "Changed column " + oldColumn.name,
                        request: function() {
                            return bom.save();
                        },
                        // undo: function() {
                        //   //TODO
                        // }
                    });
                }).apply(this);
                break;

            case ActionConstants.SET_VISIBLE_BOM_COLUMNS:
                (function() {
                    var bom;
                    var newFields;

                    AppDispatcher.waitFor([BomStore.dispatchToken]);

                    bom = action.result.bom;
                    if (!bom) { return; }

                    newFields = action.result.newFields;
                    if (!_.isArray(newFields)) {
                        newFields = [];
                    }

                    //queue revision
                    this.push({
                        //TODO this can happen when removing a column from a different view than custom...
                        name: "Changed columns",
                        request: function() {
                            return Promise.all(
                                //TODO need to catch if this fails...
                                newFields.map(function(field) {
                                    if (field.isNew()) {
                                        return field.save();
                                    }
                                })
                            ).then(function(result) {
                                // Update BoM attributes with new field ids
                                _.each(newFields, function(field) {
                                    bom.fixFieldId(field.cid, field.id);
                                });

                                return bom.save();
                            });
                        },
                        // undo: function() {
                        //   //TODO
                        // }
                    });
                }).apply(this);
                break;

            case ActionConstants.HIDE_BOM_COLUMN:
                (function() {
                    var bom;
                    var column;

                    AppDispatcher.waitFor([BomStore.dispatchToken]);

                    bom = action.result.bom;
                    column = action.result.column;
                    if (!bom || !column) {
                        return;
                    }

                    //queue revision
                    this.push({
                        name: "Removed column " + column.name,
                        request: function() {
                            return bom.save();
                        },
                        // undo: function() {
                        //   //TODO
                        // }
                    });
                }).apply(this);
                break;

            case ActionConstants.IMPORT_PRODUCT:
                (function() {
                    var product;
                    var bom;
                    var newFields;

                    AppDispatcher.waitFor([ProductStore.dispatchToken]);
                    if (!action.result) { return; }

                    product = action.result.product;
                    if (!product) { return; }

                    bom = action.result.bom;
                    if (!bom) { return; }

                    newFields = action.result.newFields;
                    if (!_.isArray(newFields)) {
                        newFields = [];
                    }

                    //queue revision
                    this.push({
                        name: "Imported BoM",
                        request: function() {
                            return Promise.all(

                                //TODO need to catch if this fails...
                                newFields.map(function(field) {
                                    if (field.isNew()) {
                                        return field.save();
                                    }
                                })

                            ).then(function(result) {

                                // Update BoM attributes with new field ids
                                _.each(newFields, function(field) {
                                    bom.fixFieldId(field.cid, field.id);
                                });

                            }).then(function(result) {

                                return product.save(null, {waitForRelation: true});

                            }).then(function(product) {
                                bom.set({
                                    id: product.get("bomIds")[0],
                                });
                                return bom.save();
                            });
                        },
                    });
                }).apply(this);
                break;

            case ActionConstants.IMPORT_NEW_BOM:
                (function() {
                    var product;
                    var bom;
                    var newFields;

                    AppDispatcher.waitFor([ProductStore.dispatchToken]);
                    if (!action.result) { return; }

                    product = action.result.product;
                    if (!product) { return; }

                    bom = action.result.bom;
                    if (!bom) { return; }

                    newFields = action.result.newFields;
                    if (!_.isArray(newFields)) {
                        newFields = [];
                    }

                    //queue revision
                    this.push({
                        name: "Imported BoM",
                        request: function() {
                            return Promise.all(

                                //TODO need to catch if this fails...
                                newFields.map(function(field) {
                                    if (field.isNew()) {
                                        return field.save();
                                    }
                                })

                            ).then(function(result) {

                                // Update BoM attributes with new field ids
                                _.each(newFields, function(field) {
                                    bom.fixFieldId(field.cid, field.id);
                                });

                            }).then(function(result) {

                                var attrs = _.extend(bom.toJSON(), {
                                    productId: product.id || product.cid
                                });
                                return bom.save(null, {
                                    attrs: attrs
                                });

                            }).then(function(model) {
                                product.fixChildBomId(model.cid, model.id);
                            });
                        }
                    });
                }).apply(this);
                break;

            case ActionConstants.IMPORT_UPDATE_BOM:
                break;

            default:
                // do nothing
        }
    }

});

var RevisionStore = new RevisionCollection();

module.exports = RevisionStore;
