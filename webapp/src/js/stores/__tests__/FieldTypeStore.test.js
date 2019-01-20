/*global jest:false, expect: false, Backbone:true, $:true*/
"use strict";

jest.dontMock("stores/FieldTypeStore");

$ = require("jquery");

Backbone = require("backbone");
Backbone.$ = $;

describe("FieldTypeStore", function() {

	var FieldTypeStore = require("stores/FieldTypeStore");
	var FieldTypeCollection = require("collections/FieldTypeCollection");

	it("initializes the store as a FieldTypeCollection", function() {
	    expect(FieldTypeStore instanceof FieldTypeCollection).toBe(true);
	});

});
