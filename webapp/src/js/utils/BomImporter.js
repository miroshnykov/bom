"use strict";

var _ = require("underscore");
var BomUtils = require("utils/BomUtils");
var BabyParse = require("babyparse");

var BomImporter = {
    detectCSV: function(content) {
        var options = {};
        var preview;
        var headers;

        // Parse preview to get value of first row
        preview = BabyParse.parse(content, _.extend({}, options, {preview: 1, header: true}));

        // Clean up fields
        // Because of bug in parsing library that adds an empty field if last character is delimiter
        headers = _.clone(preview.meta.fields);
        if (_.last(headers) === "") {
            headers.pop();
        }

        // Check that headers are all string and not empty
        options.header = (headers.length > 0) && _.every(headers, function(result) {
            return isNaN(result);
        });

        // Get the autodetected delimiter
        options.delimiter = preview.meta.delimiter;

        return options;
    },

    detectCSVFromFile: function(file) {
        return BomUtils.readFileAsText(file).then(function(result) {
            return this.detectCSV(result);
        }.bind(this));
    },

    importCSV: function(content, options) {
        options = options || {};

        // Skip empty line by default
        if (options.skipEmptyLines === undefined) {
            options.skipEmptyLines = true;
        }

        return BabyParse.parse(content, options);
    }
};

module.exports = BomImporter;
