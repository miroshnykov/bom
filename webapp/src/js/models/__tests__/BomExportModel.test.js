/*global jest:false, expect: false, Backbone:true, _:true*/
"use strict";

jest.dontMock("models/BomExportModel");

Backbone = require("backbone");
_ = require("underscore");

describe("BomExportModel", function() {
  var BomExportModel = require("models/BomExportModel");
  var ApiConstants = require("constants/ApiConstants");
  var bomExport;

  beforeEach(function() {
    bomExport = new BomExportModel( {id: 1} );
  });

  it("initializes the correct urlRoot", function() {
    expect( _.result(bomExport, "url") ).toBe( ApiConstants.PATH_PREFIX + "/export/bom/1" );
  });
});
