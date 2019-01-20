/*global jest:false, expect: false, Backbone:true, $:true, _:true*/
"use strict";

jest.dontMock("collections/BomCollection");

require("es6-promise").polyfill();
$ = require("jquery");

Backbone = require("backbone");
Backbone.$ = $;

_ = require("underscore");

xdescribe("BomCollection", function() {

    var ApiConstants = require("constants/ApiConstants");
    var ActionConstants = require("constants/ActionConstants");

    var AppDispatcher = require("dispatcher/AppDispatcher");
    AppDispatcher.register = jest.genMockFunction();

    var BomCollection;

    var testBoms = [{
        id: 1,
        name: "Bom #1",
        attributes: [{
            id: 100,
            fieldId: 1000,
            name: "Column #1"
        }],
        bomIds: [3, 4],
        items: [{
            id: 1,
            values: []
        }, {
            id: 2,
            values: [{
                id: 10,
                bomFieldId: 100,
                content: "Test Value"
            }]
        }]
    }, {
        id: 2,
        name: "Bom #2"
    }, {
        id: 3,
        name: "Child Bom #1 of #1"
    }, {
        id: 4,
        name: "Child Bom #2 of #1",
        bomIds: [5]
    }, {
        id: 5,
        name: "Child Bom #1 of #4"
    }];

    var testResponse = {
        "total_items": testBoms.length,
        "_embedded": {
            "bom": testBoms
        }
    };

    beforeEach(function() {
        AppDispatcher.register.mockClear();
        BomCollection = new (require("collections/BomCollection"))();
        $.ajax = jest.genMockFunction();
    });

    it("initializes with correct urlRoot", function() {
        expect(_.result(BomCollection, "url")).toBe(ApiConstants.PATH_PREFIX + "/bom");
    });

    it("registers a callback with the dispatcher", function() {
        expect(AppDispatcher.register.mock.calls.length).toBe(1);
    });

    it("initializes with no boms", function() {
        expect(BomCollection.toJSON()).toEqual({});
    });

    it("parses collection of boms", function() {
        var options = {};
        var boms = testResponse;

        var result = BomCollection.parse(boms, options);
        expect(result).toEqual(testBoms);
        expect(options.count).toBe(testBoms.length);
    });

    it("parses collection of boms with undefined response", function() {
        var options = {};
        var boms;
        var result = BomCollection.parse(boms, options);
        expect(result).toBeUndefined();
        expect(options).toEqual({});
    });

    it("parses collection of boms without count", function() {
        var options = {};
        var boms = {
            // "count": undefined,
            "total": testBoms.length,
            "_embedded": {
                "bom": testBoms
            }
        };

        var result = BomCollection.parse(boms, options);
        expect(result).toEqual(testBoms);
        expect(options.count).toBe(testBoms.length);
    });

    it("parses collection of boms without total", function() {
        var options = {};
        var boms = {
            "count": testBoms.length,
            //"total": undefined,
            "_embedded": {
                "bom": testBoms
            }
        };

        var result = BomCollection.parse(boms, options);
        expect(result).toEqual(testBoms);
        expect(options.count).toBe(testBoms.length);
    });

    it("parses collection of boms without embedded object", function() {
        var options = {};
        var boms = {};

        var result = BomCollection.parse(boms, options);
        expect(result).toBe( boms );
        expect(options.count).toBeUndefined();
    });

    it("gets children boms of a bom", function() {
        var boms;

        BomCollection.add(testBoms);
        boms = BomCollection.getChildrenBomsOfBom(1);

        expect(boms.length).toEqual(2);
        expect(boms[0].id).toEqual(3);
        expect(boms[1].id).toEqual(4);
    });

    it("gets descendant boms of a bom", function() {
        var boms;

        BomCollection.add(testBoms);
        boms = BomCollection.getDescendantBomsOfBom(1);

        expect(boms.length).toEqual(3);
        expect(boms[0].id).toEqual(3);
        expect(boms[1].id).toEqual(4);
        expect(boms[2].id).toEqual(5);
    });

    it("gets parent boms of bom", function() {
        BomCollection.add(testBoms);
        //expect( BomCollection.getParentBomsOfBom(3) ).toEqual( [testBoms[0]] );
    });

    it("gets no parent boms of a root bom", function() {
        BomCollection.add(testBoms);
        expect(BomCollection.getParentBomsOfBom(1)).toEqual([]);
    });

    it("checks if a bom is parent of a bom", function() {
        BomCollection.add(testBoms);
        expect(BomCollection.isBomParentOfBom(1, 3)).toBe(true);
    });

    it("checks if a bom is not parent of a bom", function() {
        BomCollection.add(testBoms);
        expect(BomCollection.isBomParentOfBom(1, 2)).toBe(false);
    });

    it("checks if a bom is not parent of a bom that is not a direct child bom", function() {
        BomCollection.add(testBoms);
        expect(BomCollection.isBomParentOfBom(1, 5)).toBe(false);
    });

    it("updates the name of a bom", function() {
        var callback = AppDispatcher.register.mock.calls[0][0];
        BomCollection.add(testBoms);

        var payload = {
            source: "VIEW_ACTION",
            action: {
                type: ActionConstants.UPDATE_BOM_NAME,
                attributes: {
                    id: testBoms[0].id,
                    name: "New Bom"
                }
            }
        };
        callback(payload);

        expect(BomCollection.get(testBoms[0].id).get("name")).toBe("New Bom");
        expect(payload.action.result.bom).toBeDefined();
    });

    it("destroys a bom", function() {
        var callback = AppDispatcher.register.mock.calls[0][0];
        BomCollection.add(testBoms);

        var payload = {
            source: "VIEW_ACTION",
            action: {
                type: ActionConstants.DESTROY_BOM,
                attributes: {
                    bomId: 4
                }
            }
        };
        callback(payload);

        expect(BomCollection.toJSON().length).toBe(3);
        expect(BomCollection.get(1).get("bomIds")).toEqual([3]);
        expect(payload.action.result.bom).toBeDefined();
    });

    it("adds a blank item", function() {
        var callback = AppDispatcher.register.mock.calls[0][0];
        var bom;

        BomCollection.add(testBoms);

        var payload = {
            source: "VIEW_ACTION",
            action: {
                type: ActionConstants.ADD_BOM_ITEM,
                attributes: {
                    bomId: 1
                }
            }
        };
        callback(payload);

        bom = BomCollection.get(1);

        expect(bom.getItems().length).toBe(3);
        expect(bom.getItems().last().cid).toBeDefined();
    });

    xit("creates a root bom when creating a product", function() {
        var callback = AppDispatcher.register.mock.calls[0][0];

        var payload = {
            source: "VIEW_ACTION",
            action: {
                type: ActionConstants.CREATE_PRODUCT,
                attributes: {
                    name: "Test Product"
                }
            }
        };
        callback(payload);

        expect(BomCollection.toJSON().length).toBe(1);
        expect(payload.action.result.bom).toBeDefined();
    });

});
