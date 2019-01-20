/*global jest:false, expect: false, Backbone:true, $:true, _:true*/
"use strict";

jest.dontMock("../BomStore.js");
jest.mock("../../dispatcher/AppDispatcher.js");
jest.mock("../FieldStore.js");
jest.mock("../SelectedBomItemStore.js");
jest.mock("../ProductStore.js");
jest.mock("../BomImportStore.js");
jest.mock("../CompanyStore.js");

require("es6-promise").polyfill();
$ = require("jquery");

Backbone = require("backbone");
Backbone.$ = $;

_ = require("underscore");

describe("BomStore", function() {

    var ApiConstants = require("../../constants/ApiConstants");
    var ActionConstants = require("../../constants/ActionConstants");

    var AppDispatcher;
    var BomStore;

    var testCompanyId = 1;

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
        AppDispatcher = require("../../dispatcher/AppDispatcher");
        BomStore = require("../BomStore");
        BomStore.setCompany(testCompanyId);
        $.ajax = jest.genMockFunction();
    });

    it("initializes with correct urlRoot", function() {
        expect(_.result(BomStore, "url")).toBe(ApiConstants.PATH_PREFIX + "/" + testCompanyId + "/bom");
    });

    it("registers a callback with the dispatcher", function() {
        expect(AppDispatcher.register.mock.calls.length).toBe(1);
    });

    it("initializes with no boms", function() {
        expect(BomStore.toJSON()).toEqual({});
    });

    it("parses collection of boms", function() {
        var options = {};
        var boms = testResponse;

        var result = BomStore.parse(boms, options);
        expect(result).toEqual(testBoms);
        expect(options.count).toBe(testBoms.length);
    });

    it("parses collection of boms with undefined response", function() {
        var options = {};
        var boms;
        var result = BomStore.parse(boms, options);
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

        var result = BomStore.parse(boms, options);
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

        var result = BomStore.parse(boms, options);
        expect(result).toEqual(testBoms);
        expect(options.count).toBe(testBoms.length);
    });

    it("parses collection of boms without embedded object", function() {
        var options = {};
        var boms = {};

        var result = BomStore.parse(boms, options);
        expect(result).toBe( boms );
        expect(options.count).toBeUndefined();
    });

    it("gets children boms of a bom", function() {
        var boms;

        BomStore.add(testBoms);
        boms = BomStore.getChildrenBomsOfBom(1);

        expect(boms.length).toEqual(2);
        expect(boms[0].id).toEqual(3);
        expect(boms[1].id).toEqual(4);
    });

    it("gets descendant boms of a bom", function() {
        var boms;

        BomStore.add(testBoms);
        boms = BomStore.getDescendantBomsOfBom(1);

        expect(boms.length).toEqual(3);
        expect(boms[0].id).toEqual(3);
        expect(boms[1].id).toEqual(4);
        expect(boms[2].id).toEqual(5);
    });

    it("gets parent boms of bom", function() {
        BomStore.add(testBoms);
        //expect( BomStore.getParentBomsOfBom(3) ).toEqual( [testBoms[0]] );
    });

    it("gets no parent boms of a root bom", function() {
        BomStore.add(testBoms);
        expect(BomStore.getParentBomsOfBom(1)).toEqual([]);
    });

    it("checks if a bom is parent of a bom", function() {
        BomStore.add(testBoms);
        expect(BomStore.isBomParentOfBom(1, 3)).toBe(true);
    });

    it("checks if a bom is not parent of a bom", function() {
        BomStore.add(testBoms);
        expect(BomStore.isBomParentOfBom(1, 2)).toBe(false);
    });

    it("checks if a bom is not parent of a bom that is not a direct child bom", function() {
        BomStore.add(testBoms);
        expect(BomStore.isBomParentOfBom(1, 5)).toBe(false);
    });

    // pit("fetches all boms", function() {
    //     var callback = AppDispatcher.register.mock.calls[0][0];

    //     return new Promise(function(resolve, reject) {
    //         var payload = {
    //             source: "VIEW_ACTION",
    //             action: {
    //                 type: ActionConstants.FETCH_ALL_BOMS,
    //                 resolve: resolve,
    //                 reject: reject
    //             }
    //         };
    //         callback(payload);

    //         //make sure $.ajax is called with expected values
    //         expect($.ajax).toBeCalledWith({
    //             dataType: "json",
    //             emulateHTTP: false,
    //             emulateJSON: false,
    //             error: jasmine.any(Function),
    //             parse: true,
    //             success: jasmine.any(Function),
    //             type: "GET",
    //             url: ApiConstants.PATH_PREFIX + "/" + testCompanyId + "/bom"
    //         });

    //         //emulate success callback
    //         $.ajax.mock.calls[0][0].success(testResponse);

    //     }).then(function(result) {

    //         expect(BomStore.toJSON().length).toEqual(testBoms.length);

    //     }, function(error) {

    //         expect(error).not.toBeDefined();

    //     });
    // });

    it("creates a bom", function() {
        var callback = AppDispatcher.register.mock.calls[0][0];
        var bom;

        BomStore.add(testBoms);

        var payload = {
            source: "VIEW_ACTION",
            action: {
                type: ActionConstants.CREATE_BOM,
                attributes: {
                    name: "Test Bom",
                    productId: 2
                }
            }
        };
        callback(payload);

        bom = BomStore.last();

        expect(BomStore.toJSON().length).toBe(testBoms.length + 1);
        expect(bom.get("name")).toEqual("Test Bom");

        expect(payload.action.result.bom).toBeDefined();
    });

    it("updates the name of a bom", function() {
        var callback = AppDispatcher.register.mock.calls[0][0];
        BomStore.add(testBoms);

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

        expect(BomStore.get(testBoms[0].id).get("name")).toBe("New Bom");
        expect(payload.action.result.bom).toBeDefined();
    });

    it("destroys a bom", function() {
        var callback = AppDispatcher.register.mock.calls[0][0];
        BomStore.add(testBoms);

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

        expect(BomStore.toJSON().length).toBe(3);
        expect(BomStore.get(1).get("bomIds")).toEqual([3]);
        expect(payload.action.result.bom).toBeDefined();
    });

    it("adds a blank item", function() {
        var callback = AppDispatcher.register.mock.calls[0][0];
        var bom;

        BomStore.add(testBoms);

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

        bom = BomStore.get(1);

        expect(bom.getItems().length).toBe(3);
        expect(bom.getItems().last().cid).toBeDefined();
    });

    it("removes items from a bom", function() {
        var callback = AppDispatcher.register.mock.calls[0][0];
        var bom;

        BomStore.add(testBoms);

        var payload = {
            source: "VIEW_ACTION",
            action: {
                type: ActionConstants.REMOVE_BOM_ITEMS,
                attributes: {
                    bomId: 1,
                    items: [1]
                }
            }
        };
        callback(payload);

        bom = BomStore.get(1);

        expect(bom.getItems().length).toBe(1);
        expect(bom.getItems().last().id).toEqual(2);
        expect(payload.action.result.items[0].id).toBe(1);
    });

    it("updates a bom item for an existing column with a string value", function() {
        var callback = AppDispatcher.register.mock.calls[0][0];
        var bom;

        BomStore.add(testBoms);

        bom = BomStore.get(1);

        var payload = {
            source: "VIEW_ACTION",
            action: {
                type: ActionConstants.UPDATE_BOM_ITEM,
                attributes: {
                    bomId: 1,
                    itemId: 2,
                    attribute: {
                        id: 100,
                        fieldId: 1000
                    },
                    content: "New Value"
                }
            }
        };
        callback(payload);

        bom = BomStore.get(1);

        expect(bom.getItems().get(2).getValues().length).toBe(1);

        expect(payload.action.result.bom).toBeDefined();
        expect(payload.action.result.value).toBeDefined();
        expect(payload.action.result.value.get("content")).toBe("New Value");
    });

    it("updates a bom item for an existing column with a number value", function() {
        var callback = AppDispatcher.register.mock.calls[0][0];
        var bom;

        BomStore.add(testBoms);

        var payload = {
            source: "VIEW_ACTION",
            action: {
                type: ActionConstants.UPDATE_BOM_ITEM,
                attributes: {
                    bomId: 1,
                    itemId: 2,
                    attribute: {
                        id: 100,
                        fieldId: 1000
                    },
                    content: 1
                }
            }
        };
        callback(payload);

        bom = BomStore.get(1);

        expect(bom.getItems().get(2).getValues().length).toBe(1);

        expect(payload.action.result.bom).toBeDefined();
        expect(payload.action.result.value).toBeDefined();
        expect(payload.action.result.value.get("content")).toBe(1);
    });

    it("updates a bom item for an existing column with an empty value", function() {
        var callback = AppDispatcher.register.mock.calls[0][0];
        var bom;

        BomStore.add(testBoms);

        var payload = {
            source: "VIEW_ACTION",
            action: {
                type: ActionConstants.UPDATE_BOM_ITEM,
                attributes: {
                    bomId: 1,
                    itemId: 2,
                    attribute: {
                        id: 100,
                        fieldId: 1000
                    },
                    content: undefined
                }
            }
        };
        callback(payload);

        bom = BomStore.get(1);

        expect(bom.getItems().get(2).getValues().length).toBe(0);
        expect(payload.action.result.bom).toBeDefined();
        expect(payload.action.result.value).toBeDefined();
    });

    it("updates a bom item for given a field for which the bom already has a matching column", function() {
        var callback = AppDispatcher.register.mock.calls[0][0];
        var bom;

        BomStore.add(testBoms);

        var payload = {
            source: "VIEW_ACTION",
            action: {
                type: ActionConstants.UPDATE_BOM_ITEM,
                attributes: {
                    bomId: 1,
                    itemId: 2,
                    attribute: {
                        id: undefined,
                        fieldId: 1000
                    },
                    content: "New Value"
                }
            }
        };
        callback(payload);

        bom = BomStore.get(1);

        expect(bom.getItems().get(2).getValues().length).toBe(1);

        expect(payload.action.result.bom).toBeDefined();
        expect(payload.action.result.value).toBeDefined();
        expect(payload.action.result.value.get("content")).toBe("New Value");
    });

    it("updates a bom item for field for which the bom has no column", function() {
        var callback = AppDispatcher.register.mock.calls[0][0];
        var bom;

        BomStore.add(testBoms);

        var payload = {
            source: "VIEW_ACTION",
            action: {
                type: ActionConstants.UPDATE_BOM_ITEM,
                attributes: {
                    bomId: 1,
                    itemId: 2,
                    attribute: {
                        id: undefined,
                        fieldId: 1001,
                        name: "New Field"
                    },
                    content: "New Value"
                }
            }
        };
        callback(payload);

        bom = BomStore.get(1);

        expect(bom.getItems().get(2).getValues().length).toBe(2);

        expect(bom.getAttributes().length).toBe(2);
        expect(bom.getAttributes().last().get("name")).toBe("New Field");

        expect(payload.action.result.bom).toBeDefined();
        expect(payload.action.result.value).toBeDefined();
        expect(payload.action.result.value.get("content")).toBe("New Value");
    });

    it("creates a root bom when creating a product", function() {
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

        expect(BomStore.toJSON().length).toBe(1);
        expect(payload.action.result.bom).toBeDefined();
    });

    it("destroys descendant boms of a product when destroying the product", function() {
        var callback = AppDispatcher.register.mock.calls[0][0];

        BomStore.push(testBoms);

        var payload = {
            source: "VIEW_ACTION",
            action: {
                type: ActionConstants.DESTROY_PRODUCT,
                attributes: {
                    id: 0
                },
                result: {
                    product: {
                        getBoms: function() {
                            return [1];
                        }
                    }
                }
            }
        };
        callback(payload);

        expect(BomStore.toJSON().length).toBe(1);
        expect(BomStore.first().id).toBe(2);
    });

});
