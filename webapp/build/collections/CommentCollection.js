"use strict";

var _ = require("underscore");
var ExtendedCollection = require("../utils/ExtendedCollection");
var CommentModel = require("../models/CommentModel");
var _string = require("underscore.string");

var CommentCollection = ExtendedCollection.extend(
{
    model: CommentModel,
    parent: undefined,
    comparator: function(a, b) {
        var acid, bcid;

        if ((a.id && !b.id) || (a.id < b.id)) { return 1; }
        else if ((b.id && !a.id) || (a.id > b.id)) { return -1; }

        acid = parseInt(_string.ltrim(a.cid, "c"), 10);
        bcid = parseInt(_string.ltrim(b.cid, "c"), 10);

        if (acid < bcid) { return 1; }
        else if (acid > bcid) { return -1; }
        else { return 0; }
    },
    totalServerCount: 0,
    leftServerCount: 0,

    url: function() {
        return this.parent.url() + "/comment";
    },

    setParent: function(parent) {
        this.parent = parent;

        this.each(function(comment) {
            comment.setParent(parent);
        });
    },

    getParent: function() {
        return this.parent;
    },

    setTotalServerCount: function(count) {
        this.leftServerCount = this.totalServerCount = count;
    },

    decLeftServerCount: function(count) {
        if (this.leftServerCount !== undefined) {
            this.leftServerCount -= count;
            this.leftServerCount = this.leftServerCount < 0 ? 0 : this.leftServerCount;
        }
    },

    isLoaded: function() {
        return this.leftServerCount === 0;
    },

    parse: function(resp, options) {
        if (!resp) {
            return;
        }

        // Get the total number of items returned
        if (resp.total_items) {
            options.count = resp.total_items;
        } else if (resp._embedded && _.isArray(resp._embedded.comments)) {
            options.count = resp._embedded.comments.length;
        }

        // Return the field array
        return resp._embedded && resp._embedded.comments ? resp._embedded.comments : resp;
    },

    set: function(models) {
        var singular;

        models = ExtendedCollection.prototype.set.apply(this, arguments);
        singular = !_.isArray(models);

        if (singular) {
            if (models && _.isFunction(models.setParent)) {
                models.setParent( this.parent );
            }
        }
        else {
            _.each(models, function(model) {
                if (model && _.isFunction(model.setParent)) {
                    model.setParent( this.parent );
                }
            }, this);
        }

        return models;
    }
});

module.exports = CommentCollection;
