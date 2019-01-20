var ApiConstants = require("../constants/ApiConstants");
var ExtendedModel = require("../utils/ExtendedModel");

var BomExportModel = ExtendedModel.extend({
    companyId: undefined,

    urlRoot: function() {
        return ApiConstants.PATH_PREFIX + "/" + this.getCompany() + "/export/bom";
    },

    setCompany: function(companyId) {
        this.companyId = companyId;
    },

    getCompany: function() {
        return this.companyId;
    },
});

module.exports = BomExportModel;
