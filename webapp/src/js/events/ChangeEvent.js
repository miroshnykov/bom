"use strict";

var _ = require("underscore");

var ChangeEvent = function(options) {
	_.extend(this, options);
};

ChangeEvent.EVENT_ALL  = "change:";

module.exports = ChangeEvent;