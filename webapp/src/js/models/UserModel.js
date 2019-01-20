"use strict";

var _          = require("underscore");
var Backbone   = require("backbone");
var md5        = require("md5");
var validation = require("backbone-validation");

var ApiConstants  = require("constants/ApiConstants");
var BaseModel     = require("models/BaseModel");
var statefulMixin = require("utils/StatefulMixin");
var UserEvent     = require("events/UserEvent");

var UserModel = BaseModel.extend({
    mixins: [
        validation.mixin,
        statefulMixin
    ],

    urlRoot: ApiConstants.PATH_PREFIX + "/user",

    validation: {
        firstName: {
            required: false,
            maxLength: 255,
            msg: "Please make first name less than 255 characters"
        },
        lastName: {
            required: false,
            maxLength: 255,
            msg: "Please make last name less than 255 characters"
        },
        companyName: {
            required: false,
            maxLength: 255,
            msg: "Please make company name less than 255 characters"
        },
        displayName: {
            required: false,
            maxLength: 50,
            msg: "Please make display name less than 50 characters"
        },
        email: {
            pattern: "email",
            required: true,
            msg: "Please enter a valid email"
        },
        password: {
            required: false,
            minLength: 8,
            msg: "Please enter a password with at least 8 characters"
        }
    },

    defaults: {
        email: null,
        firstName: null,
        lastName: null,
        displayName: null
    },

    initialize: function() {
        BaseModel.prototype.initialize.apply(this);

        this.listenTo(this, "change:email", function() { this.onChangeState(this.STATE_IDLE); });
        this.listenTo(this, "change:firstName", function() { this.onChangeState(this.STATE_IDLE); });
        this.listenTo(this, "change:lastName", function() { this.onChangeState(this.STATE_IDLE); });
        this.listenTo(this, "change:password", function() { this.onChangeState(this.STATE_IDLE); });

        this.on("change", this.triggerUserChangeEvent);
    },

    save: function(attrs, options) {
        options = options || {};

        // Remove attributes equal to current attributes
        _.each(attrs, function(value, key) {
            if ((this.has(key) && this.get(key) === value) ||
                (!this.has(key) && (value === undefined || value === null))) {
                delete attrs[key];
            }
        }, this);

        attrs = attrs || _.clone(this.attributes);

        // Filter the data to send to the server
        delete attrs.state;
        delete attrs.error;

        options.attrs = options.attrs || _.clone(attrs);

        if (!this.isNew()) {
            options.url = this.urlRoot + "/me";
        }

        delete attrs.password;
        delete attrs.currentPassword;
        delete attrs.companyToken;
        delete attrs.inviteToken;
        delete attrs.signin;
        delete attrs.companyName;

        // Proxy the call to the original save function
        return BaseModel.prototype.save.call(this, attrs, options);
    },

    init: function() {
        var options = {
            data: { init: true },
            url: ApiConstants.PATH_PREFIX + "/me"
        };

        return this
            .fetch(options)
            .then(function(user) {
                var company = user.getCurrentCompany();
                if (!company) {
                    return Promise.reject(new Error("User is not linked to a company"));
                }

                var userEvent = new UserEvent({
                    company: company
                });

                Backbone.trigger(UserEvent.EVENT_LOAD_DATA, userEvent);

                delete company.data;

                return user;
            });
    },

    getFullName: function() {
        return ((this.get("firstName") || "") + " " + (this.get("lastName") || "")).trim();
    },

    getDisplayName: function() {
        if (this.get("displayName")) {
            return this.get("displayName");
        }
        else if (this.getFullName()) {
            return this.getFullName();
        }
        else if (this.get("email")) {
            return this.get("email").substring(0, this.get("email").indexOf("@"));
        }
        else if (this.isNew()) {
            return "Guest";
        }

        return "N/A";
    },

    getCurrentCompany: function() {
        var companies = this.get("companies");
        if(!companies || !companies.length) {
            return;
        }

        return companies[0];
    },

    getAvatarUrl: function(size) {
        size = size || 34;
        var hash = md5(this.get("email").trim().toLowerCase());
        return "https://www.gravatar.com/avatar/" + hash + "?s=" + size + "&d=retro";
    },

    login: function() {
        var company = this.getCurrentCompany();
        var userEvent = new UserEvent({
            fullName: this.getFullName(),
            email: this.get("email"),
            companyName: company ? company.name : null,
            companyToken: company ? company.id : null
        });

        Backbone.trigger(UserEvent.EVENT_LOG_IN, userEvent);
    },

    logout: function() {
        Backbone.trigger(UserEvent.EVENT_LOG_OUT, new UserEvent());
        window.location.href = "/user/signout";
    },

    triggerUserChangeEvent: function() {
        var company = this.getCurrentCompany();

        Backbone.trigger(UserEvent.EVENT_CHANGE, new UserEvent({
            fullName: this.getFullName(),
            email: this.get("email"),
            company: company ? company.name : null,
            companyToken: company ? company.id : null
        }));
    }
});

module.exports = UserModel;
