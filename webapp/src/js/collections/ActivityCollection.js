"use strict";

var _ = require("underscore");
var ActivityModel = require("models/ActivityModel");
var Backbone = require("backbone");

module.exports = Backbone.Collection.extend(
{
    model: ActivityModel,
    type: null,
    entityId: 0,

    url: function() {
        return require("utils/BaseUrl").buildUrl("activity", this.type, this.entityId);
    },

    initialize: function(attrs, options) {
        options = options || {};
        this.type = options.type;
        this.entityId = options.entityId || 0;
    }

});
