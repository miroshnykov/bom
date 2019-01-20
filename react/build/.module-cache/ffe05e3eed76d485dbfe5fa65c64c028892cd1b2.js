var ApiConstants = require("../constants/ApiConstants");
var ExtendedModel = require("../utils/ExtendedModel");

var ProductModel = ExtendedModel.extend({
    urlRoot: function() {
        return ApiConstants.PATH_PREFIX + "/" + this.get("companyId") + "/product";
    },

    parse: function(resp, options) {
        resp = _.omit(resp, function(value, key, object) {
            return _.isString(key) && key.slice(0,1) === "_";
        });
        return resp;
    }
});

module.exports = ProductModel;
