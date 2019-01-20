"use strict";

var _ = require("underscore");

/**
 * Edited version of: https://github.com/tadruj/s3upload-coffee-javascript
 */

S3Upload.prototype.onComplete = function() {
    return console.log("base.onComplete()", "completed");
};

S3Upload.prototype.onProgress = function(percent, status) {
    return console.log("base.onProgress()", percent, status);
};

S3Upload.prototype.onError = function(status) {
    return console.log("base.onError()", status);
};

function S3Upload(options) {
    options = options || {};
    _.each(options, function(value, key) {
        this[key] = value;
    }, this);
}

S3Upload.prototype.createCORSRequest = function(method, url) {
    var xhr;
    xhr = new XMLHttpRequest();
    if (xhr.withCredentials !== null) {
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest !== "undefined") {
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        xhr = null;
    }
    return xhr;
};

S3Upload.prototype.upload = function(file, url) {
    var this_s3upload, xhr;
    this_s3upload = this;
    xhr = this.createCORSRequest("PUT", url);

    if (!xhr) {
        this.onError("CORS not supported");
    } else {
        xhr.onload = function() {
            if (xhr.status === 200) {
                this_s3upload.onProgress(100, "Upload completed.");
                return this_s3upload.onComplete();
            } else {
                return this_s3upload.onError("Upload error: " + xhr.status);
            }
        };

        xhr.onerror = function() {
            return this_s3upload.onError("XHR error.");
        };

        xhr.upload.onprogress = function(e) {
            var percentLoaded;
            if (e.lengthComputable) {
                percentLoaded = Math.round((e.loaded / e.total) * 100);
                return this_s3upload.onProgress(percentLoaded, percentLoaded === 100 ? "Finalizing." : "Uploading.");
            }
        };
    }

    xhr.setRequestHeader("Content-Type", file.type);

    return xhr.send(file);
};

module.exports = S3Upload;
