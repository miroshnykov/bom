"use strict";

var _ = require("underscore");

var ProductEvent = function(options) {
	_.extend(this, options);
};

ProductEvent.EVENT_CREATE  = "product:create";
ProductEvent.EVENT_DELETE  = "product:delete";
ProductEvent.EVENT_UPDATE  = "product:update";

module.exports = ProductEvent;