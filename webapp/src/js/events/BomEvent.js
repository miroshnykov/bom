"use strict";

var _ = require("underscore");

var BomEvent = function(options) {
	_.extend(this, options);
};

BomEvent.EVENT_CREATE  = "bom:create";
BomEvent.EVENT_DELETE  = "bom:delete";
BomEvent.EVENT_EXPORT  = "bom:export";
BomEvent.EVENT_IMPORT  = "bom:import";
BomEvent.EVENT_UPDATE  = "bom:update";

module.exports = BomEvent;