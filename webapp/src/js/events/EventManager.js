"use strict";

var _ = require("underscore");

var EventManager = function() {
	this.handlers = [
		require("events/Ajax"),
		require("events/Intercom"),
		require("events/Mixpanel"),
		require("events/Notifications"),
		require("events/Pusher")
	];
};

EventManager.prototype.start = function() {
	_.invoke(this.handlers, "start");
};

EventManager.prototype.stop = function() {
	_.invoke(this.handlers, "stop");
};

module.exports = EventManager;