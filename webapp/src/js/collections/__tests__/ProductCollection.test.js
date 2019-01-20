/*global jest:false, expect: false, Backbone:true, $:true, _:true*/
"use strict";

jest.dontMock("collections/ProductCollection");
jest.dontMock("models/ProductModel");

require("es6-promise").polyfill();
$ = require("jquery");

Backbone = require("backbone");
Backbone.$ = $;

_ = require("underscore");

xdescribe("ProductCollection", function() {

  var ApiConstants = require("constants/ApiConstants");
  var ActionConstants = require("constants/ActionConstants");

  var AppDispatcher = require("dispatcher/AppDispatcher");
  AppDispatcher.register = jest.genMockFunction();

  var ProductCollection;

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
    AppDispatcher.register.mockClear();

    ProductCollection = new (require("collections/ProductCollection"))();
    $.ajax = jest.genMockFunction();
  });

  it("initializes with correct urlRoot", function() {
    expect(_.result(ProductCollection, "url")).toBe(ApiConstants.PATH_PREFIX + "/product");
  });

  it("registers a callback with the dispatcher", function() {
    expect(AppDispatcher.register.mock.calls.length).toBe(1);
  });

  it("initializes with no product", function() {
    expect( ProductCollection.toJSON() ).toEqual({});
  });

  it("parses collection of product", function() {
    var options = {};
    var products = testResponse;

    var result = ProductCollection.parse(products, options);
    expect( result ).toEqual(testProducts);
    expect( options.count ).toBe(testProducts.length);
  });

  it("parses collection of product with undefined response", function() {
    var options = {};
    var products;
    var result = ProductCollection.parse(products, options);
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

    var result = ProductCollection.parse(products, options);
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

    var result = ProductCollection.parse(products, options);
    expect( result ).toEqual(testProducts);
    expect( options.count ).toBe(testProducts.length);
  });

  it("parses collection of product without embedded object", function() {
    var options = {};
    var products = {};

    var result = ProductCollection.parse(products, options);
    expect( result ).toBe( products );
    expect( options.count ).toBeUndefined();
  });

  it("creates a product", function() {
    var callback = AppDispatcher.register.mock.calls[0][0];

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

    expect( ProductCollection.last().toJSON() ).toEqual({
      name: "Test Product",
      bomIds: ["t1"]
    });

    expect( payload.action.result.bom ).toBeDefined();
    expect( payload.action.result.product.toJSON() ).toEqual({
      name: "Test Product",
      bomIds: ["t1"]
    });
  });

  it("updates a product's name", function() {
    var callback = AppDispatcher.register.mock.calls[0][0];

    ProductCollection.push( testProducts );
    expect(ProductCollection.length).toBe( testProducts.length );

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

    expect( ProductCollection.get( testProducts[0].id ).get("name") ).toBe("New Product");
    expect( payload.action.result.product.toJSON() ).toEqual({
      id: testProducts[0].id,
      name: "New Product",
      bomIds: []
    });
  });

});
