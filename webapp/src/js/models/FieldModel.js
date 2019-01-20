"use strict";

var TypeConstants = require("constants/TypeConstants");
var FieldConstants = require("constants/FieldConstants");
var ExtendedModel = require("utils/ExtendedModel");

var FieldModel = ExtendedModel.extend({
    urlRoot: function() {
        return require("utils/BaseUrl").buildUrl("field");
    },

    match: function(name) {
        var regex = this.get("regex");
        if (!regex) { return false; }

        regex = new RegExp(regex, "i");
        return regex.test(name);
    },

    isBoolean: function() {
        return this.get("typeId") === TypeConstants.BOOLEAN;
    },

    getDefault: function() {
        switch(this.id) {
            case FieldConstants.DNI:
                return true;
        }
    }
});

module.exports = FieldModel;
