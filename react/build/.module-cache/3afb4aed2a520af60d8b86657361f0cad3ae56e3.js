var ApiConstants = require("../constants/ApiConstants");
var ExtendedModel = require("../utils/ExtendedModel");

var BomItemModel = ExtendedModel.extend({
    companyId: undefined,
    bomId: undefined,

    defaults: function() {
        return {
            values: []
        };
    },

    urlRoot: function() {
        return ApiConstants.PATH_PREFIX + "/" + this.getCompany() + "/bom/" + this.getBom() + "/item";
    },

    setCompany: function(companyId) {
        this.companyId = companyId;
    },

    getCompany: function() {
        return this.companyId;
    },

    setBom: function(bomId) {
        this.bomId = bomId;
    },

    getBom: function() {
        return this.bomId;
    },

    getValues: function() {
        //return this.values;
        return this.get("values");
    },

    addValue: function(value) {
        //this.getValues().add(value);
        this.getValues().push(value);
    },

    getValueForAttribute: function(attributeId) {
        return _.find(this.get("values"), function(result) {
            return result.bomFieldId === attributeId;
        });
    }
});

module.exports = BomItemModel;
