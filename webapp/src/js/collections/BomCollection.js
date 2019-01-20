"use strict";

var _ = require("underscore");
var Backbone = require("backbone");

var BaseCollection = require("collections/BaseCollection");
var BomModel = require("models/BomModel");
var BomEvent = require("events/BomEvent");
var ProductStore;

module.exports = BaseCollection.extend({
    model: BomModel,

    comparator: function(item) {
        return item.get("name").toLowerCase();
    },

    url: function() {
        return require("utils/BaseUrl").buildUrl("bom");
    },

    initialize: function() {
        this.listenTo(Backbone, BomEvent.EVENT_UPDATE, this.onBomUpdate);
        this.listenTo(Backbone, BomEvent.EVENT_DELETE, this.onBomDelete);
        this.listenTo(this, "change:name", function() { this.sort(); });
    },

    getChildrenBomsOfBom: function(bomId) {
        var bom = this.get(bomId);
        var children = [];
        if (bom) {
            children = bom.get("bomIds").map(function(result) {
                return this.get(result);
            }, this);
        }

        return children;
    },

    getDescendantBomsOfBom: function(bomId) {
        var descendants = [];
        var children;
        var child;

        children = this.getChildrenBomsOfBom(bomId);
        for (var index in children) {
            if (!children.hasOwnProperty(index)) {
                continue;
            }

            child = children[index];
            descendants.push(child);
            descendants = descendants.concat(this.getDescendantBomsOfBom(child.id || child.cid));
        }

        return descendants;
    },

    getParentBomsOfBom: function(bomId) {
        var parents = [];

        this.each(function(result) {
            if (this.isBomParentOfBom(result.id || result.cid, bomId)) {
                parents.push(result);
            }
        }, this);

        return parents;
    },

    isBomParentOfBom: function(parentId, childId) {
        var children = this.getChildrenBomsOfBom(parentId);

        for (var index in children) {
            if (children[index].id === childId || children[index].cid === childId) {
                return true;
            }
        }

        return false;
    },

    onBomCreate: function(event) {
        ProductStore = require("stores/ProductStore");

        if(!event.id || this.get(event.id)) {
            return;
        }

        // Bom we don't know yet. Make sure to add it.
        var bom = this.add(event);

        _.each(event.products, function(productId) {
            var product = ProductStore.collection.get(productId);
            if (product) {
                product.attachBom(bom);
            }
        });
    },

    onBomUpdate: function(event) {
        if(!event.id || !this.get(event.id)) {
            return;
        }

        var bom = this.get(event.id);
        bom.set({
            name: event.name
        });
    },

    onBomDelete: function(event) {
        if(!event.id) { return; }
        this.remove(event.id);
    },

    onLoadData: function(event) {
        if (!event.company) { return; }

        this.reset();

        if (event.company.data && _.isArray(event.company.data.boms)) {
            this.set(event.company.data.boms, {parse: true});
        }
    },


});
