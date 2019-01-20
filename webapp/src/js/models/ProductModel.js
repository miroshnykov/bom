"use strict";

var _ = require("underscore");

var CommentCollection = require("collections/CommentCollection");
var BaseModel = require("models/BaseModel");
var statefulMixin = require("utils/StatefulMixin");
var ChangeCollection;
var FileCollection;

var ProductModel = BaseModel.extend({
    mixins: [
        statefulMixin
    ],

    urlRoot: function() {
        return require("utils/BaseUrl").buildUrl("product");
    },

    defaults: function() {
        return {
            bomIds: []
        };
    },

    constructor: function() {
        var comments = new CommentCollection();
        comments.setParent(this);
        this.setAssociation("comments", comments);

        BaseModel.apply(this, arguments);
    },

    set: function(key, val, options) {
        var attr, attrs, method;

        if (key === null) {
            return this;
        }

        if (typeof key === "object") {
            attrs = key;
            options = val;
        } else {
            (attrs = {})[key] = val;
        }

        options = options || {};
        method = options.reset ? "reset" : "set";

        for (attr in attrs) {
            if (!attrs.hasOwnProperty(attr)) {
                continue;
            }
            val = attrs[attr];

            switch(attr) {
                case "totalComments":
                    this.getComments().setTotalServerCount(val);
                    delete attrs[attr];
                    break;
            }
        }

        return BaseModel.prototype.set.apply(this, [attrs, options]);
    },

    save: function(attrs, options) {
        options = options || {};

        attrs = attrs || _.clone(this.attributes);

        if (options.createBom) {
            options.attrs = _.extend(attrs, { createBom: true});
        }

        return BaseModel.prototype.save.call(this, attrs, options);
    },

    getChanges: function() {
        ChangeCollection = require("collections/ChangeCollection");

        if (!this.changes) {
            this.changes = new ChangeCollection();
            this.changes.type = "product";
            this.changes.entityId = this.id;
        }
        return this.changes;
    },

    // Children BoMs

    getBoms: function() {
        return this.get("bomIds");
    },

    setBoms: function(bomIds) {
        this.set({
            "bomIds": bomIds
        });
    },

    isParentOfBom: function(bomId) {
        return _.contains(this.getBoms(), bomId);
    },

    attachBom: function(bom) {
        var bomIds = _.clone(this.getBoms());
        var id = _.isObject(bom) ? bom.id || bom.cid : bom;
        if (!id) { return; }
        if (_.contains(bomIds, id)) { return; }

        bomIds.push(id);
        this.setBoms(bomIds);
    },

    detachBom: function(bom) {
        var bomIds = this.getBoms();
        var id = _.isObject(bom) ? bom.id || bom.cid : bom;
        if (!id) { return; }

        bomIds = bomIds.filter(function(result) {
            return result !== id;
        });

        this.setBoms(bomIds);
    },

    fixBomId: function(bom) {
        if (!bom.id) { return; }

        var bomIds = _.clone(this.getBoms());

        var index = _.indexOf(bomIds, bom.cid);
        if (index === -1) { return; }

        if (_.contains(bomIds, bom.id)) {
            bomIds.splice(index, 1);
        }
        else {
            bomIds[index] = bom.id;
        }

        this.setBoms(bomIds);
    },

    // Comments

    getComments: function() {
        return this.getAssociation("comments");
    }
});

module.exports = ProductModel;
