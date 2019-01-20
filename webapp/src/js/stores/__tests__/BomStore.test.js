/*global jest:false, expect: false, Backbone:true, $:true*/
"use strict";

jest.dontMock("stores/BomStore");

$ = require("jquery");

Backbone = require("backbone");
Backbone.$ = $;

describe("BomStore", function() {

	var BomStore = require("stores/BomStore");
	var BomCollection = require("collections/BomCollection");

	it("initializes the store as a BomCollection", function() {
	    expect(BomStore instanceof BomCollection).toBe(true);
	});

});
