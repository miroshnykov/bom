"use strict";

var _ = require("underscore");

var UserEvent = function(options) {
	_.extend(this, options);
};

UserEvent.EVENT_LOG_IN        = "user:log_in";
UserEvent.EVENT_LOAD_DATA     = "user:load_data";
UserEvent.EVENT_LOG_OUT       = "user:log_out";
UserEvent.EVENT_CHANGE        = "user:change";
UserEvent.EVENT_CONFIG_UPDATE = "user:config_update";

module.exports = UserEvent;
