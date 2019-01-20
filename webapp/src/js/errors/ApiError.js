"use strict";

var _ = require("underscore");

function ApiError(attributes) {
    attributes = attributes || {};

    this.name = "ApiError";
    this.xhr = attributes.xhr;
    this.textStatus = attributes.textStatus;
    this.errorThrown = attributes.errorThrown;

    if (attributes.xhr && _.isObject(attributes.xhr.responseJSON)) {
        this.message = attributes.xhr.responseJSON.detail;
        this.validationMessages = attributes.xhr.responseJSON.validation_messages;
    }
    else {
        this.message = attributes.title;
    }
}

ApiError.prototype = Object.create(Error.prototype);
ApiError.prototype.constructor = ApiError;

ApiError.prototype.getValidationErrors = function() {
    var errors = {};
    _.each(this.validationMessages, function(messages, key) {

        if (_.isArray(messages)) {
            errors[key] = messages[0];
        }
        else if (_.isObject(messages)) {
            errors[key] = messages[_.keys(messages)[0]];
        }
        else {
            errors[key] = messages;
        }

    });
    return errors;
};

module.exports = ApiError;
