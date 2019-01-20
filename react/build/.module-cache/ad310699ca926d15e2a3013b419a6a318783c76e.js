var ExtendedCollection = require("../utils/ExtendedCollection");
var BomItemValueModel = require("../models/BomItemValueModel");
var ApiConstants = require("../constants/ApiConstants");
var TypeConstants = require("../constants/TypeConstants");

var BomItemValueCollection = ExtendedCollection.extend({
    model: BomItemValueModel,
    bomId: undefined,
    itemId: undefined,

    url: function() {
        return ApiConstants.PATH_PREFIX + "/" + this.getCompany() + "/bom/" + this.getBom() + "/item/" + this.getItem() + "/value";
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

    setItem: function(itemId) {
        this.itemId = itemId;

        this.each(function(value) {
            value.setItem(itemId);
        });
    },

    getItem: function() {
        return this.itemId;
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

        // Set the item id on the models
        if (this.itemId) {
            if (singular) {
                if (models && _.isFunction(models.setItem)) {
                    models.setItem( this.itemId );
                }
            }
            else {
                _.each(models, function(model) {
                    if (model && _.isFunction(model.setItem)) {
                        model.setItem( this.itemId );
                    }
                }, this);
            }
        }

        return models;
    },

    removeForAttribute: function(attributeId) {
        this.remove( this.findWhere( {bomFieldId: attributeId} ) );
    }
});

module.exports = BomItemValueCollection;
