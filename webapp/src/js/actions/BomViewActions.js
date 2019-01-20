"use strict";

var AppDispatcher = require("dispatcher/AppDispatcher");
var ActionConstants = require("constants/ActionConstants");

var BomViewActions = {
    create:  AppDispatcher.partial(ActionConstants.CREATE_BOM_VIEW),
    update:  AppDispatcher.partial(ActionConstants.UPDATE_BOM_VIEW),
    destroy: AppDispatcher.partial(ActionConstants.DESTROY_BOM_VIEW)
};

module.exports = BomViewActions;
