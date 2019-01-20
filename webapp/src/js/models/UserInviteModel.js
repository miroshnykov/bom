"use strict";

var _ = require("underscore");
var Backbone = require("backbone");
var BaseModel = require("models/BaseModel");
var InviteEvent = require("events/InviteEvent");
var validation = require("backbone-validation");

var DEFAULT_STATE = "idle";

module.exports = BaseModel.extend({
	mixins: [
		validation.mixin
	],

	STATE_IDLE: "idle",
	STATE_SENDING: "sending",
	STATE_ERROR: "error",
	STATE_SUCCESS: "success",

	INVITE_STATUS_PENDING: "pending",
	INVITE_STATUS_ACCEPTED: "accepted",

	validation: {
	    firstName: {
	      	required: true,
	      	minLength: 1,
	      	msg: "Please enter a valid first name"
	    },
	    lastName: {
	      	required: true,
	      	minLength: 1,
	      	msg: "Please enter a valid last name"
	    },
	    email: {
	    	pattern: "email",
	    	required: true,
	      	minLength: 1,
	      	msg: "Please enter a valid email"
	    }
	},

	defaults: {
	    email: null,
	    firstName: null,
	    lastName: null,
	    state: DEFAULT_STATE
	},

	urlRoot: function() {
		return require("utils/BaseUrl").buildUrl("invite");
    },

	initialize: function() {
		this.on("request",this.onStartSending,this);
		this.on("sync",this.onSyncSuccess,this);
		this.on("error",this.onSyncError,this);
		this.on("change:email",this.onChange,this);
		this.on("change:firstName",this.onChange,this);
		this.on("change:lastName",this.onChange,this);
	},

	onChange: function() {
		this.set("state", this.STATE_IDLE);
	},

	onStartSending: function() {
		this.set("state", this.STATE_SENDING);
	},

	onSyncSuccess: function() {
		this.set("state", this.STATE_SUCCESS);
	},

	onSyncError: function() {
		this.set("state", this.STATE_ERROR);
	},

    save: function(attrs, options) {
        options = options || {};

        attrs = attrs || _.clone(this.attributes);

        // Filter the data to send to the server
        delete attrs.state;
        delete attrs.error;

        if(attrs.send) {
        	Backbone.trigger(InviteEvent.EVENT_RESEND, new InviteEvent(attrs));
        } else {
        	Backbone.trigger(InviteEvent.EVENT_CREATE, new InviteEvent(attrs));
        }

        // Proxy the call to the original save function
        return Backbone.Model.prototype.save.call(this, attrs, options);
    },

    fetchByToken: function(token) {
        var options = {
            url: _.result(this, "urlRoot") + "/" + token
        };

        return this.fetch(options);
    }
});
