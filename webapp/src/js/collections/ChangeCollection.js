"use strict";

var Backbone = require("backbone");
var _ = require("underscore");
var moment = require("moment");

var ApiConstants = require("constants/ApiConstants");
var AppDispatcher = require("dispatcher/AppDispatcher");
var ActionConstants = require("constants/ActionConstants");

var ProductStore = require("stores/ProductStore");
var BomStore = require("stores/BomStore");
var UserStore = require("stores/UserStore");
var BomViewStore = require("stores/BomViewStore");

var ChangeModel = require("models/ChangeModel");
var BaseCollection = require("collections/BaseCollection");
var ChangeEvent = require("events/ChangeEvent");
var statefulMixin = require("utils/StatefulMixin");

module.exports = BaseCollection.extend({
    mixins: [
        statefulMixin
    ],

    model: ChangeModel,
    type: undefined,
    entityId: undefined,

    _queued: undefined,
    _connected: true,

    comparator: function(change) {
        return -change.get("number");
    },

    url: function() {
        return require("utils/BaseUrl").buildUrl("change");
    },

    initialize: function() {
        this.listenTo(this, "add", this.onAdd);
        this.listenTo(Backbone, ChangeEvent.EVENT_ALL, this.onChange);
    },

    onAdd: function(model) {
        // Queue change if no change is queued, and the new change has a request
        if (!this._queued && model.has("request")) {
            this.queue(model);
        }
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
                products = ProductStore.collection.getParentsOfBom(attrs.bomId);

                if (!_.isEmpty(products)) {
                    // Only one parent for now
                    attrs.productId = products[0].id || products[0].cid;
                }
            }

            attrs.createdAt = moment().unix();
        }, this);

        return BaseCollection.prototype.add.apply(this, [models, options]);
    },

    onChange: function(event) {
        if (event[this.type + "Id"] !== this.entityId) { return; }
        this.add(event);
    },

    fetch: function(options) {
        var data = {};
        data[this.type + "Id"] = this.entityId;

        options = options || {};
        options.data = _.extend({}, options.data, data);

        return BaseCollection.prototype.fetch.call(this, options);
    },

    fixProductId: function(product) {
        if (product.isNew()) { return; }

        _.each(this.getForProduct(product.cid), function(result) {
            result.set({
                productId: product.id
            }, {shouldUpdate: false});
        });
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
        var product = ProductStore.collection.get(productId);

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
                console.error(error);
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

    onLoadData: function(event) {
        if (!event.company) { return;
        }

        this.reset();
    },

    dispatchCallback: function(payload) {
        var action = payload.action;
        switch (action.type) {

            // Bom Attributes

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
                        description: "Renamed column to " + attribute.get("name"),
                        bomId: bom.id || bom.cid,
                        visible: false,
                        request: function() {
                            return attribute.save(
                                attribute.toJSON({
                                    json: {
                                        attributes: ["name"]
                                    }
                                }));
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
                        changedBy: UserStore.current.id,
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
