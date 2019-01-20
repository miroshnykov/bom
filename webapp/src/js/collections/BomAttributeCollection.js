"use strict";

var _ = require("underscore");
var BaseCollection = require("collections/BaseCollection");
var BomAttributeModel = require("models/BomAttributeModel");

var statefulMixin = require("utils/StatefulMixin");

var BomAttributeCollection = BaseCollection.extend({
    mixins: [
        statefulMixin
    ],

    model: BomAttributeModel,
    bom: undefined,
    comparator: "position",

    url: function() {
        return require("utils/BaseUrl").buildUrl("bom", this.bom.id, "attribute");
    },

    initialize: function() {
        this.listenTo(this, "change:" + this.comparator, function() { this.sort(); });
    },

    setBom: function(bom) {
        this.bom = bom;

        this.each(function(attribute) {
            attribute.setBom(bom);
        });
    },

    getBom: function() {
        return this.bom;
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

        return models;
    },

    fixFieldId: function(cid, id) {
        this.each(function(attribute) {
            if (attribute.get("fieldId") === cid) {
                attribute.set("fieldId", id);
            }
        });
    }
});

module.exports = BomAttributeCollection;
