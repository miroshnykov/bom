"use strict";

var _ = require("underscore");

var CommentEvent = function(options) {
	_.extend(this, options);
};

CommentEvent.EVENT_CREATE  = "comment:create";
CommentEvent.EVENT_DELETE  = "comment:delete";
CommentEvent.EVENT_UPDATE  = "comment:update";

module.exports = CommentEvent;