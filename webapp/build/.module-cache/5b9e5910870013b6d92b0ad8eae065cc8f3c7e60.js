"use strict";

var ApiConstants = require("../constants/ApiConstants");
var ExtendedModel = require("../utils/ExtendedModel");

var BomAttributeModel = ExtendedModel.extend({
    companyId: undefined,
    bomId: undefined,

    urlRoot: function() {
        return ApiConstants.PATH_PREFIX + "/" + this.getCompany() + "/bom/" + this.getBom() + "/attribute";
    },

    setCompany: function(companyId) { this.companyId = companyId; },
    getCompany: function() { return this.companyId; },

    setBom: function(bomId) { this.bomId = bomId; },
    getBom: function() { return this.bomId; },

    parse: function(resp) {
        if (!resp) { return resp; }

        if (resp.field) {

            // Fold fieldId if passed as Field object
            if (!resp.fieldId) {
                resp.fieldId = resp.field.id;
            }

            // TODO clone resp, threat argument as immutable
            delete resp.field;
        }

        return resp;
    },

    // Position

    decrease: function(change) {
        change = change || 1;
        this.set("position", this.get("position") - change);
    },

    increase: function(change) {
        change = change || 1;
        this.set("position", this.get("position") + change);
    }
});

module.exports = BomAttributeModel;
