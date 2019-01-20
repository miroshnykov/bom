/*global jest:false, expect: false, Backbone:true, $:true, _:true*/
"use strict";

jest.dontMock("../FieldTypeStore.js");
jest.dontMock("../../models/FieldTypeModel.js");
jest.dontMock("../../constants/ApiConstants.js");
jest.dontMock("../../constants/ActionConstants.js");
jest.mock("../../dispatcher/AppDispatcher.js");
jest.mock("../CompanyStore.js");

require("es6-promise").polyfill();
$ = require("jquery");

Backbone = require("backbone");
Backbone.$ = $;

_ = require("underscore");

describe("FieldTypeStore", function() {
  var ApiConstants = require("../../constants/ApiConstants");

  var AppDispatcher;
  var FieldTypeStore;

  var testFieldTypes = [
    {
      id: 1,
      name: "Type #1"
    },
    {
      id: 2,
      name: "Type #2",
    }];

  beforeEach(function() {
    AppDispatcher = require("../../dispatcher/AppDispatcher");
    FieldTypeStore = require("../FieldTypeStore");
    $.ajax = jest.genMockFunction();
  });

  it("initializes with correct urlRoot", function() {
    expect(FieldTypeStore.url).toBe(ApiConstants.PATH_PREFIX + "/fieldtype");
  });

  it("registers a callback with the dispatcher", function() {
    expect(AppDispatcher.register.mock.calls.length).toBe(1);
  });

  it("initializes with no fieldtype", function() {
    expect( FieldTypeStore.toJSON() ).toEqual({});
  });

  it("parses collection of fieldtypes with undefined response", function() {
    var options = {};
    var fieldtypes;
    var result = FieldTypeStore.parse(fieldtypes, options);
    expect( result ).toBeUndefined();
    expect( options ).toEqual( {} );
  });

  it("parses collection of fieldtypes without total_items", function() {
    var options = {};
    var fieldtypes = {
      // "total_items": undefined,
      "_embedded": {
        "fieldtype": testFieldTypes
      }
    };

    var result = FieldTypeStore.parse(fieldtypes, options);
    expect( result ).toEqual(testFieldTypes);
    expect( options.count ).toBe(testFieldTypes.length);
  });

  it("parses collection of fieldtypes without embedded object", function() {
    var options = {};
    var fieldtypes = {};

    var result = FieldTypeStore.parse(fieldtypes, options);
    expect( result ).toBe( fieldtypes );
    expect( options.count ).toBeUndefined();
  });

  // pit("fetches fieldtypes from the server with a promise", function() {
  //   var callback = AppDispatcher.register.mock.calls[0][0];

  //   return new Promise(function(resolve, reject) {
  //     var payload = {
  //       source: "VIEW_ACTION",
  //       action: {
  //         type: ActionConstants.FETCH_ALL_FIELDTYPES,
  //         resolve: resolve,
  //         reject: reject
  //       }
  //     };
  //     callback(payload);

  //     //make sure $.ajax is called with expected values
  //     expect($.ajax).toBeCalledWith({
  //       dataType: "json",
  //       emulateHTTP: false,
  //       emulateJSON: false,
  //       error: jasmine.any(Function),
  //       parse: true,
  //       success: jasmine.any(Function),
  //       type: "GET",
  //       url: ApiConstants.PATH_PREFIX + "/fieldtype"
  //     });

  //     //emulate success callback
  //     $.ajax.mock.calls[0][0].success( testResponse );

  //   }).then(function(result) {

  //     expect( FieldTypeStore.toJSON() ).toEqual( testFieldTypes );

  //   }, function(error) {

  //     expect(error).not.toBeDefined();

  //   });
  // });
});
