"use strict";

var FieldTypeCollection = require("collections/FieldTypeCollection");
var UserEvent = require("events/UserEvent");
var Backbone = require("backbone");

var store = new FieldTypeCollection();
store.listenTo(Backbone, UserEvent.EVENT_LOAD_DATA, store.onLoadData);

module.exports = store;
