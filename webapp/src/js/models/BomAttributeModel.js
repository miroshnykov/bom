"use strict";

var _ = require("underscore");

var BaseModel = require("models/BaseModel");

var statefulMixin = require("utils/StatefulMixin");

var BomAttributeModel = BaseModel.extend({
    mixins: [
        statefulMixin
    ],

    bom: undefined,

    urlRoot: function() {
        return require("utils/BaseUrl").buildUrl("bom", this.bom.id, "attribute");
    },

    initialize: function() {
        BaseModel.prototype.initialize.apply(this);
        this.listenTo(this, "change:fieldId", function() { this.onChangeState(this.STATE_IDLE); });
        this.listenTo(this, "change:name", function() { this.onChangeState(this.STATE_IDLE); });
    },

    save: function(attrs, options) {
        options = _.defaults(options || {}, { patch: true });
        return BaseModel.prototype.save.call(this, attrs, options);
    },

    setBom: function(bom) { this.bom = bom; },
    getBom: function() { return this.bom; },

    // Position

    decrease: function(change) {
        change = change || 1;
        this.set("position", this.get("position") - change);
    },

    increase: function(change) {
        change = change || 1;
        this.set("position", this.get("position") + change);
    }
});

module.exports = BomAttributeModel;
