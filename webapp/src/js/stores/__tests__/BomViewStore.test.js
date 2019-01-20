/*global jest:false, expect: false, Backbone:true, $:true*/
"use strict";

jest.dontMock("stores/BomViewStore");

$ = require("jquery");

Backbone = require("backbone");
Backbone.$ = $;

describe("BomViewStore", function() {

	var BomViewStore = require("stores/BomViewStore");
	var BomViewCollection = require("collections/BomViewCollection");

	it("initializes the store as a BomViewCollection", function() {
	    expect(BomViewStore instanceof BomViewCollection).toBe(true);
	});

});
