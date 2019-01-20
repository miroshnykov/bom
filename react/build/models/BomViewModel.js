var ApiConstants = require("../constants/ApiConstants");
var ExtendedModel = require("../utils/ExtendedModel");

var BomViewModel = ExtendedModel.extend({
    companyId: undefined,

    urlRoot: function() {
        return ApiConstants.PATH_PREFIX + "/" + this.getCompany() + "/view";
    },

    parse: function(resp, options) {
        // Parse the company if not a default field
        if (resp.company) {
            if (!resp.companyId) {
                resp.companyId = resp.company.id;
            }

            delete resp.company;
        }

        // Remove attributes that start with underscore
        resp = _.omit(resp, function(value, key, object) {
            return _.isString(key) && key.slice(0, 1) === "_";
        });
        return resp;
    },

    setCompany: function(companyId) {
        this.companyId = companyId;
    },

    getCompany: function() {
        return this.companyId;
    }
});

module.exports = BomViewModel;
