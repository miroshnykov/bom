/*global jest:false, expect: false, Backbone:true, $:true*/
"use strict";

jest.dontMock("stores/ChangeStore");

$ = require("jquery");

Backbone = require("backbone");
Backbone.$ = $;

describe("ChangeStore", function() {

	var ChangeStore = require("stores/ChangeStore");
	var ChangeCollection = require("collections/ChangeCollection");

	it("initializes the store as a ChangeCollection", function() {
	    expect(ChangeStore instanceof ChangeCollection).toBe(true);
	});

});
