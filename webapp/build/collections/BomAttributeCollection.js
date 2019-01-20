"use strict";

var _ = require("underscore");
var ExtendedCollection = require("../utils/ExtendedCollection");
var BomAttributeModel = require("../models/BomAttributeModel");
var ApiConstants = require("../constants/ApiConstants");

var BomAttributeCollection = ExtendedCollection.extend({
    model: BomAttributeModel,
    bomId: undefined,
    comparator: "position",

    url: function() {
        return ApiConstants.PATH_PREFIX + "/" + this.getCompany() + "/bom/" + this.getBom() + "/attribute";
    },

    initialize: function() {
        this.listenTo(this, "change:" + this.comparator, function() { this.sort(); });
    },

    setBom: function(bomId) {
        this.bomId = bomId;

        this.each(function(attribute) {
            attribute.setBom(bomId);
        });
    },

    getBom: function() {
        return this.bomId;
    },

    set: function(models) {
        models = ExtendedCollection.prototype.set.apply(this, arguments);
        var singular = !_.isArray(models);

        // Set the bom id on the models
        if (this.bomId) {
            if (singular) {
                if (models && _.isFunction(models.setBom)) {
                    models.setBom( this.bomId );
                }
            }
            else {
                _.each(models, function(model) {
                    if (model && _.isFunction(model.setBom)) {
                        model.setBom( this.bomId );
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
    },
});

module.exports = BomAttributeCollection;
