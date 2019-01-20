"use strict";

var BomUtils = {
    isFileAPIEnabled: function() {
        return !!window.FileReader;
    },

    readFileAsText: function(file, encoding) {
        encoding = encoding || "utf-8";

        if (!BomUtils.isFileAPIEnabled()) {
            //TODO api call to submit file and wait for response
            return Promise.reject(new Error("File API not found"));
        }

        return new Promise(function(resolve, reject) {
            var reader = new FileReader();

            reader.onload = function(event) {
                resolve(event.target.result);
            };

            reader.onerror = function(event) {
                reject(event.target.error);
            };

            reader.readAsText(file, encoding);
        });
    }
};

module.exports = BomUtils;
