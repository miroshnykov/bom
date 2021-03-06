"use strict";

var _ = require("underscore");
var ApiConstants = require("../constants/ApiConstants");
var ExtendedModel = require("../utils/ExtendedModel");
var BomItemValueCollection = require("../collections/BomItemValueCollection");
var CommentCollection = require("../collections/CommentCollection");

var BomItemModel = ExtendedModel.extend({
    companyId: undefined,
    bomId: undefined,
    validationErrors: undefined,
    _loadingChanges: false,
    _hasLoadedChanges: false,
    _loadedAllChanges: false,

    urlRoot: function() {
        return ApiConstants.PATH_PREFIX + "/" + this.getCompany() + "/bom/" + this.getBom() + "/item";
    },

    constructor: function() {
        this.validationErrors = {};
        this.setAssociation("values", new BomItemValueCollection());

        var comments = new CommentCollection();
        comments.setParent(this);
        this.setAssociation("comments", comments);

        ExtendedModel.apply(this, arguments);
    },

    initialize: function() {
        ExtendedModel.prototype.initialize.apply(this, arguments);

        this.listenTo(this.getValues(), "add", function(model, collection, options) {
            this.trigger("add:values", model, collection, _.extend(options, { item: this }));
        });

        this.listenTo(this.getValues(), "change", function(collection, options) {
            this.trigger("change:values", collection, _.extend(options, { item: this }));
        });

        this.listenTo(this.getValues(), "remove", function(model, collection, options) {
            this.trigger("remove:values", model, collection, _.extend(options, { item: this }));
        });

        this.listenTo(this.getValues(), "reset", function(collection, options) {
            this.trigger("reset:values", collection, _.extend(options, { item: this }));
        });

        this.listenTo(this.getValues(), "sync", function(collection, resp, options) {
            this.trigger("sync:values", collection, resp, _.extend(options, { item: this }));
        });

        this.listenTo(this.getComments(), "add", function(model, collection, options) { this.trigger("add:comments", model, collection, options); });
        this.listenTo(this.getComments(), "change", function(collection, options) { this.trigger("change:comments", collection, options); });
        this.listenTo(this.getComments(), "remove", function(model, collection, options) { this.trigger("remove:comments", model, collection, options); });
        this.listenTo(this.getComments(), "reset", function(collection, options) { this.trigger("reset:comments", collection, options); });
        this.listenTo(this.getComments(), "sync", function(collection, resp, options) { this.trigger("sync:comments", collection, resp, options); });
    },

    setCompany: function(companyId) {
        this.companyId = companyId;
        this.getValues().setCompany(companyId);
        this.getComments().setCompany(companyId);
    },

    getCompany: function() {
        return this.companyId;
    },

    setBom: function(bomId) {
        this.bomId = bomId;
        this.getValues().setBom(bomId);
    },

    getBom: function() {
        return this.bomId;
    },

    // Changes

    isLoadingChanges: function() {
        return this._loadingChanges;
    },

    setLoadingChanges: function(loading) {
        this._loadingChanges = loading;
        if (loading) {
            this._hasLoadedChanges = true;
        }
        this.trigger("update");
    },

    hasLoadedChanges: function() {
        return this._hasLoadedChanges;
    },

    loadedAllChanges: function() {
        return this._loadedAllChanges;
    },

    setLoadedAllChanges: function(loaded) {
        this._loadedAllChanges = loaded;
        this.trigger("update");
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
        var attr, attrs, method, model, wasNew, associations;

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
                    delete attrs[attr];
                    break;
            }
        }

        wasNew = this.isNew();
        model = ExtendedModel.prototype.set.apply(this, [attrs, options]);

        // If the model is newly created, set the association's bom id
        if (model && wasNew !== model.isNew()) {
            model.getValues().setItem( model.id );
        }

        return model;
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

    isValid: function() {
        return _.isEmpty(this.validationErrors);
    },

    validate: function(ruleId) {
        delete this.validationErrors[ruleId];
    },

    invalidate: function(ruleId, message) {
        this.validationErrors[ruleId] = message;
    },

    getValidationErrorMessages: function() {
        return _.values(this.validationErrors);
    },

    /* Comments */

    getComments: function() {
        return this.getAssociation("comments");
    }
});

module.exports = BomItemModel;
