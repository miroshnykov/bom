"use strict";

var ExtendedModel = require("utils/ExtendedModel");

var BomViewModel = ExtendedModel.extend({
    urlRoot: function() {
        return require("utils/BaseUrl").buildUrl("view");
    }
});

module.exports = BomViewModel;
