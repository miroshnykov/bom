"use strict";

var validation = require("backbone-validation");

var BaseModel = require("models/BaseModel");
var UserStore = require("stores/UserStore");
var statefulMixin = require("utils/StatefulMixin");

var CommentModel = BaseModel.extend({
    mixins: [
        validation.mixin,
        statefulMixin
    ],

    parent: undefined,

    validation: {
        body: [{
            required: true,
            msg: "Comment cannot be empty"
        },{
            maxLength: 80000,
            msg: "Comment must be less than 80,000 characters"
        }]
    },

    urlRoot: function() {
        return this.parent.url() + "/comment";
    },

    initialize: function() {
        BaseModel.prototype.initialize.apply(this, arguments);
        this.listenTo(this, "change:body", function() { this.onChangeState(this.STATE_IDLE); });
    },

    setParent: function(parent) {
        this.parent = parent;
    },

    getParent: function() {
        return this.parent;
    },

    authorName: function() {
        if(UserStore.current.id === this.get("userId")){
            return "me";
        }

        var user = UserStore.get(this.get("userId"));
        return user ? user.getDisplayName() : "N/A";
    }
});

module.exports = CommentModel;
