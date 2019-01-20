"use strict";

var _ = require("underscore");
var ExtendedModel = require("../utils/ExtendedModel");

var ChangeModel = ExtendedModel.extend({
    _saving: false,
    _saved: false,
    _retries: 0,

    defaults: function() {
        return {
            visible: true
        };
    },

    parse: function(resp) {
        // Parse the product
        if (resp.product) {
            if (!resp.productId) {
                resp.productId = resp.product.id;
            }

            delete resp.product;
        }

        // Parse the bom
        if (resp.bom) {
            if (!resp.bomId) {
                resp.bomId = resp.bom.id;
            }

            delete resp.bom;
        }

        // Parse the item
        if (resp.item) {
            if (!resp.itemId) {
                resp.itemId = resp.item.id;
            }

            delete resp.item;
        }

        // Parse the value
        if (resp.value) {
            if (!resp.valueId) {
                resp.valueId = resp.value.id;
            }

            delete resp.value;
        }

        // Parse the user
        if (resp.user) {
            if (!resp.userId) {
                resp.userId = resp.user.id;
            }

            delete resp.user;
        }

        // Parse the createdAt date
        if (_.isObject(resp.createdAt)) {
            resp.createdAt = resp.createdAt.date;
        }

        // Remove attributes that start with underscore
        resp = _.omit(resp, function(value, key) {
            return _.isString(key) && key.slice(0, 1) === "_";
        });

        return resp;
    },

    setSaving: function(saving) {
        this._saving = saving;
        if (saving) {
            this._saved = false;
            this._retries++;
        }
        this.trigger("change");
    },

    setSaved: function(saved) {
        this._saved = saved;
        this._saving = false;
        this.trigger("change");
    },

    isSaving: function() { return this._saving; },
    isSaved: function() { return this._saved || !this.isNew(); },
    triedSaving: function() { return !!this._retries; }
});

module.exports = ChangeModel;
