jest.dontMock("../FieldStore.js");
jest.dontMock("../../models/FieldModel.js");
jest.dontMock("../../constants/ApiConstants.js");
jest.dontMock("../../constants/ActionConstants.js");
jest.mock("../../dispatcher/AppDispatcher.js");
jest.mock("../CompanyStore.js");

require("es6-promise").polyfill();
jQuery = $ = require("jquery");

Backbone = require("backbone");
Backbone.$ = $;

_ = require("underscore");

describe("FieldStore", function() {
    var ApiConstants = require('../../constants/ApiConstants');
    var ActionConstants = require('../../constants/ActionConstants');

    var AppDispatcher;
    var FieldStore;
    var callback;

    var testCompanyId = 1;

    var testFields = [{
        id: 1,
        name: "Field #1",
        typeId: 1
    }, {
        id: 2,
        name: "Field #2",
        typeId: 2
    }];

    var testResponse = {
        "total_items": testFields.length,
        "_embedded": {
            "field": testFields
        }
    };

    beforeEach(function() {
        AppDispatcher = require("../../dispatcher/AppDispatcher");
        FieldStore = require("../FieldStore");
        FieldStore.setCompany(testCompanyId);
        $.ajax = jest.genMockFunction();
    });

    it("initializes with correct urlRoot", function() {
        expect(_.result(FieldStore, 'url')).toBe(ApiConstants.PATH_PREFIX + "/" + testCompanyId +"/field");
    });

    it("registers a callback with the dispatcher", function() {
        expect(AppDispatcher.register.mock.calls.length).toBe(1);
    });

    it("initializes with no field", function() {
        expect(FieldStore.toJSON()).toEqual({});
    });

    it("parses collection of fields with undefined response", function() {
        var options = {};
        var fields = undefined;
        var result = FieldStore.parse(fields, options);
        expect(result).toBeUndefined();
        expect(options).toEqual({});
    });

    it("parses collection of fields without total_items", function() {
        var options = {};
        var fields = {
            // "total_items": undefined,
            "_embedded": {
                "field": testFields
            }
        };

        var result = FieldStore.parse(fields, options);
        expect(result).toEqual(testFields);
        expect(options.count).toBe(testFields.length);
    });

    it("parses collection of fields without embedded object", function() {
        var options = {};
        var fields = {};

        var result = FieldStore.parse(fields, options);
        expect(result).toBe( fields );
        expect(options.count).toBeUndefined();
    });

    // pit("fetches fields from the server with a promise", function() {
    //     var callback = AppDispatcher.register.mock.calls[0][0];

    //     return new Promise(function(resolve, reject) {
    //         var payload = {
    //             source: "VIEW_ACTION",
    //             action: {
    //                 type: ActionConstants.FETCH_ALL_FIELDS,
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
    //             url: ApiConstants.PATH_PREFIX + "/" + testCompanyId + "/field"
    //         });

    //         //emulate success callback
    //         $.ajax.mock.calls[0][0].success(testResponse);

    //     }).then(function(result) {

    //         expect(FieldStore.toJSON()).toEqual(testFields);

    //     }, function(error) {

    //         expect(error).not.toBeDefined();

    //     });
    // });

    it("creates custom fields when setting visible columns of a bom", function() {
        var callback = AppDispatcher.register.mock.calls[0][0];
        var field;

        var payload = {
            source: "VIEW_ACTION",
            action: {
                type: ActionConstants.SET_VISIBLE_BOM_COLUMNS,
                attributes: {
                    bomId: 1,
                    columns: [1, 2, {
                        typeId: 1,
                        name: "New Field"
                    }]
                }
            }
        };
        callback(payload);

        expect(FieldStore.last().toJSON()).toEqual({
            typeId: 1,
            name: "New Field"
        });

        expect(payload.action.result.columns).toBeDefined();
        expect(payload.action.result.columns[2].fieldId).toBeDefined();
        expect(payload.action.result.columns[2].name).toBe("New Field");
    });

    it("maintains column id when setting existing visible columns of a bom", function() {
        var callback = AppDispatcher.register.mock.calls[0][0];
        var field;

        var payload = {
            source: "VIEW_ACTION",
            action: {
                type: ActionConstants.SET_VISIBLE_BOM_COLUMNS,
                attributes: {
                    bomId: 1,
                    columns: [1, 2, {
                        fieldId: 1,
                        name: "New Column"
                    }]
                }
            }
        };
        callback(payload);

        expect(payload.action.result.columns).toEqual([1, 2, {
            fieldId: 1,
            name: "New Column"
        }]);
    });
});
