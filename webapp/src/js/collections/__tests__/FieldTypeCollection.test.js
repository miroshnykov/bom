/*global jest:false, expect: false, Backbone:true, $:true, _:true*/
"use strict";

jest.dontMock("collections/FieldTypeCollection");
jest.dontMock("models/FieldTypeModel");

require("es6-promise").polyfill();
$ = require("jquery");

Backbone = require("backbone");
Backbone.$ = $;

_ = require("underscore");

describe("FieldTypeCollection", function() {
  var ApiConstants = require("constants/ApiConstants");
  var AppDispatcher = require("dispatcher/AppDispatcher");
  AppDispatcher.register = jest.genMockFunction();
  var FieldTypeCollection;

  beforeEach(function() {
    AppDispatcher.register.mockClear();
    FieldTypeCollection = new (require("collections/FieldTypeCollection"))();
    $.ajax = jest.genMockFunction();
  });

  it("initializes with correct urlRoot", function() {
    expect(FieldTypeCollection.url).toBe(ApiConstants.PATH_PREFIX + "/fieldtype");
  });

  xit("registers a callback with the dispatcher", function() {
    expect(AppDispatcher.register.mock.calls.length).toBe(1);
  });

  it("initializes with no fieldtype", function() {
    expect( FieldTypeCollection.toJSON() ).toEqual({});
  });

  it("parses collection of fieldtypes with undefined response", function() {
    var options = {};
    var fieldtypes;
    var result = FieldTypeCollection.parse(fieldtypes, options);
    expect( result ).toBeUndefined();
    expect( options ).toEqual( {} );
  });

  it("parses collection of fieldtypes without embedded object", function() {
    var options = {};
    var fieldtypes = {};

    var result = FieldTypeCollection.parse(fieldtypes, options);
    expect( result ).toBe( fieldtypes );
    expect( options.count ).toBeUndefined();
  });
});
