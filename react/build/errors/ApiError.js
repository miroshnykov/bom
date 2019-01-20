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

module.exports = ApiError;
