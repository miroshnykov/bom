"use strict";

var _ = require("underscore");
var Backbone = require("backbone");

var validation = require("backbone-validation");
_.extend(Backbone.Model.prototype, validation.mixin);

var errors = {
	400: {
		"title": "Could not Complete Request",
		"description": "A problem occurred while trying to process a request. Please try again."
	},
	401: {
		"title": "Unauthorized",
		"description": "Access to this page is restricted. Please log in and try again."
	},
	403: {
		"title": "Forbidden",
		"description": "Access to this page is restricted."
	},
	404: {
		"title": "Page not Found",
		"description": "Hey! You've stumbled upon a page that doesn't exist."
	},
	500: {
		"title": "Server Error",
		"description": "The server encountered a problem. Please try again later."
	}
};

function getError(statusCode) {

	var match = errors[statusCode];
	if(!!match) {
		return _.extend(match, {statusCode: statusCode});
	}

	// Try approximate match (4xx or 5xx)
	var code = (statusCode - (statusCode % 100));
	match = errors[code];
	if(!!match) {
		return _.extend(match, {statusCode: code});
	}

	return _.extend(errors[404], {statusCode: 404});
}

module.exports = Backbone.Model.extend({

	initialize: function(options) {
		_.extend(this, getError(options.statusCode || 404));
	},

	getTitle: function() {
		return this.statusCode + ": " + this.title;
	},

    save: function() {
        throw new Error("This model should not be saved");
    }
});
