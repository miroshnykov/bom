"use strict";

var AppDispatcher = require("dispatcher/AppDispatcher");
var ActionConstants = require("constants/ActionConstants");

module.exports = {
	create: AppDispatcher.partial(ActionConstants.CREATE_PRODUCT)
};
