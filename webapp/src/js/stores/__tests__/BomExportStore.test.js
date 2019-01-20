/*global jest:false, expect: false, Backbone:true, $:true*/
"use strict";

jest.dontMock("stores/BomExportStore");

$ = require("jquery");

Backbone = require("backbone");
Backbone.$ = $;

describe("BomExportStore", function() {

    var BomExportStore = require("stores/BomExportStore");
    var BomExportCollection = require("collections/BomExportCollection");

    it("initializes the store as a BomExportCollection", function() {
        expect(BomExportStore instanceof BomExportCollection).toBe(true);
    });

});
