"use strict";

var _ = require("underscore");

var BomItemEvent = function(options) {
	_.extend(this, options);
};

BomItemEvent.EVENT_CREATE  = "bomitem:create";
BomItemEvent.EVENT_DELETE  = "bomitem:delete";
BomItemEvent.EVENT_UPDATE  = "bomitem:update";

module.exports = BomItemEvent;