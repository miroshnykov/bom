"use strict";

var _ = require("underscore");
var Backbone = require("backbone");


module.exports = Backbone.Model.extend({
	defaults: {
	    // email: null,
	    // firstName: null,
	    // lastName: null,
	    // state: DEFAULT_STATE
	},

	urlRoot: function() {
		return require("utils/BaseUrl").buildUrl("activity", this.type);
    },

	initialize: function() {

	},
});
