jest.dontMock("../FieldModel.js");

Backbone = require("backbone");
_ = require("underscore");

describe("FieldModel", function() {
  var FieldModel = require('../FieldModel');
  var ApiConstants = require('../../constants/ApiConstants');
  var field;

  var testCompanyId = 1;

  beforeEach(function() {
    field = new FieldModel({
      id: 1,
      name: "Test Field"});

    field.setCompany(testCompanyId);
  });

  it("initializes the correct urlRoot", function() {
    expect(_.result(field, 'url')).toBe(ApiConstants.PATH_PREFIX + "/" + testCompanyId + "/field/1");
  });
});
