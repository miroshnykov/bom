"use strict";

var _ = require("underscore");
var ActionConstants = require("constants/ActionConstants");
var AppDispatcher = require("dispatcher/AppDispatcher");
var ActivityCollection = require("collections/ActivityCollection");
var Backbone = require("backbone");
var BomModel = require("models/BomModel");

var ActivityStore = _.extend({
    collections: {},

    getType: function(model) {
        return model instanceof BomModel ? "bom" : "product";
    },

    getKey: function(model) {
        return this.getType(model) + model.id;
    },

    load: function(model, options) {
        var key = this.getKey(model);
        var collection = this.collections[key];
        if(!collection) {
            collection = new ActivityCollection(null, {type: this.getType(model), entityId: model.id});
            this.collections[key] = {refCount: 0, collection: collection};
            collection.fetch(options);
        }

        this.collections[key].refCount++;
        return collection;
    },

    unload: function(model, options) {
        var key = this.getKey(model);
        if(!this.collections[key]) {
            return;
        }

        this.collections[key].refCount--;
        if(this.collections[key].refCount <= 0) {
            delete this.collections[key];
        }
    },


}, Backbone.Events);

ActivityStore.dispatchToken = AppDispatcher.register(function(payload) {
    var action = payload.action;
    var result = null;
    var options = {success: action.resolve, error: action.reject};

    switch (action.type) {
        case ActionConstants.LOAD_STREAM:
            result = ActivityStore.load(action.attributes.model, options);
            break;

        case ActionConstants.UNLOAD_STREAM:
            result = ActivityStore.unload(action.attributes.model, options);
            break;

        default:
            // do nothing
    }

    action.result = _.extend({}, action.result, result);
});

// ActivityStore.listenTo(Backbone, UserEvent.EVENT_LOAD_DATA, function(event) {
//     ActivityStore.collection.onLoadData(event);
// });

module.exports = ActivityStore;
