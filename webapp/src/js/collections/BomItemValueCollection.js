"use strict";

var _ = require("underscore");

var BaseCollection = require("collections/BaseCollection");
var BomItemValueModel = require("models/BomItemValueModel");

var statefulMixin = require("utils/StatefulMixin");

var BomItemValueCollection = BaseCollection.extend({
    mixins: [
        statefulMixin
    ],

    model: BomItemValueModel,
    bom: undefined,
    item: undefined,

    url: function() {
        return require("utils/BaseUrl").buildUrl("bom", this.bom.id, "item", this.item.id, "value");
    },

    setBom: function(bom) {
        this.bom = bom;

        this.each(function(value) {
            value.setBom(bom);
        });
    },

    getBom: function() {
        return this.bom;
    },

    setItem: function(item) {
        this.item = item;

        this.each(function(value) {
            value.setItem(item);
        });
    },

    getItem: function() {
        return this.itemId;
    },

    set: function(models) {
        models = BaseCollection.prototype.set.apply(this, arguments);
        var singular = !_.isArray(models);

        // Set the bom id on the models
        if (this.bom) {
            if (singular) {
                if (models && _.isFunction(models.setBom)) {
                    models.setBom( this.bom );
                }
            }
            else {
                _.each(models, function(model) {
                    if (model && _.isFunction(model.setBom)) {
                        model.setBom( this.bom );
                    }
                }, this);
            }
        }

        // Set the item id on the models
        if (this.item) {
            if (singular) {
                if (models && _.isFunction(models.setItem)) {
                    models.setItem( this.item );
                }
            }
            else {
                _.each(models, function(model) {
                    if (model && _.isFunction(model.setItem)) {
                        model.setItem( this.item );
                    }
                }, this);
            }
        }

        return models;
    },

    createForAttribute: function(attrs, attribute, options) {
        attrs = _.extend(attrs, {bomFieldId: attribute.cid});

        options = options || {};
        options.attrs = _.extend({}, attrs, {
            attribute: attribute.toJSON( {json: {cid: true}} )
        });

        return this.add(attrs).save(undefined, options).then(function(value) {
            attribute.set("id", value.get("bomFieldId"));
        });
    },

    removeForAttribute: function(attributeId) {
        this.remove( this.findWhere( {bomFieldId: attributeId} ) );
    }
});

module.exports = BomItemValueCollection;
