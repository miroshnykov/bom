"use strict";

var AppDispatcher = require("../dispatcher/AppDispatcher");
var ActionConstants = require("../constants/ActionConstants");

var BomViewActions = {

    /**
     * Get the views from the server.
     */
    // fetchAll: function() {
    //     return new Promise(function(resolve, reject) {
    //         AppDispatcher.handleViewAction({
    //             type: ActionConstants.FETCH_ALL_BOM_VIEWS,
    //             resolve: resolve,
    //             reject: reject
    //         });
    //     });
    // },

    /**
     * @param  {string} name
     * @param  {array}  fieldIds
     */
    create: function(name, fieldIds) {
        return new Promise(function(resolve, reject) {
            AppDispatcher.handleViewAction({
                type: ActionConstants.CREATE_BOM_VIEW,
                attributes: {
                    name: name,
                    fieldIds: fieldIds
                },
                resolve: resolve,
                reject: reject
            });
        });
    },

    /**
     * @param  {string} name
     * @param  {array}  fieldIds
     */
    update: function(viewId, name, fieldIds) {
        return new Promise(function(resolve, reject) {
            AppDispatcher.handleViewAction({
                type: ActionConstants.UPDATE_BOM_VIEW,
                attributes: {
                    viewId: viewId,
                    name: name,
                    fieldIds: fieldIds
                },
                resolve: resolve,
                reject: reject
            });
        });
    },

    /**
     * @param  {string} id
     */
    destroy: function(viewId) {
        return new Promise(function(resolve, reject) {
            AppDispatcher.handleViewAction({
                type: ActionConstants.DESTROY_BOM_VIEW,
                attributes: {
                    viewId: viewId
                },
                resolve: resolve,
                reject: reject
            });
        });
    }
};

module.exports = BomViewActions;
