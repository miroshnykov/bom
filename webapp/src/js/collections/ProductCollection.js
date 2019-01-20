"use strict";

var _ = require("underscore");
var Backbone = require("backbone");
var BaseCollection = require("collections/BaseCollection");
var BomEvent = require("events/BomEvent");
var ProductEvent = require("events/ProductEvent");
var ProductModel = require("models/ProductModel");

module.exports = BaseCollection.extend({
    model: ProductModel,

    comparator: function(item) {
        return item.get("name").toLowerCase();
    },

    url: function() {
        return require("utils/BaseUrl").buildUrl("product");
    },

    initialize: function() {
        this.listenTo(Backbone, BomEvent.EVENT_DELETE, this.onBomDelete);
        this.listenTo(Backbone, ProductEvent.EVENT_DELETE, this.onProductDelete);
        this.listenTo(Backbone, ProductEvent.EVENT_CREATE, this.onProductCreate);
        this.listenTo(this, "change:name", function() { this.sort(); });
    },

    onBomDelete: function(event) {
        if(!event.id) { return; }
        this.each(function(product) {
            product.detachBom(event.id);
        });
    },

    onProductCreate: function(event) {
        this.add(event);
    },

    onProductDelete: function(event) {
        if(!event.id) { return; }
        this.remove(event);
    },

    getParentsOfBom: function(bomId) {
        return this.filter(function(product) {
            return product.isParentOfBom(bomId);
        });
    },

    onLoadData: function(event) {
        if (!event.company) { return; }

        var data = null;
        if (event.company.data && _.isArray(event.company.data.products)) {
            data = event.company.data.products;
        }

        this.reset(data, {parse: true});
    }
});
