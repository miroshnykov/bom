"use strict";

var _ = require("underscore");
var Backbone = require("backbone");
var UserEvent = require("events/UserEvent");
var BomEvent = require("events/BomEvent");
var config = require("config");

var appId = config.intercomToken;

module.exports = _.extend({
	start: function() {
		this.listenTo(Backbone, UserEvent.EVENT_LOG_IN,  this.onLogin);
		this.listenTo(Backbone, UserEvent.EVENT_LOG_OUT, this.onLogout);
		this.listenTo(Backbone, UserEvent.EVENT_CHANGE,  this.onUserChanged);

		this.listenTo(Backbone, BomEvent.EVENT_EXPORT, _.partial(this.trackEvent, "bom-export"));
		this.listenTo(Backbone, BomEvent.EVENT_IMPORT, _.partial(this.trackEvent, "bom-import"));
		this.listenTo(Backbone, BomEvent.EVENT_CREATE, _.partial(this.trackEvent, "bom-create"));
		this.listenTo(Backbone, BomEvent.EVENT_DELETE, _.partial(this.trackEvent, "bom-delete"));
	},

	stop: function() {
		this.stopListening();
	},

	trackEvent: function(action, event) {
		if(event && event.eventIsLocal === false) {
			// For events received from Pusher, don't update Intercom
			return;
		}
		window.Intercom("trackEvent", action);
	},

	onLogin: function(event) {
		this.validateUserEvent(event);

		var options = this.buildOptions(event, {app_id: appId });

       	window.Intercom("boot", options);
	},

	onLogout: function() {
		window.Intercom("shutdown");
	},

	onUserChanged: function(event) {
		this.validateUserEvent(event);

		var options = this.buildOptions(event);

		if(_.isEmpty(options)){
			// Nothing to update
			return;
		}

		window.Intercom("update", options);
	},

	buildOptions: function(event, options) {
		options = options || {};

		if(event.fullName){
			_.extend(options, {
				name: event.fullName
			});
		}

		if(event.email){
			_.extend(options, {
				email: event.email
			});
		}

		if(event.companyToken && event.companyName){
			_.extend(options, {
				company: {
					name: event.companyName,
					id: event.companyToken
				}
			});
		}

		return options;
	},

	validateUserEvent: function(event) {
		if(!(event instanceof UserEvent)) {
			throw new TypeError("Event is not a UserEvent");
		}
	}

}, Backbone.Events);
