"use strict";

var _ = require("underscore");
var ActionConstants = require("constants/ActionConstants");
var AppDispatcher = require("dispatcher/AppDispatcher");
var FileCollection = require("collections/FileCollection");
var Backbone = require("backbone");
var ProductModel = require("models/ProductModel");

var FileStore = _.extend({
    collections: {},

    getType: function(model) {
        if (model instanceof ProductModel) {
            return "product";
        }
    },

    getKey: function(model) {
        return this.getType(model) + model.id;
    },

    load: function(model, options) {
        var key = this.getKey(model);
        var collection = this.collections[key];
        if(!collection) {
            collection = new FileCollection(null, {type: this.getType(model), entityId: model.id});
            this.collections[key] = {refCount: 0, collection: collection};
            collection.fetch(options);
        }

        this.collections[key].refCount++;
        return collection;
    },

    unload: function(model) {
        var key = this.getKey(model);
        if(!this.collections[key]) {
            return;
        }

        this.collections[key].refCount--;
        if(this.collections[key].refCount <= 0) {
            delete this.collections[key];
        }
    }

}, Backbone.Events);

FileStore.dispatchToken = AppDispatcher.register(function(payload) {
    var action = payload.action;
    var result = null;

    switch (action.type) {
        case ActionConstants.LOAD_FILES:
            result = FileStore.load(action.attributes.model);
            action.resolve(result);
            break;

        case ActionConstants.UNLOAD_FILES:
            result = FileStore.unload(action.attributes.model);
            action.resolve(result);
            break;

        default:
            // do nothing
    }

    action.result = _.extend({}, action.result, result);
});

module.exports = FileStore;
