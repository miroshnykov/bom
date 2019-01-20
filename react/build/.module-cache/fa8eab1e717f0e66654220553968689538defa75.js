var ExtendedCollection = require("../utils/ExtendedCollection");
var BomItemModel = require("../models/BomItemModel");
var ApiConstants = require("../constants/ApiConstants");
var TypeConstants = require("../constants/TypeConstants");

var BomItemCollection = ExtendedCollection.extend({
    model: BomItemModel,
    bomId: undefined,
    comparator: "position",

    url: function() {
        return ApiConstants.PATH_PREFIX + "/" + this.getCompany() + "/bom/" + this.getBom() + "/item";
    },

    setBom: function(bomId) {
        this.bomId = bomId;

        this.each(function(item) {
            item.setBom(bomId);
        });
    },

    getBom: function() {
        return this.bomId;
    },

    parse: function(resp, options) {
        //parse each item embedded entities (i.e. bomItemFields)
        _.each(resp, function(item) {

            if (item.bomItemFields) {
                if (!item.values) {
                    item.values = item.bomItemFields;
                }

                delete item.bomItemFields;
            }

            _.each(item.values, function(value) {
                if (value.bomField) {
                    if (!value.bomFieldId) {
                        value.bomFieldId = value.bomField.id;
                    }

                    delete value.bomField;
                }
            });

            delete item.bomItemFields;
        });

        return resp;
    },

    set: function(models, options) {
        var models = ExtendedCollection.prototype.set.apply(this, arguments);
        var singular;

        // If the bom is not set, return models as usual
        if (!this.bomId) {
            return models;
        }

        // If company is set, then set on all set models
        singular = !_.isArray(models);

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

        return models;
    },

    removeValuesForAttribute: function(attributeId) {
        this.each( function( item ) {
            item.set("values", _.filter(item.get("values"), function(value) {
                return value.bomFieldId !== attributeId;
                //return value.get("attributeId") !== attributeId;
            }));
        }, this);
    }
});

module.exports = BomItemCollection;
