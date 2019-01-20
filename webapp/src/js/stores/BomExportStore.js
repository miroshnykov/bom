"use strict";

var AppDispatcher = require("dispatcher/AppDispatcher");
var BomExportCollection = require("collections/BomExportCollection");
var UserEvent = require("events/UserEvent");
var Backbone = require("backbone");

var store = new BomExportCollection();

store.dispatchToken = AppDispatcher.register(store.dispatchCallback.bind(store));
store.listenTo(Backbone, UserEvent.EVENT_LOAD_DATA, store.onLoadData);

module.exports = store;
