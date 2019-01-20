"use strict";

var AppDispatcher = require("dispatcher/AppDispatcher");
var ActionConstants = require("constants/ActionConstants");

module.exports = {
	load:   AppDispatcher.partial(ActionConstants.LOAD_STREAM),
	unload: AppDispatcher.partial(ActionConstants.UNLOAD_STREAM)
};
