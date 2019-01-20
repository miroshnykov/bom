"use strict";

var _ = require("underscore");

var BaseModel = require("models/BaseModel");
var statefulMixin = require("utils/StatefulMixin");
var S3Upload = require("utils/S3Upload");

var classProperties = {
    PENDING_UPLOAD: "pending upload",
    UPLOADED: "uploaded",
    FAILED: "failed"
};

module.exports = BaseModel.extend({
    mixins: [statefulMixin],
    urlRoot: require("utils/BaseUrl").buildUrl("file"),
    defaults: {
        status: classProperties.PENDING_UPLOAD,
        name: ""
    },

    save: function(attrs, options) {
        options = options || {};
        attrs = attrs || _.clone(this.attributes);

        var file = attrs.file;
        if (file) {
            attrs = _.defaults(attrs, {
                name: file.name,
                contentType: file.type,
                size: file.size
            });
            delete attrs.file;
        }

        if (this.collection) {
            attrs = _.defaults(attrs, {
                type: this.collection.type,
                entityId: this.collection.entityId
            });
        }

        delete attrs.progress;

        // Proxy the call to the original save function
        return BaseModel.prototype.save.call(this, attrs, options).then(function(model) {
            if (!file) { return; }

            var s3 = new S3Upload({
                onComplete: function() {
                    model.set("status", classProperties.UPLOADED);
                },
                onProgress: function(percent) {
                    model.set("progress", percent);
                },
                onError: function() {
                    model.set("status", classProperties.FAILED);
                }
            });
            s3.upload(file, model.get("url"));
        }, function() {
            this.set("status", classProperties.FAILED);
        }.bind(this));
    }

}, classProperties);
