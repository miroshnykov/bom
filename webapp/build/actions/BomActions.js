"use strict";

var AppDispatcher = require("../dispatcher/AppDispatcher");
var ActionConstants = require("../constants/ActionConstants");
var BomUtils = require("../utils/BomUtils");
var BomImporter = require("../utils/BomImporter");

var BomActions = {

    /**
     * Get the boms from the server.
     */
    // fetchAll: function() {
    //     return new Promise(function(resolve, reject) {
    //         AppDispatcher.handleViewAction({
    //             type: ActionConstants.FETCH_ALL_BOMS,
    //             resolve: resolve,
    //             reject: reject
    //         });
    //     });
    // },

    /**
     * Fetch a bom from the server.
     *
     * @param {number} bomId
     */
    fetch: function(bomId) {
        AppDispatcher.handleViewAction({
            type: ActionConstants.FETCH_BOM,
            attributes: {
                bomId: bomId
            }
        });
    },

    /**
     * @param  {string} name
     * @param  {number} parentId
     */
    create: function(name, productId) {
        AppDispatcher.handleViewAction({
            type: ActionConstants.CREATE_BOM,
            attributes: {
                name: name,
                productId: productId
            }
        });
    },

    /**
     * @param  {number} id
     * @param  {string} name
     */
    updateName: function(id, name) {
        AppDispatcher.handleViewAction({
            type: ActionConstants.UPDATE_BOM_NAME,
            attributes: {
                id: id,
                name: name
            }
        });
    },

    /**
     * @param  {string} id
     */
    destroy: function(bomId) {
        AppDispatcher.handleViewAction({
            type: ActionConstants.DESTROY_BOM,
            attributes: {
                bomId: bomId
            }
        });
    },

    fetchComments: function(bomId, count) {
        AppDispatcher.handleViewAction({
            type: ActionConstants.FETCH_BOM_COMMENTS,
            attributes: {
                bomId: bomId,
                count: count
            }
        });
    },

    createComment: function(bomId, body) {
        AppDispatcher.handleViewAction({
            type: ActionConstants.CREATE_BOM_COMMENT,
            attributes: {
                bomId: bomId,
                body: body
            }
        });
    },

    updateComment: function(bomId, commentId, body) {
        AppDispatcher.handleViewAction({
            type: ActionConstants.UPDATE_BOM_COMMENT,
            attributes: {
                bomId: bomId,
                commentId: commentId,
                body: body
            }
        });
    },

    destroyComment: function(bomId, commentId) {
        AppDispatcher.handleViewAction({
            type: ActionConstants.DESTROY_BOM_COMMENT,
            attributes: {
                bomId: bomId,
                commentId: commentId
            }
        });
    },

    // Items

    /**
     * @param  {string} name
     */
    addItem: function(bomId, index) {
        if (!bomId) {
            return;
        }

        AppDispatcher.handleViewAction({
            type: ActionConstants.ADD_BOM_ITEM,
            attributes: {
                bomId: bomId,
                index: index
            }
        });
    },

    removeItems: function(bomId, items) {
        AppDispatcher.handleViewAction({
            type: ActionConstants.REMOVE_BOM_ITEMS,
            attributes: {
                bomId: bomId,
                items: items
            }
        });
    },

    updateItem: function(bomId, itemId, attribute, content) {
        AppDispatcher.handleViewAction({
            type: ActionConstants.UPDATE_BOM_ITEM,
            attributes: {
                bomId: bomId,
                itemId: itemId,
                attribute: attribute,
                content: content
            }
        });
    },

    selectItem: function(bomId, itemId, select, reset) {
        AppDispatcher.handleViewAction({
            type: ActionConstants.SELECT_BOM_ITEM,
            attributes: {
                bomId: bomId,
                itemId: itemId,
                select: select,
                reset: reset ? reset : true
            }
        });
    },

    unselectItems: function() {
        AppDispatcher.handleViewAction({
            type: ActionConstants.UNSELECT_BOM_ITEMS
        });
    },

    fetchItemComments: function(bomId, itemId, count) {
        AppDispatcher.handleViewAction({
            type: ActionConstants.FETCH_BOM_ITEM_COMMENTS,
            attributes: {
                bomId: bomId,
                itemId: itemId,
                count: count
            }
        });
    },

    createItemComment: function(bomId, itemId, body) {
        AppDispatcher.handleViewAction({
            type: ActionConstants.CREATE_BOM_ITEM_COMMENT,
            attributes: {
                bomId: bomId,
                itemId: itemId,
                body: body
            }
        });
    },

    updateItemComment: function(bomId, itemId, commentId, body) {
        AppDispatcher.handleViewAction({
            type: ActionConstants.UPDATE_BOM_ITEM_COMMENT,
            attributes: {
                bomId: bomId,
                itemId: itemId,
                commentId: commentId,
                body: body
            }
        });
    },

    destroyItemComment: function(bomId, itemId, commentId) {
        AppDispatcher.handleViewAction({
            type: ActionConstants.DESTROY_BOM_ITEM_COMMENT,
            attributes: {
                bomId: bomId,
                itemId: itemId,
                commentId: commentId
            }
        });
    },

    // Columns

    addAttribute: function(bomId, attribute) {
        AppDispatcher.handleViewAction({
            type: ActionConstants.ADD_BOM_COLUMN,
            attributes: {
                bomId: bomId,
                attribute: attribute
            }
        });
    },

    setAttribute: function(bomId, attribute) {
        AppDispatcher.handleViewAction({
            type: ActionConstants.SET_BOM_COLUMN,
            attributes: {
                bomId: bomId,
                attribute: attribute
            }
        });
    },

    setVisibleAttributes: function(bomId, columns) {
        AppDispatcher.handleViewAction({
            type: ActionConstants.SET_VISIBLE_BOM_COLUMNS,
            attributes: {
                bomId: bomId,
                columns: columns
            }
        });
    },

    hideColumn: function(bomId, attributeId) {
        AppDispatcher.handleViewAction({
            type: ActionConstants.HIDE_BOM_COLUMN,
            attributes: {
                bomId: bomId,
                attributeId: attributeId
            }
        });
    },

    importFile: function(file, options) {
        options = options || {};

        return BomUtils.readFileAsText(file, options.encoding).then(function(result) {
            return BomImporter.importCSV(result, options);
        }).then(function(result) {

            // Check that headers OR data were imported
            if (result.meta.fields || result.data.length) {

                //dispatch action with parsed BoM
                AppDispatcher.handleViewAction({
                    type: ActionConstants.IMPORT_BOM_FILE,
                    attributes: {
                        bom: result
                    }
                });

                return result;
            }
            else {
                return Promise.reject(new Error("We did not find any data to import."));
            }
        });
    },

    importNewProduct: function(importedBomId, attributes) {
        return new Promise(function(resolve, reject) {
            AppDispatcher.handleViewAction({
                type: ActionConstants.IMPORT_PRODUCT,
                resolve: resolve,
                reject: reject,
                attributes: {
                    importedBomId: importedBomId,
                    attributes: attributes
                }
            });
        });
    },

    importNewBom: function(importedBomId, attributes, parentProductId) {
        return new Promise(function(resolve, reject) {
            AppDispatcher.handleViewAction({
                type: ActionConstants.IMPORT_NEW_BOM,
                resolve: resolve,
                reject: reject,
                attributes: {
                    importedBomId: importedBomId,
                    attributes: attributes,
                    parentProductId: parentProductId
                }
            });
        });
    },

    importUpdateBom: function(importedBomId, attributes, targetBomId) {
        AppDispatcher.handleViewAction({
            type: ActionConstants.IMPORT_UPDATE_BOM,
            attributes: {
                importedBomId: importedBomId,
                attributes: attributes,
                targetBomId: targetBomId
            }
        });
    },

    exportItems: function(attributes, itemIds) {
        AppDispatcher.handleViewAction({
            type: ActionConstants.EXPORT_BOM_ITEMS,
            attributes: {
                attributes: attributes,
                itemIds: itemIds
            }
        });
    },

    retryExportItems: function() {
        AppDispatcher.handleViewAction({
            type: ActionConstants.RETRY_EXPORT_BOM_ITEMS
        });
    }

};

module.exports = BomActions;
