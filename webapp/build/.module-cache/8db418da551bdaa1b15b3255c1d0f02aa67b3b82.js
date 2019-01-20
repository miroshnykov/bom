"use strict";

var AppDispatcher = require("../dispatcher/AppDispatcher");
var ActionConstants = require("../constants/ActionConstants");

var ProductActions = {
    /**
     * Get the products from the server.
     */
    fetchAll: function() {
        return new Promise(function(resolve, reject) {
            AppDispatcher.handleViewAction({
                type: ActionConstants.FETCH_ALL_PRODUCTS,
                resolve: resolve,
                reject: reject
            });
        });
    },

    /**
     * @param  {string} name
     */
    create: function(name) {
        name = name ? name.trim() : undefined;
        if (!name) { return; }

        AppDispatcher.handleViewAction({
            type: ActionConstants.CREATE_PRODUCT,
            attributes: { name: name }
        });
    },

    /**
     * @param  {string} id
     */
    destroy: function(id) {
        AppDispatcher.handleViewAction({
            type: ActionConstants.DESTROY_PRODUCT,
            attributes: { id: id }
        });
    },

    /**
     * @param  {string} id The ID of the product item
     * @param  {object} attributes
     */
    updateName: function(id, name) {
        if (!id) { return; }

        name = name ? name.trim() : undefined;
        if (!name) { return; }

        AppDispatcher.handleViewAction({
            type: ActionConstants.UPDATE_PRODUCT_NAME,
            attributes: {
                id: id,
                name: name
            }
        });
    },

    fetchComments: function(productId, count) {
        AppDispatcher.handleViewAction({
            type: ActionConstants.FETCH_PRODUCT_COMMENTS,
            attributes: {
                productId: productId,
                count: count
            }
        });
    },

    createComment: function(productId, body) {
        AppDispatcher.handleViewAction({
            type: ActionConstants.CREATE_PRODUCT_COMMENT,
            attributes: {
                productId: productId,
                body: body
            }
        });
    },

    updateComment: function(productId, commentId, body) {
        AppDispatcher.handleViewAction({
            type: ActionConstants.UPDATE_PRODUCT_COMMENT,
            attributes: {
                productId: productId,
                commentId: commentId,
                body: body
            }
        });
    },

    destroyComment: function(productId, commentId) {
        AppDispatcher.handleViewAction({
            type: ActionConstants.DESTROY_PRODUCT_COMMENT,
            attributes: {
                productId: productId,
                commentId: commentId,
            }
        });
    }
};

module.exports = ProductActions;
