"use strict";

var AppDispatcher = require("../dispatcher/AppDispatcher");
var ActionConstants = require("../constants/ActionConstants");

var ChangeActions = {

    fetchForProduct: function(productId, count, before) {
        AppDispatcher.handleViewAction({
            type: ActionConstants.FETCH_PRODUCT_CHANGES,
            attributes: {
                productId: productId,
                count: count,
                before: before
            }
        });
    },

    fetchForBom: function(bomId, count, before, after) {
        AppDispatcher.handleViewAction({
            type: ActionConstants.FETCH_BOM_CHANGES,
            attributes: {
                bomId: bomId,
                count: count,
                before: before,
                after: after
            }
        });
    },

    fetchForItem: function(bomId, itemId, count, before, after) {
        AppDispatcher.handleViewAction({
            type: ActionConstants.FETCH_ITEM_CHANGES,
            attributes: {
                bomId: bomId,
                itemId: itemId,
                count: count,
                before: before,
                after: after
            }
        });
    },

    sync: function() {
        AppDispatcher.handleViewAction({
            type: ActionConstants.SYNC_CHANGES
        });
    },

};

module.exports = ChangeActions;
