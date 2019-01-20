jest.dontMock("../ProductModel.js");
jest.dontMock("../BomModel.js");

Backbone = require("backbone");
_ = require("underscore");

describe("ProductModel", function() {
    var ProductModel = require('../ProductModel');
    var ApiConstants = require('../../constants/ApiConstants');
    var product;

    var testCompanyId = 1;

    beforeEach(function() {
        product = new ProductModel({
            id: 1,
            name: "Test Product",
            bomId: 2,
            companyId: testCompanyId});
    });

    it("initializes the correct urlRoot", function() {
        expect(_.result(product, 'url')).toBe(ApiConstants.PATH_PREFIX + "/" + testCompanyId + "/product/1");
    });

    it("gets the correct root Bom object", function() {
        expect(product.get("bomId")).toBe(2);
    });

});
