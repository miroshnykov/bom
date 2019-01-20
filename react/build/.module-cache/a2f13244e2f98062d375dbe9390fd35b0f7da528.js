var ExtendedCollection = require("../utils/ExtendedCollection");
var BomAttributeModel = require("../models/BomAttributeModel");
var ApiConstants = require("../constants/ApiConstants");
var TypeConstants = require("../constants/TypeConstants");

var BomAttributeCollection = ExtendedCollection.extend({
    model: BomAttributeModel,
    bomId: undefined,
    comparator: "position",

    url: function() {
        return ApiConstants.PATH_PREFIX + "/" + this.getCompany() + "/bom/" + this.getBom() + "/attribute";
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

    parse: function(resp, options) {

        _.each(resp, function(attribute) {
            if (attribute.field) {
                // Fold fieldId if passed as Field object
                if (!attribute.fieldId) {
                    attribute.fieldId = attribute.field.id;
                }

                delete attribute.field;
            }
        });

        return resp;
    },

    set: function(models, options) {
        var models = ExtendedCollection.prototype.set.apply(this, arguments);
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

    // hide: function(id) {
    //     var attribute = this.get(id);
    //     var position;

    //     if (!attribute) { return ; }
    //     if (!attribute.get("visible")) { return; }

    //     position = attribute.get("position");

    //     // Hide the attribute
    //     attribute.set({
    //         visible: false,
    //         position: -1
    //     })

    //     // Adjust the position of the other attributes
    //     this.each(function(attribute) {
    //         if (attribute.get("position") >= position) {
    //             attribute.decrease();
    //         }
    //     });

    //     return attribute;
    // },

    fixFieldId: function(cid, id) {
        this.each(function(attribute) {
            if (attribute.get("fieldId") === cid) {
                attribute.set("fieldId", id);
            }
        });
    },
});

module.exports = BomAttributeCollection;
