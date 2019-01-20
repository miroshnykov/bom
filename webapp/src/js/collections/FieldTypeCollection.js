"use strict";

var _ = require("underscore");

var FieldTypeModel = require("models/FieldTypeModel");
var ExtendedCollection = require("utils/ExtendedCollection");

module.exports = ExtendedCollection.extend({
    model: FieldTypeModel,
    url: require("utils/BaseUrl").buildUrl("fieldtype"),

    onLoadData: function(event) {
        if (!event.company) { return; }

        this.reset();

        if (event.company.data && _.isArray(event.company.data.types)) {
            this.set(event.company.data.types, {parse: true});
        }
    }
});
