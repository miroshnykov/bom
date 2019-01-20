"use strict";

var _ = require("underscore");
var AppDispatcher = require("../dispatcher/AppDispatcher");
var ActionConstants = require("../constants/ActionConstants");
var ApiConstants = require("../constants/ApiConstants");
var ExtendedModel = require("../utils/ExtendedModel");
var CompanyStore = require("../stores/CompanyStore");

var UserModel = ExtendedModel.extend({
    urlRoot: ApiConstants.PATH_PREFIX + "/account",
    validationErrors: undefined,
    serverError: undefined,

    url: function() {
      var base =
        _.result(this, "urlRoot") ||
        _.result(this.collection, "url") ||
        "";
      return base;
    },

    constructor: function() {
        this.validationErrors = {};
        ExtendedModel.apply(this, arguments);
    },

    initialize: function () {
        ExtendedModel.prototype.initialize.apply(this);
        this.dispatchToken = AppDispatcher.register(this.dispatchCallback.bind(this));
    },

    parse: function(resp) {
        // Remove attributes that start with underscore
        resp = _.omit(resp, function(value, key) {
            return _.isString(key) && key.slice(0, 1) === "_";
        });

        return resp;
    },

    dispatchCallback: function (payload) {
        var action = payload.action;

        switch(action.type) {
            case ActionConstants.CREATE_USER:
                (function() {
                    var attrs = action.attributes || {};

                    this.clearErrors();
                    this.save(attrs).then(function(model) {
                        if (action.resolve) {
                            action.resolve(model);
                        }
                    }, function(error) {

                        this.setValidationErrors(error.validationMessages);
                        this.setServerError(error.message);
                        if (action.reject) {
                            action.reject(error);
                        }
                        return;

                    }.bind(this));
                }).apply(this);
            break;

            case ActionConstants.INIT_USER:
                (function() {
                    var options = {
                        data: { init: true },
                        url: ApiConstants.PATH_PREFIX + "/me"
                    };

                    this.fetch(options).then(function(model) {
                        CompanyStore.reset();
                        _.each(model.get("companies"), function(company) {
                            CompanyStore.add(company);
                        });

                        model.unset("companies");

                        if (action.resolve) {
                            action.resolve(model);
                        }
                    }, function(error) {
                        if (action.reject) {
                            action.reject(error);
                        }
                    });
                }).apply(this);
            break;

            case ActionConstants.UPDATE_USER:
                (function() {
                    var profile;

                    //if (!this.validateAction(action, ["profile"])) { return; }
                    if (!action.attributes || !action.attributes.profile) { return; }

                    // Clear the validation errors
                    this.clearErrors();

                    // Get the profile attributes
                    profile = _.clone(action.attributes.profile);

                    // Validate
                    if (_.has(profile, "email")) {
                        if (_.isEmpty(profile.email)) {
                            this.setValidationErrors("email", "Your email cannot be empty");
                        }

                        if (_.isEmpty(profile.oldPassword)) {
                            this.setValidationErrors("oldPassword", "Please enter your current password for verification");
                        }
                    }

                    if (_.has(profile, "newPassword")) {
                        if (profile.newPassword.length < 8) {
                            this.setValidationErrors("newPassword", "Your new password must be at least 8 characters long");
                        }
                        else if (profile.newPassword !== profile.confirmPassword) {
                            this.setValidationErrors("confirmPassword", "This password does not match your new password");
                        }

                        if (_.isEmpty(profile.oldPassword)) {
                            this.setValidationErrors("oldPassword", "Please enter your current password for verification");
                        }
                    }

                    // If validation failed, we're done
                    if (this.hasValidationErrors()) {
                        if (action.reject) { action.reject(); }
                        return;
                    }

                    // Get attributes to save for profile
                    profile = _.omit(profile, ["company", "newPassword", "oldPassword", "confirmPassword"]);

                    // If we found any changes attributes, update the user
                    if (!_.isEmpty(profile)) {
                        this.set(profile);
                        action.result = _.extend({}, action.result, { user: this });
                    }

                    AppDispatcher.waitFor([CompanyStore.dispatchToken]);

                    this.save(undefined, {
                        patch: true,
                        attrs: _.omit(action.attributes.profile, ["confirmPassword"]),
                        url: ApiConstants.PATH_PREFIX + "/me"
                    }).then(function(user) {
                        if (action.resolve) {
                            action.resolve(user);
                        }
                    }, function(error) {
                        var user = action.result ? action.result.user : undefined;
                        var company = action.result ? action.result.company : undefined;

                        // Revert User
                        if (user) {
                            user.setValidationErrors( _.omit(error.validationMessages, "company") );
                            user.set( action.result.user.previousAttributes() );
                        }

                        this.setServerError(error.message);

                        // Revert company
                        if (company) {
                            company.setValidationErrors( _.pick(error.validationMessages, "company") );
                            company.setServerError(error.message);
                            company.set( action.result.company.previousAttributes() );
                        }

                        if (action.reject) {
                            action.reject(error);
                        }
                    }.bind(this));

                }).apply(this);
                break;

            case ActionConstants.VALIDATE_USER:
                (function() {
                    this.clearErrors();
                }).apply(this);
                break;

            default:
                // do nothing
        }
    },

    hasValidationErrors: function(keys) {
        if (!keys) {
            return !_.isEmpty(this.validationErrors);
        }

        keys = _.isArray(keys) ? keys : [keys];
        return !_.isEmpty( _.intersection(keys, _.keys(this.validationErrors)));
    },

    getValidationErrors: function(key) {
        return key ? this.validationErrors[key] : this.validationErrors;
    },

    getValidationError: function(key) {
        var errors = this.getValidationErrors(key);
        if (!_.isArray(errors)) {
            return;
        }
        return errors[0];
    },

    setValidationErrors: function(key, errors) {
        if (!key) { return; }

        // If errors is undefined, we are setting ALL errors
        if (!errors) {
            this.validationErrors = key;
        }
        else {
            errors = _.isArray(errors) ? errors : [errors];
            this.validationErrors[key] = errors;
        }

        this.trigger("validate");
    },

    clearValidationErrors: function() {
        this.validationErrors = {};
        this.trigger("validate");
    },

    hasServerError: function() {
        return !!this.serverError;
    },

    setServerError: function(error) {
        this.serverError = error;
        this.trigger("validate");
    },

    clearServerError: function() {
        this.serverError = undefined;
        this.trigger("validate");
    },

    getServerError: function() {
        return this.serverError;
    },

    clearErrors: function() {
        this.validationErrors = {};
        this.serverError = undefined;
        this.trigger("validate");
    }
});

module.exports = UserModel;
