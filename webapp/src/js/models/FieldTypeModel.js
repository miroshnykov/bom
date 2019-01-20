"use strict";

var ExtendedModel = require("utils/ExtendedModel");

var FieldTypeModel = ExtendedModel.extend({
    urlRoot: require("utils/BaseUrl").buildUrl("fieldtype")
});

module.exports = FieldTypeModel;
