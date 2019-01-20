"use strict";

var _ = require("underscore");

var InviteEvent = function(options) {
	_.extend(this, options);
};

InviteEvent.EVENT_CREATE  = "invite:create";
InviteEvent.EVENT_DELETE  = "invite:delete";
InviteEvent.EVENT_RESEND  = "invite:update";

module.exports = InviteEvent;