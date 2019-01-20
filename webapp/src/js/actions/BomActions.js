"use strict";

var AppDispatcher = require("dispatcher/AppDispatcher");
var ActionConstants = require("constants/ActionConstants");

var BomActions = {
	create: 			  AppDispatcher.partial(ActionConstants.CREATE_BOM),
    destroy:              AppDispatcher.partial(ActionConstants.DESTROY_BOM),
    update:           	  AppDispatcher.partial(ActionConstants.UPDATE_BOM),
    setAttribute:         AppDispatcher.partial(ActionConstants.SET_BOM_COLUMN),
    setVisibleAttributes: AppDispatcher.partial(ActionConstants.SET_VISIBLE_BOM_COLUMNS),
    exportItems:          AppDispatcher.partial(ActionConstants.EXPORT_BOM_ITEMS),
    retryExportItems:     AppDispatcher.partial(ActionConstants.RETRY_EXPORT_BOM_ITEMS),
};

module.exports = BomActions;
