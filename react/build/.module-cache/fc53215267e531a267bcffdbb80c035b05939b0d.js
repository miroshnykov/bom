var ApiConstants = require("../constants/ApiConstants");
var ExtendedModel = require("../utils/ExtendedModel");

var FieldModel = ExtendedModel.extend({
    urlRoot: function() {
        return ApiConstants.PATH_PREFIX + "/" + this.get("companyId") + "/field";
    },

    parse: function(resp, options) {
        // Parse the company if not a default field
        if (resp.company) {
            if (!resp.companyId) {
                resp.companyId = resp.company.id;
            }

            delete resp.company;
        }

        // Parse the type
        if (resp.type) {
            if (!resp.typeId) {
                resp.typeId = resp.type.id;
            }

            delete resp.type;
        }

        // Remove attributes that start with underscore
        resp = _.omit(resp, function(value, key, object) {
            return _.isString(key) && key.slice(0, 1) === "_";
        });
        return resp;
    },

    match: function(name) {
        var regex = this.get("regex");
        if (!regex) { return false; }

        regex = new RegExp(regex, 'i');
        return regex.test(name);
    }
});

module.exports = FieldModel;
