var ApiConstants = require("../constants/ApiConstants");
var ExtendedModel = require("../utils/ExtendedModel");

var BomExportModel = ExtendedModel.extend({
    urlRoot: function() {
        return ApiConstants.PATH_PREFIX + "/" + this.get("companyId") + "/export/bom";
    },
});

module.exports = BomExportModel;
