"use strict";

var AppDispatcher = require("dispatcher/AppDispatcher");
var ActionConstants = require("constants/ActionConstants");

module.exports = {
    load:   AppDispatcher.partial(ActionConstants.LOAD_FILES),
    unload: AppDispatcher.partial(ActionConstants.UNLOAD_FILES)
};
