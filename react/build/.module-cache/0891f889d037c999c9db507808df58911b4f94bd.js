var AppDispatcher = require("../dispatcher/AppDispatcher");
var ActionConstants = require("../constants/ActionConstants");
var BomUtils = require("../utils/BomUtils");
var BomImporter = require("../utils/BomImporter");
var FieldStore = require("../stores/FieldStore");

var BomActions = {

    /**
     * Get the boms from the server.
     */
    fetchAll: function() {
        return new Promise(function(resolve, reject) {
            AppDispatcher.handleViewAction({
                type: ActionConstants.FETCH_ALL_BOMS,
                resolve: resolve,
                reject: reject
            });
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

    removeItems: function(items) {
        AppDispatcher.handleViewAction({
            type: ActionConstants.REMOVE_BOM_ITEMS,
            attributes: {
                items: items
            }
        });
    },

    updateItem: function(bomId, itemId, field, content) {
        AppDispatcher.handleViewAction({
            type: ActionConstants.UPDATE_BOM_ITEM,
            attributes: {
                bomId: bomId,
                itemId: itemId,
                field: field,
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
            type: ActionConstants.UNSELECT_BOM_ITEMS,
        });
    },

    // Columns

    // addColumn: function(bomId, column) {
    //   AppDispatcher.handleViewAction({
    //     type: ActionConstants.ADD_BOM_COLUMN,
    //     attributes: {
    //       bomId: bomId,
    //       column: column
    //     }
    //   });
    // },

    setColumn: function(bomId, column) {
        AppDispatcher.handleViewAction({
            type: ActionConstants.SET_BOM_COLUMN,
            attributes: {
                bomId: bomId,
                column: column
            }
        });
    },

    setVisibleColumns: function(bomId, columns) {
        AppDispatcher.handleViewAction({
            type: ActionConstants.SET_VISIBLE_BOM_COLUMNS,
            attributes: {
                bomId: bomId,
                columns: columns
            }
        });
    },

    hideColumn: function(bomId, columnId) {
        AppDispatcher.handleViewAction({
            type: ActionConstants.HIDE_BOM_COLUMN,
            attributes: {
                bomId: bomId,
                columnId: columnId
            }
        });
    },

    importFile: function(file, options) {
        options = options || {};

        return BomUtils.readFileAsText(file, options.encoding).then(function(result) {
            return BomImporter.import(result, options);
        }).then(function(result) {

            // Check that headers OR data were imported
            if (result.meta.fields || result.data.length) {

                //dispatch action with parsed BoM
                AppDispatcher.handleViewAction({
                    type: ActionConstants.IMPORT_BOM_FILE,
                    attributes: {
                        import: result
                    }
                });

                return result;
            }
            else {
                return Promise.reject(new Error("We did not find any data to import."));
            }
        });

        //TODO replace some of this by BomUtils.readFileAsText(file).then...
        // return new Promise(function(resolve, reject) {
        //     var reader;

        //     if (BomUtils.isFileAPIEnabled()) {

        //         reader = new FileReader();

        //         reader.onload = function(event) {
        //             var results;

        //             try {
        //                 results = BomImporter.import(event.target.result);



        //             } catch (error) {
        //                 reject(error);
        //             }
        //         };

        //         reader.readAsText(file);
        //     } else {
        //         //TODO api call to submit file and wait for response
        //         reject(new Error("File API not found"));
        //     }

        // });
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
                    parentProductId: parentProductId,
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
            type: ActionConstants.RETRY_EXPORT_BOM_ITEMS,
        });
    }

};

module.exports = BomActions;
