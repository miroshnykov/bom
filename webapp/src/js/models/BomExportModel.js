"use strict";

var ExtendedModel = require("utils/ExtendedModel");

var BomExportModel = ExtendedModel.extend({
    urlRoot: function() {
        return require("utils/BaseUrl").buildUrl("export/bom");
    }
});

module.exports = BomExportModel;
