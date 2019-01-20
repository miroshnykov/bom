var ApiConstants = require("../constants/ApiConstants");
var ExtendedModel = require("../utils/ExtendedModel");

var BomItemValueModel = ExtendedModel.extend({
    companyId: undefined,
    bomId: undefined,
    itemId: undefined,

    urlRoot: function() {
        return ApiConstants.PATH_PREFIX + "/" + this.getCompany() + "/bom/" + this.getBom() + "/item/" + this.getItem() + "/value";
    },

    setCompany: function(companyId) { this.companyId = companyId; },
    getCompany: function() { return this.companyId; },

    setBom: function(bomId) { this.bomId = bomId; },
    getBom: function() { return this.bomId; },

    setItem: function(itemId) { this.itemId = itemId; },
    getItem: function() { return this.itemId; },

    getAttributeId: function() { return this.get("bomFieldId"); },

    parse: function(resp, options) {
        if (!resp) { return resp; }

        if (resp.bomField) {
            if (!resp.bomFieldId) {
                resp.bomFieldId = resp.bomField.id;
            }

            // TODO clone resp, threat argument as immutable
            delete resp.bomField;
        }

        return resp;
    }
});

module.exports = BomItemValueModel;
