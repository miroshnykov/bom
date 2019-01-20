"use strict";

var _ = require("underscore");
var Backbone = require("backbone");
var BaseCollection = require("collections/BaseCollection");
var BomItemEvent = require("events/BomItemEvent");
var BomItemModel = require("models/BomItemModel");
var statefulMixin = require("utils/StatefulMixin");

var BomItemCollection = BaseCollection.extend({
    mixins: [
        statefulMixin
    ],

    model: BomItemModel,
    comparator: "position",
    bom: undefined,

    url: function() {
        return require("utils/BaseUrl").buildUrl("bom", this.bom.id, "item");
    },

    initialize: function() {
        this.listenTo(this, "change:" + this.comparator, function() { this.sort(); });
        this.listenTo(this, "change:selectedAt", this.onSelect);
        this.listenTo(this, "remove", this.onRemove);
        this.listenTo(Backbone, BomItemEvent.EVENT_UPDATE, this.onBomItemUpdate);
    },

    onBomItemUpdate: function(event) {
        if(!event.id || !this.get(event.id)) {
            return;
        }

        var item = this.get(event.id);
        item.set({
            isApproved: event.isApproved,
            totalComments: event.totalComments,
            totalWarnings: event.totalWarnings,
            totalErrors: event.totalErrors,
            position: event.position
        });
    },

    setBom: function(bom) {
        this.bom = bom;

        this.each(function(item) {
            item.setBom(bom);
        });
    },

    getBom: function() {
        return this.bom;
    },

    set: function(models) {
        models = BaseCollection.prototype.set.apply(this, arguments);
        var singular;

        // If the bom is not set, return models as usual
        if (!this.bom) {
            return models;
        }

        // If company is set, then set on all set models
        singular = !_.isArray(models);

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

        return models;
    },

    onRemove: function(item) {
        var items = this.filter(function(result) {
            return result.get("position") > item.get("position");
        });

        _.each(items, function(result) {
            result.decrease();
        });
    },

    removeValuesForAttribute: function(attributeId) {
        this.each( function( item ) {
            item.getValues().removeForAttribute(attributeId);
        }, this);
    },

    /* Selection */

    getSelected: function() {
        return this.filter(function(item) {
            return item.isSelected();
        });
    },

    onSelect: function() {
        var selected = _.sortBy(this.getSelected(), function(item) {
            return item.get("selectedAt");
        });

        if (_.isEmpty(selected)) { return; }

        _.each(selected, function(item) {
            item.set({
                lastSelected: false
            });
        });

        _.last(selected).set({
            lastSelected: true
        });
    },

    getLastSelected: function() {
        var selected = _.sortBy(this.getSelected(), function(item) {
            return item.get("selectedAt");
        });

        return _.last(selected) || null;
    },

    isAnySelected: function() {
        return !!this.find(function(item) {
            return item.isSelected();
        });
    },

    areAllSelected: function() {
        return !!this.length && !this.find(function(item) {
            return !item.isSelected();
        });
    }
});

module.exports = BomItemCollection;
