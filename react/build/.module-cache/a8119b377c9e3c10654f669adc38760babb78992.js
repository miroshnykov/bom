var ApiConstants = require("../constants/ApiConstants");
var ExtendedModel = require("../utils/ExtendedModel");
var BomItemValueCollection = require("../collections/BomItemValueCollection");

var BomItemModel = ExtendedModel.extend({
    companyId: undefined,
    bomId: undefined,

    urlRoot: function() {
        return ApiConstants.PATH_PREFIX + "/" + this.getCompany() + "/bom/" + this.getBom() + "/item";
    },

    constructor: function() {
        this.setAssociation("values", new BomItemValueCollection());
        ExtendedModel.apply(this, arguments);
    },

    initialize: function() {
        this.listenTo(this.getValues(), "add", function(model, collection, options) { this.trigger("add:values", model, collection, options); });
        this.listenTo(this.getValues(), "change", function(collection, options) { this.trigger("change:values", collection, options); });
        this.listenTo(this.getValues(), "remove", function(model, collection, options) { this.trigger("remove:values", model, collection, options); });
        this.listenTo(this.getValues(), "reset", function(collection, options) { this.trigger("reset:values", collection, options); });
        this.listenTo(this.getValues(), "sync", function(collection, resp, options) { this.trigger("sync:values", collection, resp, options); });
    },

    setCompany: function(companyId) {
        this.companyId = companyId;
        this.getValues().setCompany(companyId);
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

    parse: function(resp, options) {
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

        if (key == null) return this;

        if (typeof key === 'object') {
            attrs = key;
            options = val;
        } else {
            (attrs = {})[key] = val;
        }

        options || (options = {});
        method = options.reset ? 'reset' : 'set';

        associations = {};

        for (attr in attrs) {
            val = attrs[attr];

            switch(attr) {
                case "values":
                    this.getValues()[method](val, _.extend({}, options, { silent: true }));
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
        if (!value) { return }

        return value.set(attributes, options);
    },

    removeValue: function(valueId) {
        return this.getValues().remove(valueId);
    },

    getValueForAttribute: function(attributeId) {
        return this.getValues().findWhere({
            bomFieldId: attributeId
        });
    }
});

module.exports = BomItemModel;
