jest.dontMock("../BomExportModel.js");

Backbone = require("backbone");
_ = require("underscore");

describe("BomExportModel", function() {
  var BomExportModel = require('../BomExportModel');
  var ApiConstants = require('../../constants/ApiConstants');
  var bomExport;

  var testCompanyId = 1;

  beforeEach(function() {
    bomExport = new BomExportModel({
        id: 1,
        companyId: testCompanyId});
  });

  it("initializes the correct urlRoot", function() {
    expect( _.result(bomExport, 'url') ).toBe( ApiConstants.PATH_PREFIX + "/" + testCompanyId + "/export/bom/1" );
  });
});
