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

    initialize: function() {
        this.listenTo(this, "change:" + this.comparator, function(event) { this.sort(); });
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
            item.getValues().removeForAttribute(attributeId);
        }, this);
    }
});

module.exports = BomItemCollection;
