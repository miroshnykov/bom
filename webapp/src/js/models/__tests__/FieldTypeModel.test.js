/*global jest:false, expect: false, Backbone:true, _:true*/
"use strict";

jest.dontMock("models/FieldTypeModel");

Backbone = require("backbone");
_ = require("underscore");

describe("FieldTypeModel", function() {
    var FieldTypeModel = require("models/FieldTypeModel");
    var ApiConstants = require("constants/ApiConstants");
    var type;

    beforeEach(function() {
        type = new FieldTypeModel({
            id: 1,
            name: "Test Type"
        });
    });

    it("initializes the correct urlRoot", function() {
        expect(type.url()).toBe(ApiConstants.PATH_PREFIX + "/fieldtype/1");
    });

    it("parses fieldtype data", function() {
        var resp = {
            id: 1,
            name: "Type #1"
        };

        expect(type.parse(resp)).toEqual({
            id: 1,
            name: "Type #1"
        });
    });
});
