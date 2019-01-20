"use strict";

var _ = require("underscore");
var ExtendedModel = require("utils/ExtendedModel");

var CompanyModel = ExtendedModel.extend({
    urlRoot: require("utils/BaseUrl").buildUrl("company"),
    validationErrors: undefined,
    serverError: undefined,

    constructor: function() {
        this.validationErrors = {};
        ExtendedModel.apply(this, arguments);
    },

    fetchByToken: function(token) {
        var options = {
            url: _.result(this, "urlRoot") + "/" + token
        };

        return this.fetch(options);
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

module.exports = CompanyModel;
