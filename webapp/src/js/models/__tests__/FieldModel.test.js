/*global jest:false, expect: false, Backbone:true, _:true*/
"use strict";

jest.dontMock("models/FieldModel");

Backbone = require("backbone");
_ = require("underscore");

describe("FieldModel", function() {
  var FieldModel = require("models/FieldModel");
  var ApiConstants = require("constants/ApiConstants");
  var field;

  beforeEach(function() {
    field = new FieldModel({
      id: 1,
      name: "Test Field"});
  });

  it("initializes the correct urlRoot", function() {
    expect(_.result(field, "url")).toBe(ApiConstants.PATH_PREFIX + "/field/1");
  });
});
