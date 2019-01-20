/*global jest:false, expect: false, Backbone:true, _:true*/
"use strict";

jest.dontMock("models/ProductModel");
jest.dontMock("models/BomModel");

Backbone = require("backbone");
_ = require("underscore");

describe("ProductModel", function() {
    var ProductModel = require("models/ProductModel");
    var ApiConstants = require("constants/ApiConstants");
    var product;

    beforeEach(function() {
        product = new ProductModel({
            id: 1,
            name: "Test Product",
            bomIds: [2]});
    });

    it("initializes the correct urlRoot", function() {
        expect(_.result(product, "url")).toBe(ApiConstants.PATH_PREFIX + "/product/1");
    });

    it("gets the correct root Bom object", function() {
        expect(product.getBoms()).toEqual([2]);
    });

});
