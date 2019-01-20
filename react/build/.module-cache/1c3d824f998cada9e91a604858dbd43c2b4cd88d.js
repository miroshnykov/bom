var ApiConstants = require("../constants/ApiConstants");
var ExtendedModel = require("../utils/ExtendedModel");

var FieldTypeModel = ExtendedModel.extend({
    urlRoot: ApiConstants.PATH_PREFIX + "/fieldtype",

    parse: function(resp, options) {
        resp = _.omit(resp, function(value, key, object) {
            return _.isString(key) && key.slice(0, 1) === "_";
        });
        return resp;
    }
});

module.exports = FieldTypeModel;
