"use strict";

var ExtendedModel = require("../utils/ExtendedModel");

var CommentModel = ExtendedModel.extend({
    companyId: undefined,
    parent: undefined,

    urlRoot: function() {
        return this.parent.url() + "/comment";
    },

    setCompany: function(companyId) {
        this.companyId = companyId;
    },

    getCompany: function() {
        return this.companyId;
    },

    setParent: function(parent) {
        this.parent = parent;
    },

    getParent: function() {
        return this.parent;
    }

});

module.exports = CommentModel;
