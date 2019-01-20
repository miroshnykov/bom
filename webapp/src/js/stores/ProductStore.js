"use strict";

var _ = require("underscore");
var ActionConstants = require("constants/ActionConstants");
var AppDispatcher = require("dispatcher/AppDispatcher");
var ProductCollection = require("collections/ProductCollection");
var UserEvent = require("events/UserEvent");
var Backbone = require("backbone");

var ProductStore = _.extend({
    collection: new ProductCollection(),

    create: function(options) {
        return {
            product: this.collection.create({name: "My Product"}, options)
        };
    }


}, Backbone.Events);

ProductStore.dispatchToken = AppDispatcher.register(function(payload) {
    var action = payload.action;
    var result = null;
    var options = {success: action.resolve, error: action.reject};

    switch (action.type) {
        case ActionConstants.CREATE_PRODUCT:
            result = ProductStore.create(options);
            break;

        default:
            // do nothing
    }

    action.result = _.extend({}, action.result, result);
});

ProductStore.listenTo(Backbone, UserEvent.EVENT_LOAD_DATA, function(event) {
    ProductStore.collection.onLoadData(event);
});

module.exports = ProductStore;
