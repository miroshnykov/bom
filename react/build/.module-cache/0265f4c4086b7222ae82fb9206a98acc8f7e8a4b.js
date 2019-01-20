var AppDispatcher = require("../dispatcher/AppDispatcher");
var ApiConstants = require("../constants/ApiConstants");
var ActionConstants = require("../constants/ActionConstants");

var ProductStore = require("../stores/ProductStore");
var BomStore = require("../stores/BomStore");
var BomExportStore = require("../stores/BomExportStore");

var ChangeModel = require("../models/ChangeModel");
var ExtendedCollection = require("../utils/ExtendedCollection");
var BomUtils = require("../utils/BomUtils");

var ChangeCollection = ExtendedCollection.extend({
    model: ChangeModel,
    _queued: undefined,
    _connected: true,
    _pingId: undefined,
    _numbers: [],

    url: function() {
        return ApiConstants.PATH_PREFIX + "/" + this.getCompany() + "/change";
    },

    initialize: function() {
        this.dispatchToken = AppDispatcher.register(this.dispatchCallback.bind(this));
        this.listenTo(this, "add", this._onAdd);
        this.ping();
    },

    _onAdd: function(model, collection, options) {
        // Queue change if no change is queued, and the new change has a request
        if (!this._queued && model.has("request")) {
            this.queue(model);
        }
    },

    parse: function(resp, options) {
        if (!resp) return;

        // Get the total number of items returned
        if (resp.total_items) {
            options.count = resp.total_items;
        } else if (resp._embedded && _.isArray(resp._embedded.change)) {
            options.count = resp._embedded.change.length;
        }

        // Return the change array
        return resp._embedded ? resp._embedded.change : undefined;
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

    isSaving: function() {
        return !!this._queued && this._queued.isSaving();
    },

    isSaved: function() {
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

    // TODO allow passing Models not just objects of attributes, like normal add method
    add: function(models, options) {
        var singular = !_.isArray(models);
        models = singular ? (models ? [models] : []) : models.slice();

        _.each(models, function(attrs) {
            var products;

            if (!attrs.productId && attrs.bomId) {
                products = ProductStore.getParentsOfBom(attrs.bomId);

                if (!_.isEmpty(products)) {
                    // Only one parent for now
                    attrs.productId = products[0].id || products[0].cid;
                }
            }

            attrs.number = this._getNextNumberForProduct(attrs.productId);
            attrs.createdAt = BomUtils.getUTCDate();
        }, this);

        return ExtendedCollection.prototype.add.apply(this, [models, options]);
    },

    _getNextNumberForProduct: function(productId) {
        var changes;
        var products;

        if (!productId) { return; }

        if (this._numbers[productId] !== undefined) {
            return ++this._numbers[productId];
        }

        changes = this.getForProduct(productId);
        changes = _.sortBy(changes, function(change) {
            return change.get("number");
        });

        this._numbers[productId] = changes.length ? _.last(changes).get("number") + 1 : 1;
        return this._numbers[productId];
    },

    fixProductId: function(product) {
        if (product.isNew()) { return; }
        if (this._numbers[product.cid] === undefined) { return; }

        _.each(this.getForProduct(product.cid), function(result) {
            result.set({
                productId: product.id
            });
        });

        this._numbers[product.id] = this._numbers[product.cid];
        delete this._numbers[product.cid];
    },

    fixBomId: function(bom) {
        if (bom.isNew()) { return; }

        _.each(this.getForBom(bom.cid), function(result) {
            result.set({
                bomId: bom.id
            });
        });
    },

    fixItemId: function(item) {
        if (item.isNew()) { return; }

        _.each(this.getForItem(item.cid), function(result) {
            result.set({
                itemId: item.id
            });
        });
    },

    fixValueId: function(value) {
        if (value.isNew()) { return; }

        _.each(this.getForValue(value.cid), function(result) {
            result.set({
                valueId: value.id
            });
        });
    },

    getForProduct: function(productId) {
        var product = ProductStore.get(productId);

        var changes = this.filter(function(change) {
            var bomId = change.get("bomId");

            return change.get("productId") === productId ||
                (product && bomId && _.contains(product.getBoms(), bomId));
        });

        return changes;
    },

    getVisibleForProduct: function(productId) {
        return _.filter(this.getForProduct(productId), function(change) {
            return change.get("visible");
        });
    },

    getForBom: function(bomId) { return this.where({ bomId: bomId }); },
    getVisibleForBom: function(bomId) { return this.where({ bomId: bomId, visible: true }); },

    getForItem: function(itemId) { return this.where({ itemId: itemId }); },
    getVisibleForItem: function(itemId) { return this.where({ itemId: itemId, visible: true }); },

    getForValue: function(valueId) { return this.where({ valueId: valueId }); },
    getVisibleForValue: function(valueId) { return this.where({ valueId: valueId, visible: true }); },

    getNotSaved: function() {
        return this.filter(function(change) {
            return !change.isSaved();
        });
    },

    hasNext: function() {
      return !!this.next();
    },

    next: function() {
        return this.find(function(change) {
            return !change.isSaved();
        });
    },

    getQueueLength: function() {
      return this.filter(function(change) {
        return !change.isSaved();
      }).length;
    },

    clearQueue: function() {
        this._queued = undefined;
        this.trigger("change");
    },

    queue: function(change, retries) {
        if (retries === undefined) {
            retries = ApiConstants.MAX_RETRIES;
        }
        //If we reached zero, we're done
        else if (retries === 0) {
            change.setSaved(false);
            return;
        }

        if (!change.has("request")) {
            return;
        }

        this._queued = change;
        change.setSaving(true);

        change.get("request").apply(change).then(function(result) {
            var next;

            this.setConnected(true);
            change.setSaved(true);

            //queue the next one
            if (next = this.next()) {
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
            else {
                console.log(error);
            }

            switch (status) {
                //If we get a 403 Forbidden error, the session timeout, try to refresh
                case 403:
                    change.setSaved(false);
                    this.setConnected(false);
                    break;

                //For other errors, retry
                default:
                    //TODO store the timeout id in case we want to stop it manually
                    setTimeout(this.queue(change, retries - 1), ApiConstants.RETRY_INTERVAL);
                    break;
            }

        }.bind(this));

        this.trigger("change");
    },

    dispatchCallback: function(payload) {
        var action = payload.action;
        switch (action.type) {

            // History

            case ActionConstants.FETCH_ALL_CHANGES:
                this.fetch().then(function(collection) {
                    action.resolve(collection);
                }, function(error) {
                    console.log(error);
                    action.reject(error);
                });
                break;

            case ActionConstants.SYNC_CHANGES:
                if (!this.isSaving()) {
                    next = this.next();
                    if (next) {
                        this.queue(next);
                    }
                }
                break;

            // Company

            case ActionConstants.SELECT_COMPANY:
                (function() {
                    if (!this.validateAction(action, ["companyId"])) { return; }
                    this.setCompany(action.attributes.companyId);
                }).apply(this);
                break;

            // Product

            case ActionConstants.CREATE_PRODUCT:
                (function() {
                    var product;
                    var bom;
                    var change;

                    AppDispatcher.waitFor([BomStore.dispatchToken, ProductStore.dispatchToken]);

                    if (!this.validateAction(action, undefined, ["product", "bom"])) { return; }
                    product = action.result.product;
                    bom = action.result.bom;

                    change = "Created product \"" + product.get("name") + "\"";

                    this.add({
                        description: change,
                        productId: product.id || product.cid,
                        visible: true,
                        request: function() {
                            var attrs = _.extend(product.toJSON(), {
                                change: change
                            });

                            // Save the product, then update the bom's client id
                            // with the it of the bom that was created
                            return product.save(undefined, {
                                shouldUpdate: false,
                                attrs: attrs
                            }).then(function(product) {
                                bom.set({
                                    id: product.getBoms()[0]
                                });
                                return product;
                            }).then(function(product) {
                                ChangeStore.fixProductId(product);
                            });
                        }
                    });
                }).apply(this);
                break;

            case ActionConstants.DESTROY_PRODUCT:
                (function() {
                    var product;

                    AppDispatcher.waitFor([ProductStore.dispatchToken]);

                    if (!this.validateAction(action, undefined, ["product"])) { return; }
                    product = action.result.product;

                    this.add({
                        description: "Deleted product \"" + product.get("name") + "\"",
                        productId: product.id || product.cid,
                        visible: true,
                        request: function() {
                            return product.destroy();
                        }
                    });
                }).apply(this);
                break;

            case ActionConstants.UPDATE_PRODUCT_NAME:
                (function() {
                    var product;
                    var change;

                    AppDispatcher.waitFor([ProductStore.dispatchToken]);

                    if (!this.validateAction(action, undefined, ["product"])) { return; }
                    product = action.result.product;

                    change = "Renamed product to \"" + product.get("name") + "\"";

                    this.add({
                        description: change,
                        productId: product.id || product.cid,
                        visible: true,
                        request: function() {
                            var jsonOptions = { json: { attributes: ["name"] }};
                            var attrs = _.extend(product.toJSON(jsonOptions), {
                                change: change
                            });

                            return product.save(undefined, {
                                patch: true,
                                attrs: attrs
                            });
                       }
                    });
                }).apply(this);
                break;

            // Bom

            case ActionConstants.CREATE_BOM:
                (function() {
                    var bom;
                    var product;
                    var change;

                    AppDispatcher.waitFor([ProductStore.dispatchToken]);

                    if (!this.validateAction(action, undefined, ["product", "bom"])) { return; }
                    bom = action.result.bom;
                    product = action.result.product;

                    change = "Added BoM \"" + bom.get("name") + "\"";

                    // queue change
                    this.add({
                        description: change,
                        bomId: bom.id || bom.cid,
                        visible: true,
                        request: function() {
                            // Add the parent product id to the attributes
                            // TODO
                            // this might be better handled in a save method of the model
                            // if save on new BoM, add productId to attrs
                            var attrs = _.extend(
                                bom.toJSON(),
                                {
                                    productId: product.id || product.cid,
                                    change: change
                                }
                            );

                            // Save the new bom, and then fix its client id in the parent product
                            return bom.save(undefined, {
                                attrs: attrs
                            }).then(function(bom) {
                                product.fixChildBomId(bom);
                                return bom;
                            }).then(function(bom) {
                                ChangeStore.fixBomId(bom);
                            });
                        }
                    });
                }).apply(this);
                break;

            case ActionConstants.UPDATE_BOM_NAME:
                (function() {
                    var bom;
                    var change;

                    AppDispatcher.waitFor([BomStore.dispatchToken]);

                    if (!this.validateAction(action, undefined, ["bom"])) { return; }
                    bom = action.result.bom;

                    change = "Renamed BoM to \"" + bom.get("name") + "\"";

                    // queue change
                    this.add({
                        description: change,
                        bomId: bom.id || bom.cid,
                        visible: true,
                        request: function() {
                            var attrs = _.extend(bom.toJSON({
                                json: { attributes: ["name"] }
                            }), {
                                change: change
                            });

                            return bom.save(undefined, {
                                patch: true,
                                attrs: attrs
                            });
                        }
                    });
                }).apply(this);
                break;

            case ActionConstants.DESTROY_BOM:
                (function() {
                    var bom;
                    var product;
                    var change;

                    AppDispatcher.waitFor([BomStore.dispatchToken]);

                    if (!this.validateAction(action, undefined, ["bom", "product"])) { return; }
                    product = action.result.product;
                    bom = action.result.bom;

                    change = "Deleted BoM \"" + bom.get("name") + "\"";

                    // queue change
                    this.add({
                        description: change,
                        productId: product.id || product.cid,
                        bomId: bom.id || bom.cid,
                        visible: true,
                        request: function() {
                            return bom.destroy();
                        }
                    });

                }).apply(this);
                break;

            // Bom Items

            case ActionConstants.UPDATE_BOM_ITEM:
                (function() {
                    var bom;
                    var value;
                    var item;
                    var attribute;
                    var attrs;
                    var change;

                    AppDispatcher.waitFor([BomStore.dispatchToken]);

                    if (!this.validateAction(action, undefined, ["bom", "item", "value", "attribute"])) { return; }
                    bom = action.result.bom;
                    item = action.result.item;
                    value = action.result.value;
                    attribute = action.result.attribute;

                    // If item is new, then we must save the whole item,
                    // and include the attribute data if it is new
                    if (item.isNew()) {

                        change = "Added new item, and set " + attribute.get("name") + " to " + value.get("content");

                        attrs = item.toJSON({
                            json: {
                                associations: true
                            }
                        });

                        // If new values are assigned to new attributes, pass the attributes too
                        if (attribute.isNew()) {
                            attrs = _.extend(attrs, {
                                attributes: [ attribute.toJSON( {json: {cid: true}} ) ]
                            });
                        }

                        attrs = _.extend(attrs, { change: change });

                        // queue change
                        this.add({
                            description: change,
                            bomId: bom.id || bom.cid,
                            itemId: item.id || item.cid,
                            valueId: value.id || value.cid,
                            visible: true,
                            request: function() {
                                return item.save(undefined, {
                                    attrs: attrs
                                }).then(function(item) {
                                    // Fix ids of new attribute
                                    if (attribute.isNew()) {
                                        attribute.set({
                                            id: item.getValues().first().getAttributeId()
                                        });
                                    }
                                    return item;
                                }).then(function(item) {
                                    ChangeStore.fixItemId(item);
                                    ChangeStore.fixValueId(item.getValues().first());
                                });
                            }
                        });
                    }
                    // Else if the value is new we must save the whole value,
                    // and include the attribute data if it is new
                    else if (value.isNew()) {

                        change = "Updated " + attribute.get("name") + " to " + value.get("content");
                        attrs = value.toJSON();

                        // If value is assigned to a new attribute, pass the attribute too
                        if (attribute.isNew()) {
                            attrs = _.extend(attrs, {
                                attribute: attribute.toJSON( {json: {cid: true}} )
                            });
                        }

                        attrs = _.extend(attrs, { change: change });

                        // queue change
                        this.add({
                            description: change,
                            bomId: bom.id || bom.cid,
                            itemId: item.id || item.cid,
                            valueId: value.id || value.cid,
                            visible: true,
                            request: function() {
                                return value.save(undefined, {
                                    attrs: attrs
                                }).then(function(value) {
                                    // Fix ids of new attribute
                                    if (attribute.isNew()) {
                                        attribute.set({
                                            id: value.getAttributeId()
                                        });
                                    }
                                    return value;
                                }).then(function(value) {
                                    ChangeStore.fixValueId(value);
                                });
                            }
                        });
                    }
                    // Else if the value has not been removed from the item,
                    // then patch its content
                    else if (item.getValues().contains(value)) {
                        change = "Updated " + attribute.get("name") + " to " + value.get("content");

                        attrs = value.toJSON({
                            json: {
                                attributes: ["content"]
                            }
                        });

                        attrs = _.extend(attrs, { change: change });

                        this.push({
                            description: change,
                            bomId: bom.id || bom.cid,
                            itemId: item.id || item.cid,
                            valueId: value.id || value.cid,
                            visible: true,
                            request: function() {
                                return value.save(undefined, {
                                    patch: true,
                                    attrs: attrs
                                });
                            }
                        });

                    }
                    // Otherwise, the value has been removed, so destroy it
                    else {
                        change = "Removed " + attribute.get("name");

                        this.push({
                            description: change,
                            bomId: bom.id || bom.cid,
                            itemId: item.id || item.cid,
                            valueId: value.id || value.cid,
                            visible: true,
                            request: function() {
                                return value.destroy();
                            }
                        });
                    }

                }).apply(this);
                break;

            case ActionConstants.REMOVE_BOM_ITEMS:
                (function() {
                    var items;
                    var bom;
                    var change;

                    AppDispatcher.waitFor([BomStore.dispatchToken]);

                    if (!this.validateAction(action, undefined, ["items", "bom"])) { return; }
                    items = action.result.items;
                    bom = action.result.bom;

                    change = "Removed " + items.length + " item" + (items.length > 1 ? "s" : "");

                    //queue change
                    this.add({
                        description: change,
                        bomId: bom.id || bom.cid,
                        visible: true,
                        request: function() {
                            return Promise.all(
                                // TODO implement deleteList
                                items.map(function(item) {
                                    return item.destroy();
                                })
                            );
                        }
                    });
                }).apply(this);
                break;

            // Bom Attributes

            case ActionConstants.ADD_BOM_COLUMN:
                (function() {
                    var bom;
                    var attribute;
                    var field;

                    AppDispatcher.waitFor([BomStore.dispatchToken]);
                    if (!this.validateAction(action, undefined, ["bom", "attribute"])) { return; }

                    bom = action.result.bom;
                    attribute = action.result.attribute;
                    field = action.result.field;

                    if (attribute.isNew()) {

                        if (field && field.isNew()) {
                            //queue change
                            this.add({
                                description: "Added column " + attribute.get("name"),
                                bomId: bom.id || bom.cid,
                                visible: false,
                                request: function() {
                                    var attrs = attribute.toJSON();

                                    // If the field of the attribute is new,
                                    // pass the typeId instead of the fieldId
                                    if (field) {
                                        attrs = _.omit(attrs, "fieldId");
                                        attrs = _.extend(attrs, { typeId: field.get("typeId") });
                                    }

                                    return attribute.save(null, {
                                        shouldUpdate: false,
                                        attrs: attrs
                                    }).then(function(attribute) {
                                        field.set({id: attribute.get("fieldId")});
                                    });
                                }
                            });
                        }
                        else {
                            //queue change
                            this.add({
                                description: "Added column " + attribute.get("name"),
                                bomId: bom.id || bom.cid,
                                visible: false,
                                request: function() {
                                    return attribute.save();
                                }
                            });
                        }
                    }
                    else {
                        //queue change
                        this.add({
                            name: "Added column " + attribute.get("name"),
                            bomId: bom.id || bom.cid,
                            visible: false,
                            request: function() {
                                return attribute.save(undefined, {
                                    patch: true,
                                    json: {
                                        attributes: ["name", "position", "visible"]
                                    }
                                });
                            }
                        });
                    }
                }).apply(this);
                break;

            // TODO rename this action to SET_BOM_COLUMN_NAME
            case ActionConstants.SET_BOM_COLUMN:
                (function() {
                    var attribute;

                    AppDispatcher.waitFor([BomStore.dispatchToken]);

                    if (!this.validateAction(action, undefined, ["bom", "attribute"])) { return; }
                    bom = action.result.bom;
                    attribute = action.result.attribute;

                    //queue change
                    this.add({
                        description: "Changed column name to " + attribute.get("name"),
                        bomId: bom.id || bom.cid,
                        visible: false,
                        request: function() {
                            return attribute.save(
                                undefined,
                                {
                                    patch: true,
                                    json: {
                                        attributes: ["name"]
                                    }
                                });
                        }
                    });
                }).apply(this);
                break;

            case ActionConstants.SET_VISIBLE_BOM_COLUMNS:
                (function() {
                    var bom;
                    var newFields;

                    AppDispatcher.waitFor([BomStore.dispatchToken]);

                    if (!this.validateAction(action, undefined, ["bom"])) { return; }
                    bom = action.result.bom;

                    newFields = action.result.newFields;
                    if (!_.isArray(newFields)) { newFields = []; }

                    //queue change
                    this.add({
                        description: "Changed columns",
                        bomId: bom.id || bom.cid,
                        visible: false,
                        request: function() {
                            return Promise.all(
                                newFields.map(function(field) {
                                    if (field.isNew()) {
                                        return field.save();
                                    }
                                })
                            ).then(function(result) {
                                // Update BoM attributes with new field ids
                                _.each(newFields, function(field) {
                                    bom.getAttributes().fixFieldId(field.cid, field.id);
                                });

                                return bom.save(
                                    undefined,
                                    {
                                        patch: true,
                                        json: {
                                            attributes: false,
                                            associations: {
                                                attributes: true
                                            }
                                        }
                                    });
                            });
                        }
                    });
                }).apply(this);
                break;

            case ActionConstants.HIDE_BOM_COLUMN:
                (function() {
                    var attribute;

                    AppDispatcher.waitFor([BomStore.dispatchToken]);

                    if (!this.validateAction(action, undefined, ["bom", "attribute"])) { return; }
                    bom = action.result.bom;
                    attribute = action.result.attribute;

                    //queue change
                    this.add({
                        description: "Hide column " + attribute.name,
                        bomId: bom.id || bom.cid,
                        visible: false,
                        request: function() {
                            return attribute.save(
                                undefined,
                                {
                                    patch: true,
                                    json: {
                                        attributes: ['visible', 'position']
                                    }
                                }
                            );
                        }
                    });
                }).apply(this);
                break;

            case ActionConstants.IMPORT_PRODUCT:
                (function() {
                    var product;
                    var bom;
                    var newFields;
                    var change;

                    AppDispatcher.waitFor([ProductStore.dispatchToken]);

                    if (!this.validateAction(action, undefined, ["product", "bom"])) { return; }
                    product = action.result.product;
                    bom = action.result.bom;

                    newFields = action.result.newFields;
                    if (!_.isArray(newFields)) { newFields = []; }

                    change = "Created product \"" + product.get("name") + "\" from imported BoM";

                    //queue change
                    this.add({
                        description: change,
                        bomId: bom.id || bom.cid,
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
                                    bom.getAttributes().fixFieldId(field.cid, field.id);
                                });

                            }).then(function(result) {
                                var attrs = _.extend(product.toJSON(), {
                                    change: change
                                });

                                return product.save(null, {
                                    shouldUpdate: false,
                                    attrs: attrs
                                });

                            }).then(function(product) {
                                bom.set({
                                    id: product.getBoms()[0],
                                });
                                return bom;
                            }).then(function(bom) {
                                ChangeStore.fixBomId(bom);
                                return bom;
                            }).then(function(bom) {
                                return bom.save(undefined, {
                                    json: {
                                        associations: true
                                    }
                                });
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
                    var change;

                    AppDispatcher.waitFor([ProductStore.dispatchToken]);

                    if (!this.validateAction(action, undefined, ["product", "bom"])) { return; }
                    product = action.result.product;
                    bom = action.result.bom;

                    newFields = action.result.newFields;
                    if (!_.isArray(newFields)) { newFields = []; }

                    change = "Created BoM from import";

                    //queue change
                    this.add({
                        description: change,
                        bomId: bom.id || bom.cid,
                        request: function() {
                            return Promise.all(

                                newFields.map(function(field) {
                                    if (field.isNew()) {
                                        return field.save();
                                    }
                                })

                            ).then(function(result) {

                                // Update BoM attributes with new field ids
                                _.each(newFields, function(field) {
                                    bom.getAttributes().fixFieldId(field.cid, field.id);
                                });

                            }).then(function(result) {

                                var attrs = bom.toJSON({
                                    json: {
                                        associations: true
                                    }
                                })

                                attrs = _.extend(attrs, {
                                    productId: product.id || product.cid,
                                    change: change
                                });

                                return bom.save(null, { attrs: attrs });

                            }).then(function(bom) {
                                product.fixChildBomId(bom);
                                return bom;
                            }).then(function(bom) {
                                ChangeStore.fixBomId(bom);
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

var ChangeStore = new ChangeCollection();

module.exports = ChangeStore;
