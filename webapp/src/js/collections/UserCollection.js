"use strict";

var Backbone = require("backbone");
var UserModel = require("models/UserModel");
var ApiConstants = require("constants/ApiConstants");

module.exports = Backbone.Collection.extend({
    model: UserModel,

    current: new UserModel(),

    url: function() {
        return ApiConstants.PATH_PREFIX + "/user";
    },

    init: function() {
        // @TODO: Replace this implementation once /me api has been removed
        this.fetch();
        return this.current.init();
    }
});
