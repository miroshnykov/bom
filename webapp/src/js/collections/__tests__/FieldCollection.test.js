/*global jest:false, expect: false, Backbone:true, $:true, _:true*/
"use strict";

jest.dontMock("collections/FieldCollection");
jest.dontMock("models/FieldModel");

require("es6-promise").polyfill();
$ = require("jquery");

Backbone = require("backbone");
Backbone.$ = $;

_ = require("underscore");

describe("FieldCollection", function() {
    var ApiConstants = require("constants/ApiConstants");
    var ActionConstants = require("constants/ActionConstants");

    var AppDispatcher = require("dispatcher/AppDispatcher");
    AppDispatcher.register = jest.genMockFunction();

    var FieldCollection;

    beforeEach(function() {
        AppDispatcher.register.mockClear();
        FieldCollection = new (require("collections/FieldCollection"))();
        $.ajax = jest.genMockFunction();
    });

    it("initializes with correct urlRoot", function() {
        expect(_.result(FieldCollection, "url")).toBe(ApiConstants.PATH_PREFIX + "/field");
    });

    xit("registers a callback with the dispatcher", function() {
        expect(AppDispatcher.register.mock.calls.length).toBe(1);
    });

    it("initializes with no field", function() {
        expect(FieldCollection.toJSON()).toEqual({});
    });

    it("parses collection of fields with undefined response", function() {
        var options = {};
        var fields;
        var result = FieldCollection.parse(fields, options);
        expect(result).toBeUndefined();
        expect(options).toEqual({});
    });

    it("parses collection of fields without embedded object", function() {
        var options = {};
        var fields = {};

        var result = FieldCollection.parse(fields, options);
        expect(result).toBe( fields );
        expect(options.count).toBeUndefined();
    });

    xit("creates custom fields when setting visible columns of a bom", function() {
        var callback = AppDispatcher.register.mock.calls[0][0];

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

        expect(FieldCollection.last().toJSON()).toEqual({
            typeId: 1,
            name: "New Field"
        });

        expect(payload.action.result.columns).toBeDefined();
        expect(payload.action.result.columns[2].fieldId).toBeDefined();
        expect(payload.action.result.columns[2].name).toBe("New Field");
    });

    xit("maintains column id when setting existing visible columns of a bom", function() {
        var callback = AppDispatcher.register.mock.calls[0][0];

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
