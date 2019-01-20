/*global jest:false, expect: false, Backbone:true, $:true*/
"use strict";

jest.dontMock("stores/FieldStore");

$ = require("jquery");

Backbone = require("backbone");
Backbone.$ = $;

describe("FieldStore", function() {

	var FieldStore = require("stores/FieldStore");
	var FieldCollection = require("collections/FieldCollection");

	it("initializes the store as a FieldCollection", function() {
	    expect(FieldStore instanceof FieldCollection).toBe(true);
	});

});
