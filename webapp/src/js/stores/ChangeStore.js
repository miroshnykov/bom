"use strict";

var AppDispatcher = require("dispatcher/AppDispatcher");
var ChangeCollection = require("collections/ChangeCollection");
var UserEvent = require("events/UserEvent");
var Backbone = require("backbone");

var store = new ChangeCollection();
store.dispatchToken = AppDispatcher.register(store.dispatchCallback.bind(store));
store.listenTo(Backbone, UserEvent.EVENT_LOAD_DATA, store.onLoadData);

module.exports = store;
