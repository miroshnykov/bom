"use strict";

var ActionConstants = require("constants/ActionConstants");
var AppDispatcher = require("dispatcher/AppDispatcher");

module.exports = {
    dismissHint: AppDispatcher.partial(ActionConstants.DISMISS_HINT),
    completeTutorial: AppDispatcher.partial(ActionConstants.COMPLETE_TUTORIAL)
};
