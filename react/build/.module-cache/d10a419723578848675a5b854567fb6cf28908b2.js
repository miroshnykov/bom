jest.dontMock("../ProductStore.js");
jest.dontMock("../../models/ProductModel.js");
jest.dontMock("../../constants/ApiConstants.js");
jest.dontMock("../../constants/ActionConstants.js");
jest.mock("../../dispatcher/AppDispatcher.js");
jest.mock("../BomStore.js");

require("es6-promise").polyfill();
jQuery = $ = require("jquery");

Backbone = require("backbone");
Backbone.$ = $;

_ = require("underscore");

describe("ProductStore", function() {

  var ApiConstants = require('../../constants/ApiConstants');
  var ActionConstants = require('../../constants/ActionConstants');

  var AppDispatcher;
  var ProductStore;
  var callback;

  var testCompanyId = 1;

  var testProducts = [
    {
      id: 1,
      name: "Product #1",
      bomIds: []
    },
    {
      id: 2,
      name: "Product #2",
      bomIds: []
    }];

  var testResponse = {
    "total_items": testProducts.length,
    "_embedded": {
      "product": testProducts
    }
  };

  beforeEach(function() {
    AppDispatcher = require("../../dispatcher/AppDispatcher");
    ProductStore = require("../ProductStore");
    ProductStore.setCompany(testCompanyId);
    $.ajax = jest.genMockFunction();
  });

  it("initializes with correct urlRoot", function() {
    expect(_.result(ProductStore, "url")).toBe(ApiConstants.PATH_PREFIX + "/" + testCompanyId + "/product");
  });

  it("registers a callback with the dispatcher", function() {
    expect(AppDispatcher.register.mock.calls.length).toBe(1);
  });

  it("initializes with no product", function() {
    expect( ProductStore.toJSON() ).toEqual({});
  });

  it("parses collection of product", function() {
    var options = {};
    var products = testResponse;

    var result = ProductStore.parse(products, options);
    expect( result ).toEqual(testProducts);
    expect( options.count ).toBe(testProducts.length);
  });

  it("parses collection of product with undefined response", function() {
    var options = {};
    var products = undefined;
    var result = ProductStore.parse(products, options);
    expect( result ).toBeUndefined();
    expect( options ).toEqual({});
  });

  it("parses collection of product without count", function() {
    var options = {};
    var products = {
      // "count": undefined,
      "total": testProducts.length,
      "_embedded": {
        "product": testProducts
      }
    };

    var result = ProductStore.parse(products, options);
    expect( result ).toEqual(testProducts);
    expect( options.count ).toBe(testProducts.length);
  });

  it("parses collection of product without total", function() {
    var options = {};
    var products = {
      "count": testProducts.length,
      //"total": undefined,
      "_embedded": {
        "product": testProducts
      }
    };

    var result = ProductStore.parse(products, options);
    expect( result ).toEqual(testProducts);
    expect( options.count ).toBe(testProducts.length);
  });

  it("parses collection of product without embedded object", function() {
    var options = {};
    var products = {};

    var result = ProductStore.parse(products, options);
    expect( result ).toBeUndefined();
    expect( options.count ).toBeUndefined();
  });

  pit("fetches products from the server with a promise", function() {
    var callback = AppDispatcher.register.mock.calls[0][0];

    return new Promise(function(resolve, reject) {
      var payload = {
        source: "VIEW_ACTION",
        action: {
          type: ActionConstants.FETCH_ALL_PRODUCTS,
          resolve: resolve,
          reject: reject
        }
      };
      callback(payload);

      //make sure $.ajax is called with expected values
      expect($.ajax).toBeCalledWith({
        dataType: "json",
        emulateHTTP: false,
        emulateJSON: false,
        error: jasmine.any(Function),
        parse: true,
        success: jasmine.any(Function),
        type: "GET",
        url: ApiConstants.PATH_PREFIX + "/" + testCompanyId + "/product"
      });

      //emulate success callback
      $.ajax.mock.calls[0][0].success( testResponse );

    }).then(function(result) {

      expect( ProductStore.toJSON() ).toEqual( testProducts );

    }, function(error) {

      expect(error).not.toBeDefined();

    });
  });

  it("creates a product", function() {
    var callback = AppDispatcher.register.mock.calls[0][0];
    var product;

    var payload = {
      source: "VIEW_ACTION",
      action: {
        type: ActionConstants.CREATE_PRODUCT,
        attributes: {
          name: "Test Product"
        },
        result: {
          bom: {
            cid: "t1"
          }
        }
      }
    };
    callback(payload);

    expect( ProductStore.last().toJSON() ).toEqual({
      name: "Test Product",
      bomIds: ["t1"],
      position: 0
    });

    expect( payload.action.result.bom ).toBeDefined();
    expect( payload.action.result.product.toJSON() ).toEqual({
      name: "Test Product",
      bomIds: ["t1"],
      position: 0
    });
  });

  it("destroys a product", function() {
    var callback = AppDispatcher.register.mock.calls[0][0];
    var product;

    ProductStore.push( testProducts );

    var payload = {
      source: "VIEW_ACTION",
      action: {
        type: ActionConstants.DESTROY_PRODUCT,
        attributes: {
          id: testProducts[0].id
        }
      }
    };
    callback(payload);

    expect( ProductStore.toJSON() ).toEqual([ testProducts[1] ]);
    expect( payload.action.result.product.toJSON() ).toEqual( testProducts[0] );
  });

  it("updates a product's name", function() {
    var callback = AppDispatcher.register.mock.calls[0][0];
    var product;

    ProductStore.push( testProducts );
    expect(ProductStore.length).toBe( testProducts.length );

    var payload = {
      source: "VIEW_ACTION",
      action: {
        type: ActionConstants.UPDATE_PRODUCT_NAME,
        attributes: {
          id: testProducts[0].id,
          name: "New Product"
        }
      }
    };
    callback(payload);

    expect( ProductStore.get( testProducts[0].id ).get("name") ).toBe("New Product");
    expect( payload.action.result.product.toJSON() ).toEqual({
      id: testProducts[0].id,
      name: "New Product",
      bomIds: []
    });
  });

});
