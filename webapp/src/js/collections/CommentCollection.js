"use strict";

var _ = require("underscore");
var BaseCollection = require("collections/BaseCollection");
var CommentModel = require("models/CommentModel");
var _string = require("underscore.string");

var statefulMixin = require("utils/StatefulMixin");

var CommentCollection = BaseCollection.extend(
{
    mixins: [
        statefulMixin
    ],

    model: CommentModel,
    parent: undefined,
    newComment: undefined,

    fetched: false,
    fetching: false,

    totalServerCount: 0,
    leftServerCount: 0,

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

    isFetching: function() {
        return this.fetching;
    },

    hasFetched: function() {
        return this.fetched;
    },

    set: function(models) {
        var singular;

        models = BaseCollection.prototype.set.apply(this, arguments);
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
    },

    fetch: function fetch(options) {
        var success, error;

        this.fetched = true;
        this.fetching = true;

        options = options || {};

        success = options.success;
        options.success = function(response) {
            if (success) {
                success(response);
            }
            this.fetching = false;
        }.bind(this);

        error = options.error;
        options.error = function() {
            if (error) {
                error.apply(this, arguments);
            }
            this.fetching = false;
        }.bind(this);

        var xhr = BaseCollection.prototype.fetch.apply(this, arguments);
        return (xhr !== false) ? xhr : Promise.reject(new Error("Invalid collection attributes."));
    },

    getNewComment: function() {
        if(!this.newComment) {
            this.buildNewComment();
        }
        return this.newComment;
    },

    buildNewComment: function() {
        this.newComment = new CommentModel();
        this.newComment.setParent(this.getParent());
        this.newComment.on("sync", function() {
            this.add(this.newComment.clone());
            this.newComment.clear();
            this.newComment.onChangeState(this.newComment.STATE_SUCCESS);
        }.bind(this));
    }
});

module.exports = CommentCollection;
