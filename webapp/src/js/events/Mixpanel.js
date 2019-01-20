/* global mixpanel: false */
"use strict";

var _ = require("underscore");
var Backbone = require("backbone");
var BomEvent = require("events/BomEvent");
var BomItemEvent = require("events/BomItemEvent");
var CommentEvent = require("events/CommentEvent");
var InviteEvent = require("events/InviteEvent");
var ProductEvent = require("events/ProductEvent");
var UserEvent = require("events/UserEvent");
var UserStore = require("stores/UserStore");

module.exports = _.extend({
	start: function() {
		this.listenTo(Backbone, UserEvent.EVENT_LOG_IN, this.onLogin);
		this.listenTo(Backbone, UserEvent.EVENT_CHANGE, this.onUserUpdate);
		this.listenTo(Backbone, UserEvent.EVENT_LOG_OUT, _.partial(this.trackEvent, "Logged Out"));

		this.listenTo(Backbone, BomEvent.EVENT_EXPORT, _.partial(this.trackEvent, "Bom Export"));
		this.listenTo(Backbone, BomEvent.EVENT_IMPORT, _.partial(this.trackEvent, "Bom Import"));
		this.listenTo(Backbone, BomEvent.EVENT_CREATE, _.partial(this.trackEvent, "Bom Create"));
		this.listenTo(Backbone, BomEvent.EVENT_DELETE, _.partial(this.trackEvent, "Bom Delete"));
		this.listenTo(Backbone, BomEvent.EVENT_UPDATE, _.partial(this.trackEvent, "Bom Update"));

		this.listenTo(Backbone, BomItemEvent.EVENT_CREATE, _.partial(this.trackEvent, "Bom Item Create"));
		this.listenTo(Backbone, BomItemEvent.EVENT_DELETE, _.partial(this.trackEvent, "Bom Item Delete"));
		this.listenTo(Backbone, BomItemEvent.EVENT_UPDATE, _.partial(this.trackEvent, "Bom Item Update"));

		this.listenTo(Backbone, CommentEvent.EVENT_CREATE, _.partial(this.trackEvent, "Comment Create"));
		this.listenTo(Backbone, CommentEvent.EVENT_DELETE, _.partial(this.trackEvent, "Comment Delete"));
		this.listenTo(Backbone, CommentEvent.EVENT_UPDATE, _.partial(this.trackEvent, "Comment Update"));

		this.listenTo(Backbone, InviteEvent.EVENT_CREATE, _.partial(this.trackEvent, "Invite Create"));
		this.listenTo(Backbone, InviteEvent.EVENT_DELETE, _.partial(this.trackEvent, "Invite Delete"));
		this.listenTo(Backbone, InviteEvent.EVENT_RESEND, _.partial(this.trackEvent, "Invite Resend"));

		this.listenTo(Backbone, ProductEvent.EVENT_CREATE, _.partial(this.trackEvent, "Product Create"));
		this.listenTo(Backbone, ProductEvent.EVENT_DELETE, _.partial(this.trackEvent, "Product Delete"));
		this.listenTo(Backbone, ProductEvent.EVENT_UPDATE, _.partial(this.trackEvent, "Product Update"));
	},

	stop: function() {
		this.stopListening();
	},

	onLogin: function(event) {
		mixpanel.identify(event.email);

		mixpanel.people.set({
		    "$email": event.email,
		    "$last_login": new Date(),
		    "$name": event.fullName,
		    "Company": event.companyName
		});

		mixpanel.register({
			companyName: event.companyName,
			companyToken: event.companyToken
	    });

	    mixpanel.track("App Start", event);
	},

	onUserUpdate: function(event) {
		event = event || {};
		if(event.event_author && event.event_author !== UserStore.current.id) {
			// For events received from Pusher that don't come from the author
			return;
		}

		delete event.eventIsLocal;
		delete event.event_author;

		mixpanel.people.set({
		    "$email": event.email,
		    "$name": event.fullName,
		    "Company": event.companyName
		});

		mixpanel.register({
			companyName: event.companyName
	    });

	    mixpanel.track("User Profile Updated", event);
	},

	trackEvent: function(action, event) {
		event = event || {};
		if(event.event_author && event.event_author !== UserStore.current.id) {
			// For events received from Pusher that don't come from the author
			return;
		}

		delete event.eventIsLocal;
		delete event.event_author;

		mixpanel.track(action, event);
	}

}, Backbone.Events);
