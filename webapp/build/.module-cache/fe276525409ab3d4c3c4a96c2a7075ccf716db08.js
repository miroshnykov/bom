/*global jest:false, expect: false, Backbone:true, $:true, _:true*/
"use strict";

jest.dontMock("../BomExportStore.js");
jest.dontMock("../../models/BomExportModel.js");
jest.dontMock("../../constants/ApiConstants.js");
jest.dontMock("../../constants/ActionConstants.js");
jest.mock("../../dispatcher/AppDispatcher.js");

require("es6-promise").polyfill();
$ = require("jquery");

Backbone = require("backbone");
Backbone.$ = $;

_ = require("underscore");

describe("BomExportStore", function() {
    var ApiConstants = require("../../constants/ApiConstants");
    var ActionConstants = require("../../constants/ActionConstants");

    var AppDispatcher;
    var BomExportStore;

    var testCompanyId = 1;

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
        AppDispatcher = require("../../dispatcher/AppDispatcher");
        BomExportStore = require("../BomExportStore");
        BomExportStore.setCompany(testCompanyId);
        $.ajax = jest.genMockFunction();
    });

    it("initializes with correct urlRoot", function() {
        expect(_.result(BomExportStore, "url")).toBe(ApiConstants.PATH_PREFIX + "/" + testCompanyId +"/export/bom");
    });

    it("registers a callback with the dispatcher", function() {
        expect(AppDispatcher.register.mock.calls.length).toBe(1);
    });

    it("initializes with no field", function() {
        expect(BomExportStore.toJSON()).toEqual({});
    });

    it("sets the company", function() {
        BomExportStore.setCompany(2);
        expect(BomExportStore.getCompany()).toBe(2);
    });

    it("gets the company", function() {
        expect(BomExportStore.getCompany()).toBe(testCompanyId);
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

        expect( BomExportStore.length ).toBe( 1 );
        expect( BomExportStore.last().toJSON() ).toEqual( testExport );
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

        expect( BomExportStore.length ).toBe( 1 );
        expect( BomExportStore.last().toJSON() ).toEqual( testExport );
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

        expect( BomExportStore.length ).toBe( 0 );
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

        expect( BomExportStore.length ).toBe( 0 );
    });

    it("selects the company", function() {
        var callback = AppDispatcher.register.mock.calls[0][0];

        var payload = {
            source: "VIEW_ACTION",
            action: {
                type: ActionConstants.SELECT_COMPANY,
                attributes: {
                    companyId: 2
                }
            }
        };
        callback(payload);

        expect(BomExportStore.getCompany()).toBe(2);
    });

});
