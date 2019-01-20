"use strict";

var _ = require("underscore");
var AppDispatcher = require("../dispatcher/AppDispatcher");
var ActionConstants = require("../constants/ActionConstants");

var ExtendedCollection = require("../utils/ExtendedCollection");

var Backbone = require("backbone");
var SelectedBomItemModel = Backbone.Model.extend({});

var SelectedBomItemCollection = ExtendedCollection.extend({
    model: SelectedBomItemModel,

    initialize: function() {
        this.dispatchToken = AppDispatcher.register(this.dispatchCallback.bind(this));
    },

    isAnySelected: function() {
        return this.length > 0;
    },

    select: function(bomId, itemId) {
        this.selectWhere( {bomId: bomId, itemId: itemId} );
    },

    selectWhere: function(attributes) {
        // Check if the item is already present/selected
        var item = this.findWhere(attributes);
        if (item) { return; }

        // If not, then select it
        this.push(attributes);
    },

    unselect: function(bomId, itemId) {
        this.unselectWhere( {bomId: bomId, itemId: itemId} );
    },

    unselectWhere: function(attributes) {
        // Check if the item is already present/selected
        var item = this.findWhere(attributes);

        //Unselect
        if (item) { this.remove(item); }
    },

    unselectBom: function(bomIds) {
        var singular = !_.isArray(bomIds);
        bomIds = singular ? (bomIds ? [bomIds] : []) : bomIds.slice();

        _.each(bomIds, function(result) {
            console.log("unselecting bom: "+result);
            this.unselectWhere( {bomId: result} );
        }, this);
    },

    getItemIdsForBom: function(bomId) {
        return this.where({
            bomId: bomId
        }).map(function(result) {
            return result.get("itemId");
        });
    },

    dispatchCallback: function(payload) {
        var action = payload.action;
        switch (action.type) {

            case ActionConstants.SELECT_BOM_ITEM:
                (function() {
                    if (!this.validateAction(action, ["bomId", "itemId"])) {
                        return;
                    }

                    if (action.attributes.select) {
                        if (action.attributes.reset) {
                            this.reset();
                        }

                        this.select(action.attributes.bomId, action.attributes.itemId);

                    } else {
                        if (action.attributes.reset) {
                            this.reset();
                        } else {
                            this.unselect(action.attributes.bomId, action.attributes.itemId);
                        }
                    }
                }).apply(this);
                break;

            case ActionConstants.REMOVE_BOM_ITEMS:
                (function() {
                    var items;

                    if (!this.validateAction(action, ["items"])) {
                        return;
                    }

                    items = action.attributes.items;
                    if (!items.length) {
                        return;
                    }

                    _.each(items, function(result) {
                        var item = this.findWhere({
                            bomId: result.bomId,
                            itemId: result.itemId
                        });
                        this.remove(item);
                    }, this);
                }).apply(this);
                break;

            case ActionConstants.UNSELECT_BOM_ITEMS:
                (function() {
                    if (!this.validateAction(action)) {
                        return;
                    }

                    this.reset();
                }).apply(this);
                break;

            default:
                // do nothing
        }
    }

});

var SelectedBomItemStore = new SelectedBomItemCollection();

module.exports = SelectedBomItemStore;
