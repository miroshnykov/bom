"use strict";

var _            = require("underscore");
var Backbone     = require("backbone");
var BomEvent     = require("events/BomEvent");
var CommentEvent = require("events/CommentEvent");
var config       = require("config");
var ProductEvent = require("events/ProductEvent");
var ProductStore = require("stores/ProductStore");
var UserEvent    = require("events/UserEvent");
var UserStore    = require("stores/UserStore");

var validate = function(cb, event) {
	if(event.event_author === UserStore.current.id || Notification.permission !== "granted") {
		return;
	}

	cb(event);
};

var showNotification = function(title, body) {
	var notification = new Notification(title, {
		icon: "/assets/images/icon-blue-96px.png",
		body: body
	});

	setTimeout(notification.close.bind(notification), 5000);
};


module.exports = _.extend({
	enabled: false,

	start: function() {
		this.listenTo(Backbone, UserEvent.EVENT_CONFIG_UPDATE, this.onConfigUpdate);
		this.onConfigUpdate();
	},

	stop: function() {
		this.stopListening();
	},

	onConfigUpdate: function() {
		// Check for browser support and user prefs
		if (!config.capabilities.notifications) {
		    return;
		}

		if(this.enabled && !config.showNotifications) {
			this.stopListening(Backbone, BomEvent.EVENT_CREATE);
			this.stopListening(Backbone, BomEvent.EVENT_DELETE);

			this.stopListening(Backbone, ProductEvent.EVENT_CREATE);
			this.stopListening(Backbone, ProductEvent.EVENT_DELETE);

			this.stopListening(Backbone, CommentEvent.EVENT_CREATE);
			this.stopListening(Backbone, CommentEvent.EVENT_UPDATE);

			this.enabled = false;
		} else if(!this.enabled && config.showNotifications) {
			this.listenTo(Backbone, BomEvent.EVENT_CREATE,     _.wrap(this.onBomCreate, validate));
			this.listenTo(Backbone, BomEvent.EVENT_DELETE,     _.wrap(this.onBomDelete, validate));

			this.listenTo(Backbone, ProductEvent.EVENT_CREATE, _.wrap(this.onProductCreate, validate));
			this.listenTo(Backbone, ProductEvent.EVENT_DELETE, _.wrap(this.onProductDelete, validate));

			this.listenTo(Backbone, CommentEvent.EVENT_CREATE, _.wrap(this.onCommentCreate, validate));
			this.listenTo(Backbone, CommentEvent.EVENT_UPDATE, _.wrap(this.onCommentUpdate, validate));

			this.enabled = true;
		}
	},

	onBomCreate: function(event) {
		_.each(event.products, function(productId) {
			var product = ProductStore.collection.get(productId);
			if(!product) {
				return;
			}

			var productName = product.get("name");
			showNotification("New BoM Added to " + productName,
				event.name + " has been added to the product " + productName);
		});
	},

	onBomDelete: function(event) {
		_.each(event.products, function(productId) {
			var product = ProductStore.collection.get(productId);
			if(!product) {
				return;
			}

			var productName = product.get("name");
			showNotification(event.name + " has been deleted",
				event.name + " has been deleted from the product " + productName);
		});
	},

	onProductCreate: function(event) {
		showNotification(event.name + " has been added");
	},

	onProductDelete: function(event) {
		showNotification(event.name + " has been deleted",
			event.name + " and all of its BoMs have been deleted");
	},

	onCommentCreate: function(event) {
		var author = UserStore.get(event.userId);
		var authorName = author ? (author.getDisplayName() + ": ") : "";
		showNotification("New Comment in " + event.targetName, authorName + event.body.trunc(60, true));
	},

	onCommentUpdate: function(event) {
		var author = UserStore.get(event.userId);
		var authorName = author ? (author.getDisplayName() + ": ") : "";
		showNotification("Updated Comment in " + event.targetName, authorName + event.body.trunc(60, true));
	}

}, Backbone.Events);
