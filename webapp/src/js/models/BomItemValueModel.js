"use strict";

var _ = require("underscore");

var BaseModel = require("models/BaseModel");
var statefulMixin = require("utils/StatefulMixin");

var BomItemValueModel = BaseModel.extend({
    mixins: [
        statefulMixin
    ],

    bom: undefined,
    item: undefined,

    defaults: {
        alerts: {}
    },

    urlRoot: function() {
        return require("utils/BaseUrl").buildUrl("bom", this.bom.id, "item", this.item.id, "value");
    },

    constructor: function() {
        BaseModel.apply(this, arguments);
    },

    initialize: function() {
        BaseModel.prototype.initialize.apply(this);
        this.listenTo(this, "change:content", function() { this.onChangeState(this.STATE_IDLE); });
    },

    setBom: function(bom) { this.bom = bom; },
    getBom: function() { return this.bom; },

    setItem: function(item) { this.item = item; },
    getItem: function() { return this.item; },

    // TODO: Clean up in backend
    getAttributeId: function() { return this.get("bomFieldId"); },
    setAttributeId: function(attributeId) { return this.set("bomFieldId", attributeId); },

    // TODO: Clean up in backend
    parse: function(resp) {
        if (!resp) { return resp; }

        if (resp.bomField) {
            if (!resp.bomFieldId) {
                resp.bomFieldId = resp.bomField.id;
            }

            // TODO clone resp, threat argument as immutable
            delete resp.bomField;
        }

        return resp;
    },

    save: function(attrs, options) {
        options = _.defaults(options || {}, { patch: true });
        attrs = attrs || _.clone(this.attributes);

        // Filter the data to send to the server
        delete attrs.alerts;

        return BaseModel.prototype.save.call(this, attrs, options);
    },

    /* Alerts */

    // TODO: rename this, conflict with backbone
    clearAlerts: function() {
        this.set("alerts", {});
    },

    clearAlert: function(ruleId) {
        this.set("alerts", _.omit(this.get("alerts"), ruleId));
    },

    setAlert: function(ruleId, message) {
        var alerts = _.clone(this.get("alerts"));
        alerts[ruleId] = message;
        this.set("alerts", alerts);
    },

});

module.exports = BomItemValueModel;
