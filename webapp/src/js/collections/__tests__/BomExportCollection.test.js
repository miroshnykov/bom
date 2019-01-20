/*global jest:false, expect: false, Backbone:true, $:true, _:true*/
"use strict";

jest.dontMock("collections/BomExportCollection");
jest.dontMock("models/BomExportModel");

require("es6-promise").polyfill();
$ = require("jquery");

Backbone = require("backbone");
Backbone.$ = $;

_ = require("underscore");

xdescribe("BomExportCollection", function() {
    var ApiConstants = require("constants/ApiConstants");
    var ActionConstants = require("constants/ActionConstants");

    var AppDispatcher = require("dispatcher/AppDispatcher");
    AppDispatcher.register = jest.genMockFunction();
    var BomExportCollection;

    var testExport = {
        attributes: [
            {
                name: "Attribute #1",
                fieldId: 1
            },
            {
                name: "Attribute #2",
                fieldId: 2
            }
        ],
        itemIds: [1, 2, 3]
    };

    beforeEach(function() {
        AppDispatcher.register.mockClear();

        BomExportCollection = new (require("collections/BomExportCollection"))();
        $.ajax = jest.genMockFunction();
    });

    it("initializes with correct urlRoot", function() {
        expect(_.result(BomExportCollection, "url")).toBe(ApiConstants.PATH_PREFIX + "/export/bom");
    });

    it("registers a callback with the dispatcher", function() {
        expect(AppDispatcher.register.mock.calls.length).toBe(1);
    });

    it("initializes with no field", function() {
        expect(BomExportCollection.toJSON()).toEqual({});
    });

    // Actions

    it("creates a bom export for items", function() {
        var callback = AppDispatcher.register.mock.calls[0][0];

        var payload = {
            source: "VIEW_ACTION",
            action: {
                type: ActionConstants.EXPORT_BOM_ITEMS,
                attributes: testExport
            }
        };
        callback(payload);

        expect( BomExportCollection.length ).toBe( 1 );
        expect( BomExportCollection.last().toJSON() ).toEqual( testExport );
    });

    it("creates a bom export for items and only store one", function() {
        var callback = AppDispatcher.register.mock.calls[0][0];

        var payload = {
            source: "VIEW_ACTION",
            action: {
                type: ActionConstants.EXPORT_BOM_ITEMS,
                attributes: testExport
            }
        };
        callback(payload);

        payload = {
            source: "VIEW_ACTION",
            action: {
                type: ActionConstants.EXPORT_BOM_ITEMS,
                attributes: testExport
            }
        };
        callback(payload);

        expect( BomExportCollection.length ).toBe( 1 );
        expect( BomExportCollection.last().toJSON() ).toEqual( testExport );
    });

    it("does not create a bom export for items with no attributes", function() {
        var callback = AppDispatcher.register.mock.calls[0][0];

        var payload = {
            source: "VIEW_ACTION",
            action: {
                type: ActionConstants.EXPORT_BOM_ITEMS,
                attributes: {
                    itemIds: [1, 2, 3]
                }
            }
        };
        callback(payload);

        expect( BomExportCollection.length ).toBe( 0 );
    });

    it("does not create a bom export for items with no itemIds", function() {
        var callback = AppDispatcher.register.mock.calls[0][0];

        var payload = {
            source: "VIEW_ACTION",
            action: {
                type: ActionConstants.EXPORT_BOM_ITEMS,
                attributes: {
                    attributes: []
                }
            }
        };
        callback(payload);

        expect( BomExportCollection.length ).toBe( 0 );
    });
});
