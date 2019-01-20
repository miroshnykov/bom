"use strict";

var _ = require("underscore");

var FileEvent = function(options) {
    _.extend(this, options);
};

FileEvent.EVENT_CREATE  = "file:create";
FileEvent.EVENT_DELETE  = "file:delete";
FileEvent.EVENT_UPDATE  = "file:update";

module.exports = FileEvent;
