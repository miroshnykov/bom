/*global jest:false, expect: false, Backbone:true, $:true*/
"use strict";

jest.dontMock("stores/ProductStore");

$ = require("jquery");

Backbone = require("backbone");
Backbone.$ = $;

describe("ProductStore", function() {

	var ProductStore = require("stores/ProductStore");
	var ProductCollection = require("collections/ProductCollection");

	it("initializes the store as a ProductCollection", function() {
	    expect(ProductStore instanceof ProductCollection).toBe(true);
	});

});
