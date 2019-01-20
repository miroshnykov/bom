"use strict";

var _ = require("underscore");

var BaseModel = require("models/BaseModel");
var BomItemValueCollection = require("collections/BomItemValueCollection");
var CommentCollection = require("collections/CommentCollection");
var ChangeCollection;
var moment = require("moment");

var statefulMixin = require("utils/StatefulMixin");

var BomItemModel = BaseModel.extend({
    mixins: [
        statefulMixin
    ],

    bom: undefined,
    changes: undefined,

    defaults: {
        alerts: {}
    },

    urlRoot: function() {
        return require("utils/BaseUrl").buildUrl("bom", this.bom.id, "item");
    },

    constructor: function() {
        var comments = new CommentCollection();
        comments.setParent(this);
        this.setAssociation("comments", comments);

        this.setAssociation("values", new BomItemValueCollection());

        BaseModel.apply(this, arguments);
    },

    initialize: function() {
        BaseModel.prototype.initialize.apply(this, arguments);
        this.listenTo(this, "change:position", function() { this.onChangeState(this.STATE_IDLE); });
    },

    setBom: function(bom) {
        this.bom = bom;
        this.getValues().setBom(bom);
    },

    getBom: function() {
        return this.bom;
    },

    getChanges: function() {
        ChangeCollection = require("collections/ChangeCollection");

        if (!this.changes) {
            this.changes = new ChangeCollection();
            this.changes.type = "item";
            this.changes.entityId = this.id;
        }
        return this.changes;
    },

    parse: function(resp) {
        if (!resp) { return resp; }

        if (resp.bomItemFields) {
            if (!resp.values) {
                resp.values = resp.bomItemFields;
            }

            // TODO clone resp, treat argument as immutable
            delete resp.bomItemFields;
        }

        return resp;
    },

    set: function(key, val, options) {
        var attr, attrs, method, wasNew, associations, model;

        if (!key) { return this; }

        if (typeof key === "object") {
            attrs = key;
            options = val;
        } else {
            (attrs = {})[key] = val;
        }

        options = options || {};
        method = options.reset ? "reset" : "set";

        associations = {};

        for (attr in attrs) {
            if (!attrs.hasOwnProperty(attr)) {
                continue;
            }
            val = attrs[attr];

            switch(attr) {
                case "values":
                    this.getValues()[method](val, _.extend({}, options, { silent: true }));
                    delete attrs[attr];
                    break;

                case "totalComments":
                    this.getComments().setTotalServerCount(val);
                    break;
            }
        }

        wasNew = this.isNew();
        model = BaseModel.prototype.set.apply(this, [attrs, options]);

        // If the model is newly created, set the association's bom id
        if (model && wasNew !== model.isNew()) {
            model.getValues().setItem( model );
        }

        return model;
    },

    save: function(attrs, options) {
        options = options || {};

        attrs = attrs || _.clone(this.attributes);

        // Filter the data to send to the server
        delete attrs.selected;
        delete attrs.selectedAt;
        delete attrs.lastSelected;
        delete attrs.alerts;

        options.data = JSON.stringify(attrs);
        options.contentType = "application/json";

        // Proxy the call to the original save function
        return BaseModel.prototype.save.call(this, attrs, options);
    },

    // Position

    decrease: function(change) {
        change = change || 1;
        this.set("position", this.get("position") - change);
    },

    increase: function(change) {
        change = change || 1;
        this.set("position", this.get("position") + change);
    },

    // Item Values

    getValue: function(valueId) {
        return this.getValues().get(valueId);
    },

    getValues: function() {
        return this.getAssociation("values");
    },

    addValue: function(attributes, options) {
        return this.getValues().add(attributes, options);
    },

    setValue: function(attributes, options) {
        var value = this.getValue(attributes.id || attributes.cid);
        if (!value) { return; }

        return value.set(attributes, options);
    },

    removeValue: function(valueId) {
        return this.getValues().remove(valueId);
    },

    getValueForAttribute: function(attributeId) {
        return this.getValues().findWhere({
            bomFieldId: attributeId
        });
    },

    clearAlerts: function() {
        this.getValues().each(function(value) {
            value.clearAlerts();
        });

        this.set("alerts", {});
    },

    clearAlert: function(ruleId) {
        this.getValues().each(function(value) {
            value.clearAlert(ruleId);
        });

        this.set("alerts", _.omit(this.get("alerts"), ruleId));
    },

    setAlert: function(ruleId, message) {
        var alerts = _.clone(this.get("alerts"));
        alerts[ruleId] = message;
        this.set("alerts", alerts);
    },

    /* Selection */

    isSelected: function() {
        return !!this.get("selectedAt");
    },

    setSelected: function(selected) {
        this.set({
            selectedAt: selected ? moment().unix() : null
        });
    },

    /* Comments */

    getComments: function() {
        return this.getAssociation("comments");
    }

});

module.exports = BomItemModel;
