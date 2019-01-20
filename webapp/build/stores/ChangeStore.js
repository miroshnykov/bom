"use strict";

var _ = require("underscore");
var moment = require("moment");

var AppDispatcher = require("../dispatcher/AppDispatcher");
var ApiConstants = require("../constants/ApiConstants");
var ActionConstants = require("../constants/ActionConstants");

var ProductStore = require("../stores/ProductStore");
var BomStore = require("../stores/BomStore");

var BomViewStore = require("../stores/BomViewStore");
var CompanyStore = require("../stores/CompanyStore");

var ChangeModel = require("../models/ChangeModel");
var ExtendedCollection = require("../utils/ExtendedCollection");

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

    _onAdd: function(model) {
        // Queue change if no change is queued, and the new change has a request
        if (!this._queued && model.has("request")) {
            this.queue(model);
        }
    },

    parse: function(resp, options) {
        if (!resp) {
            return;
        }

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

            options.success = function() {
                this.ping();
            }.bind(this);

            options.error = function(xhr) {
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
            attrs.createdAt = moment().unix();
        }, this);

        return ExtendedCollection.prototype.add.apply(this, [models, options]);
    },

    _getNextNumberForProduct: function(productId) {
        var changes;

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

    _setLastNumberForProduct: function(productId, number) {
        this._numbers[productId] = number;
    },

    fixProductId: function(product) {
        if (product.isNew()) { return; }
        if (this._numbers[product.cid] === undefined) { return; }

        _.each(this.getForProduct(product.cid), function(result) {
            result.set({
                productId: product.id
            }, {shouldUpdate: false});
        });

        this._numbers[product.id] = this._numbers[product.cid];
        delete this._numbers[product.cid];
    },

    fixBomId: function(bom, options) {
        if (bom.isNew()) { return; }

        _.each(this.getForBom(bom.cid), function(result) {
            result.set({
                bomId: bom.id
            }, options);
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
        // TODO pass object instead
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

    getLastConsecutiveForProduct: function(productId) {
        var prev;
        var changes = this.getForProduct(productId);
        changes = _.sortBy(changes, function(change) {
            return -change.get("number");
        });

        _.every(changes, function(change) {
            if (prev && (prev.get("number") !== change.get("number")+1)) {
                return false;
            }
            prev = change;
            return true;
        });

        return prev;
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

        change.get("request").apply(change).then(function() {
            var next;

            this.setConnected(true);
            change.setSaved(true);

            //queue the next one
            if ((next = this.next())) {
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

            case ActionConstants.FETCH_PRODUCT_CHANGES:
                (function() {
                    var data;
                    var product;

                    AppDispatcher.waitFor([ProductStore.dispatchToken]);

                    if (!this.validateAction(action, ["productId", "count"], ["product"])) { return; }

                    product = action.result.product;
                    data = {
                        productId: action.attributes.productId,
                        count: action.attributes.count,
                        before: action.attributes.before
                    };

                    product.setLoadingChanges(true);

                    this.fetch({data: data, remove: false}).then(function() {
                        product.setLoadingChanges(false);
                    }, function(error) {
                        product.setLoadingChanges(false);
                        console.log(error);
                    });
                }).apply(this);
                break;

            case ActionConstants.FETCH_BOM_CHANGES:
                (function() {
                    var data;
                    var bom;
                    var prevLength;
                    var count;
                    var before;
                    var after;

                    AppDispatcher.waitFor([BomStore.dispatchToken]);

                    if (!this.validateAction(action, ["bomId"], ["bom"])) { return; }

                    bom = action.result.bom;
                    count = action.attributes.count;
                    before = action.attributes.before;
                    after = action.attributes.after;
                    data = {
                        bomId: action.attributes.bomId,
                        count: count,
                        before: before,
                        after: after
                    };

                    bom.setLoadingChanges(true);

                    prevLength = this.length;

                    this.fetch({data: data, remove: false}).then(function(collection) {
                        bom.setLoadingChanges(false);
                        bom.setLoadedAllChanges(
                            (count === undefined && !after && !before) ||
                            (count &&
                            (collection.length-prevLength < count ||
                             before-count <= 0))
                        );
                    }, function(error) {
                        bom.setLoadingChanges(false);
                        console.log(error);
                    });
                }).apply(this);
                break;

            case ActionConstants.FETCH_ITEM_CHANGES:
                (function() {
                    var data;
                    var item;
                    var count;
                    var prevLength;
                    var before;
                    var after;

                    AppDispatcher.waitFor([BomStore.dispatchToken]);

                    if (!this.validateAction(action, ["itemId"], ["item"])) { return; }

                    item = action.result.item;
                    count = action.attributes.count;
                    before = action.attributes.before;
                    after = action.attributes.after;
                    data = {
                        itemId: action.attributes.itemId,
                        count: count,
                        before: before,
                        after: after
                    };

                    item.setLoadingChanges(true);

                    prevLength = this.length;

                    this.fetch({data: data, remove: false}).then(function(collection) {
                        item.setLoadingChanges(false);
                        item.setLoadedAllChanges(
                            (count === undefined && !after && !before) ||
                            (count &&
                            (collection.length-prevLength < count ||
                             before-count <= 0))
                        );
                    }, function(error) {
                        item.setLoadingChanges(false);
                        console.log(error);
                    });
                }).apply(this);
                break;

            case ActionConstants.SYNC_CHANGES:
                (function() {
                    var next;
                    if (!this.isSaving()) {
                        next = this.next();
                        if (next) {
                            this.queue(next);
                        }
                    }
                }).apply(this);
                break;

            // Company

            case ActionConstants.SELECT_COMPANY:
                (function() {
                    var company;
                    var data;

                    AppDispatcher.waitFor([CompanyStore.dispatchToken]);

                    if (!this.validateAction(action, undefined, ["company"])) {
                        return;
                    }

                    company = action.result.company;
                    this.reset();
                    this.setCompany(company.id);

                    if (company.has("data")) {
                        data = company.get("data");

                        if (_.isArray(data.products)) {
                            _.each(data.products, function(product) {
                                this._setLastNumberForProduct(product.id || product.cid, product.totalChanges);
                            }, this);
                        }
                    }

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
                                ChangeStore.fixProductId(product);
                                return product;
                            }).then(function(product) {
                                bom.set({
                                    id: product.getBoms()[0]
                                });
                                bom.trigger("sync");
                                return product;
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

            // Comments

            case ActionConstants.CREATE_PRODUCT_COMMENT:
            case ActionConstants.CREATE_BOM_ITEM_COMMENT:
            case ActionConstants.CREATE_BOM_COMMENT:
                (function() {
                    var comment;

                    if (!this.validateAction(action, undefined, ["comment"])) { return; }

                    comment = action.result.comment;
                    if (!comment) { return; }

                    this.add({
                        visible: false,
                        request: function() {
                            return comment.save();
                       }
                    });
                }).apply(this);
                break;

            case ActionConstants.UPDATE_PRODUCT_COMMENT:
            case ActionConstants.UPDATE_BOM_ITEM_COMMENT:
            case ActionConstants.UPDATE_BOM_COMMENT:
                (function() {
                    var comment;

                    if (!this.validateAction(action, undefined, ["comment"])) { return; }

                    comment = action.result.comment;
                    if (!comment) { return; }

                    this.add({
                        visible: false,
                        request: function() {
                            var attrs = comment.toJSON({
                                json: {
                                    attributes: ["body"]
                                }
                            });

                            return comment.save(undefined, {
                                patch: true,
                                attrs: attrs
                            });
                       }
                    });
                }).apply(this);
                break;

            case ActionConstants.DESTROY_PRODUCT_COMMENT:
            case ActionConstants.DESTROY_BOM_ITEM_COMMENT:
            case ActionConstants.DESTROY_BOM_COMMENT:
                (function() {
                    var comment;

                    if (!this.validateAction(action, undefined, ["comment"])) { return; }

                    comment = action.result.comment;
                    if (!comment) { return; }

                    this.add({
                        visible: false,
                        request: function() {
                            return comment.destroy();
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

                    if (!this.validateAction(action, undefined, ["bom", "item", "value", "attribute"])) {
                        //TODO if the action fails, we should be able to display feedback to the user
                        return;
                    }

                    bom = action.result.bom;
                    item = action.result.item;
                    value = action.result.value;
                    attribute = action.result.attribute;

                    // If item is new, then we must save the whole item,
                    // and include the attribute data if it is new
                    if (item.isNew()) {

                        // Change for history
                        change = "Added new item, and set " + attribute.get("name") + " to " + value.get("content");

                        attrs = item.toJSON({
                            json: { associations: true }
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
                                        attribute.trigger("sync");
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
                                        attribute.trigger("sync");
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

            case ActionConstants.ADD_BOM_ITEM:
                (function() {
                    var item;
                    var bom;
                    var change;
                    var attrs;

                    AppDispatcher.waitFor([BomStore.dispatchToken]);

                    if (!this.validateAction(action, undefined, ["item", "bom"])) { return; }
                    item = action.result.item;
                    bom = action.result.bom;

                    change = "Added 1 item";

                    attrs = item.toJSON({
                        json: { associations: true }
                    });

                    attrs = _.extend(attrs, { change: change });

                    //queue change
                    this.add({
                        description: change,
                        bomId: bom.id || bom.cid,
                        itemId: item.id || item.cid,
                        visible: true,
                        request: function() {
                            return item.save(undefined, {
                                attrs: attrs
                            }).then(function(item) {
                                ChangeStore.fixItemId(item);
                            });
                        }
                    });
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
                                        field.trigger("sync");
                                        return field;
                                    }).then(function() {
                                        bom.getAttributes().each(function(result) {
                                            result.trigger("sync");
                                        });
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
                                    return attribute.save().then(function() {
                                        bom.getAttributes().each(function(result) {
                                            result.trigger("sync");
                                        });
                                    });
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
                                }).then(function() {
                                    bom.getAttributes().each(function(result) {
                                        result.trigger("sync");
                                    });
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
                    var bom;

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
                            ).then(function() {
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
                                    }).then(function(bom) {
                                        bom.getAttributes().each(function(result) {
                                            result.trigger("sync");
                                         });
                                    });
                            });
                        }
                    });
                }).apply(this);
                break;

            case ActionConstants.HIDE_BOM_COLUMN:
                (function() {
                    var attribute;
                    var bom;

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
                                        attributes: ["visible", "position"]
                                    }
                                }
                            ).then(function(){
                                bom.getAttributes().each(function(attribute){
                                    attribute.trigger("sync");
                                });
                            });
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

                            ).then(function() {

                                // Update BoM attributes with new field ids
                                _.each(newFields, function(field) {
                                    bom.getAttributes().fixFieldId(field.cid, field.id);
                                });

                            }).then(function() {
                                var attrs = _.extend(product.toJSON(), {
                                    change: change
                                });

                                return product.save(null, {
                                    shouldUpdate: false,
                                    attrs: attrs
                                });

                            }).then(function(product) {
                                bom.set({
                                    id: product.getBoms()[0]
                                }, {shouldUpdate: false});

                                return bom;
                            }).then(function(bom) {
                                ChangeStore.fixBomId(bom, {shouldUpdate: false});
                                return bom;
                            }).then(function(bom) {
                                return bom.save(undefined, {
                                    json: {
                                        associations: true
                                    }
                                });
                            }).then(function() {
                                //bom.trigger("sync");
                            });
                        }
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

                            ).then(function() {

                                // Update BoM attributes with new field ids
                                _.each(newFields, function(field) {
                                    bom.getAttributes().fixFieldId(field.cid, field.id);
                                });

                            }).then(function() {

                                var attrs = bom.toJSON({
                                    json: {
                                        associations: true
                                    }
                                });

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
                                return bom;
                            });
                        }
                    });
                }).apply(this);
                break;

            case ActionConstants.IMPORT_UPDATE_BOM:
                break;

            // Bom View

            case ActionConstants.CREATE_BOM_VIEW:
                (function() {
                    var view;

                    AppDispatcher.waitFor([BomViewStore.dispatchToken]);

                    if (!this.validateAction(action, undefined, ["view"])) { return; }
                    view = action.result.view;

                    // queue change
                    this.add({
                        visible: false,
                        request: function() {
                            return view.save();
                        }
                    });
                }).apply(this);
                break;

            case ActionConstants.UPDATE_BOM_VIEW:
                (function() {
                    var view;

                    AppDispatcher.waitFor([BomViewStore.dispatchToken]);

                    if (!this.validateAction(action, undefined, ["view"])) { return; }
                    view = action.result.view;

                    // TODO this should patch only changed attributes

                    this.add({
                        visible: false,
                        request: function() {
                            var attrs = view.toJSON({
                                json: {
                                    attributes: ["name", "fieldIds"]
                                }
                            });
                            return view.save(undefined, {
                                patch: true,
                                attrs: attrs
                            });
                       }
                    });
                }).apply(this);
                break;

            case ActionConstants.DESTROY_BOM_VIEW:
                (function() {
                    var view;

                    AppDispatcher.waitFor([BomViewStore.dispatchToken]);

                    if (!this.validateAction(action, undefined, ["view"])) { return; }
                    view = action.result.view;

                    this.add({
                        visible: false,
                        request: function() {
                            return view.destroy();
                        }
                    });
                }).apply(this);
                break;

            default:
                // do nothing
        }
    }

});

var ChangeStore = new ChangeCollection();

module.exports = ChangeStore;
