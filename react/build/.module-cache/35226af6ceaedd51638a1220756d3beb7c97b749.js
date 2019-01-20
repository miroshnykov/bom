var ApiConstants = require("../constants/ApiConstants");

var BomExportData = {};

// Mock jQuery requests

$.mockjax({
    url: new RegExp("^" + ApiConstants.PATH_PREFIX + "\/[0-9]+\/export\/bom$"),
    type: "POST",
    //status: 500,
    responseTime: 3000,
    responseText: {
        id: 1,
        url: "https://bom.fabule.com/assets/images/bomsquad-logo.png",
        status: "ready",
        message: ""
    }
});

module.exports = BomExportData;
