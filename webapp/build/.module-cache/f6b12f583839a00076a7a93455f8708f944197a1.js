/*global jest:false, expect: false, Backbone:true, _:true*/
"use strict";

jest.dontMock("../BomModel.js");

Backbone = require("backbone");
_ = require("underscore");

describe("BomModel", function() {
    var BomModel = require("../BomModel");
    var ApiConstants = require("../../constants/ApiConstants");
    var bom;

    var testCompanyId = 1;

    var testBom = {
        id: 1,
        name: "Test Bom",
        bomIds: [2, 3, 4, 5],
        items: [{
            "id": 1,
            "description": "Test Item",
            "values": [{
                id: 10,
                content: "Test Value 1"
            }, {
                id: 11,
                content: "Test Value 2"
            }]
        }, {
            "id": 2,
            "description": "Test Item #2",
            "values": [{
                id: 12,
                bomFieldId: 2,
                content: "Test Value 3"
            }, {
                id: 11,
                bomFieldId: 1,
                content: "Test Value 3"
            }, {
                id: 10,
                bomFieldId: 3,
                content: "Test Value 3"
            }]
        }, {
            "id": 3,
            "description": "Test Item #3",
            "values": [{
                id: 10,
                content: "Test Value 4"
            }]
        }],
        attributes: [{
            id: 1,
            fieldId: 21,
            name: "Field #1",
            visible: true,
            position: 1
        }, {
            id: 2,
            fieldId: 22,
            name: "Field #2",
            visible: false,
            position: -1
        }, {
            id: 3,
            fieldId: 23,
            name: "Field #3",
            visible: true,
            position: 0
        }]
    };

    beforeEach(function() {
        bom = new BomModel(JSON.parse(JSON.stringify(testBom)));
        bom.setCompany(testCompanyId);
    });

    it("initializes the correct urlRoot", function() {
        expect(_.result(bom, "url")).toBe(ApiConstants.PATH_PREFIX + "/" + testCompanyId + "/bom/1");
    });

    it("initializes with the correct defaults", function() {
        bom = new BomModel();
        expect(bom.attributes).toEqual({
            bomIds: [],
            validate: true
        });
    });

    // Parsing

    it("parses bom data", function() {
        var resp = {
            id: 1,
            description: "Test Description",
            _embedded: {
                unknown: {
                    name: "Unknown Entity"
                }
            }
        };

        expect(bom.parse(resp)).toEqual({
            id: 1,
            description: "Test Description"
        });
    });

    it("parses bom data with embedded bom as ids", function() {
        var resp = {
            id: 1,
            description: "Test Description",
            bomIds: [1, 2, 3]
        };

        expect(bom.parse(resp)).toEqual({
            id: 1,
            description: "Test Description",
            bomIds: [1, 2, 3]
        });
    });

    it("parses bom data with embedded bom as objects", function() {
        var resp = {
            id: 1,
            description: "Test Description",
            children: [{
                id: 1
            }, {
                id: 2
            }, {
                id: 3
            }]
        };

        expect(bom.parse(resp)).toEqual({
            id: 1,
            description: "Test Description",
            bomIds: [1, 2, 3]
        });
    });

    it("parses bom data with embedded bom fields", function() {
        var resp = {
            id: 1,
            description: "Test Description",
            bomFields: [{
                id: 1,
                fieldId: 4,
                name: "Field #1"
            }, {
                id: 2,
                fieldId: 5,
                name: "Field #2"
            }, {
                id: 3,
                fieldId: 6,
                name: "Field #3"
            }]
        };

        expect(bom.parse(resp)).toEqual({
            id: 1,
            description: "Test Description",
            attributes: [{
                id: 1,
                fieldId: 4,
                name: "Field #1"
            }, {
                id: 2,
                fieldId: 5,
                name: "Field #2"
            }, {
                id: 3,
                fieldId: 6,
                name: "Field #3"
            }]
        });
    });

    it("parses bom data with embedded bom items", function() {
        var resp = {
            id: 1,
            description: "Test Description",
            bomItems: [{
                id: 1
            }, {
                id: 2
            }, {
                id: 3
            }]
        };

        expect(bom.parse(resp)).toEqual({
            id: 1,
            description: "Test Description",
            items: [{
                id: 1
            }, {
                id: 2
            }, {
                id: 3
            }]
        });
    });

    //Columns

    it("gets a column", function() {
        expect(bom.getAttribute(2).toJSON()).toEqual(testBom.attributes[1]);
    });

    it("gets a column returns undefined if id is undefined", function() {
        expect(bom.getAttribute(undefined)).toBeUndefined();
    });

    it("gets all columns sorted in ascending order", function() {
        var columns = bom.getAttributes();

        expect(columns.length).toBe(3);
        expect(columns.at(0).id).toBe(2);
        expect(columns.at(1).id).toBe(3);
        expect(columns.at(2).id).toBe(1);
    });

    it("gets visible columns sorted in ascending order", function() {
        var columns = bom.getVisibleAttributes();

        expect(columns.length).toBe(2);
        expect(columns[0].id).toBe(3);
        expect(columns[1].id).toBe(1);
    });

    it("gets a column for a field id", function() {
        expect(bom.getAttributeForField(22).toJSON()).toEqual(testBom.attributes[1]);
    });

    it("adds a new column without id or cid", function() {
        var columns;
        var column = {
            name: "New Column"
        };

        bom.addAttribute(column);
        expect(bom.getAttributes().length).toBe(testBom.attributes.length + 1);

        column.name = "Changed Column";

        columns = bom.getAttributes();
        column = columns.last();
        expect(column.get("name")).toBe("New Column");
        expect(column.cid).toBeDefined();
    });

    it("sets a new column from attributes and merge with the existing one", function() {
        var columns;
        var column = {
            id: 1,
            name: "Merged name"
        };

        bom.setAttribute(column);

        columns = bom.getAttributes();
        expect(columns.length).toBe(testBom.attributes.length);

        expect(bom.getAttribute(1).get("name")).toBe("Merged name");
    });

    // Tests a bug that would overwrite all items with undefined .cid
    // if the new item had an .id but undefined .cid
    it("sets a column with an undefined cid", function() {
        var column = {
            id: testBom.attributes[0].id,
            name: "New Column",
            cid: undefined
        };

        bom.setAttribute(column);

        expect(bom.getAttribute(testBom.attributes[0].id).get("name")).toBe("New Column");
        expect(bom.getAttribute(testBom.attributes[1].id).get("name")).toBe(testBom.attributes[1].name);
    });

    it("sets all visible columns", function() {
        bom.setVisibleAttributes([2, 3]);

        expect(bom.getAttribute(1).get("visible")).toBe(false);
        expect(bom.getAttribute(1).get("position")).toBe(-1);
        expect(bom.getAttribute(2).get("visible")).toBe(true);
        expect(bom.getAttribute(2).get("position")).toBe(0);
        expect(bom.getAttribute(3).get("visible")).toBe(true);
        expect(bom.getAttribute(3).get("position")).toBe(1);
    });

    it("sets all visible columns including a new column", function() {
        bom.setVisibleAttributes([{
            fieldId: 1000,
            name: "New Column"
        }]);
        expect(bom.getAttributes().length).toBe(4);
        expect(bom.getVisibleAttributes().length).toBe(1);
    });

    it("sets all visible columns but fails to create a new column missing a field id", function() {
        bom.setVisibleAttributes([{
            fieldId: undefined,
            name: "New Column"
        }]);
        expect(bom.getAttributes().length).toBe(3);
        expect(bom.getVisibleAttributes().length).toBe(0);
    });

    it("sets all visible columns including a new column with a field id that matches an existing column", function() {
        bom.setVisibleAttributes([{
            fieldId: 21,
            name: "New Column"
        }]);
        expect(bom.getAttributes().length).toBe(3);
        expect(bom.getVisibleAttributes().length).toBe(1);
        expect(bom.getVisibleAttributes()[0].id).toBe(1);
    });

    it("sets all visible columns including modifying the name of an existing column", function() {
        bom.setVisibleAttributes([{
            id: 1,
            fieldId: 21,
            name: "New Column"
        }]);
        expect(bom.getAttributes().length).toBe(3);
        expect(bom.getVisibleAttributes().length).toBe(1);
        expect(bom.getVisibleAttributes()[0].id).toBe(1);
        expect(bom.getVisibleAttributes()[0].get("name")).toBe("New Column");
    });

    it("sets all visible columns including creating a new column if the field changed", function() {
        bom.setVisibleAttributes([{
            id: 1,
            fieldId: 21,
            name: "New Column"
        }]);
        expect(bom.getAttributes().length).toBe(3);
        expect(bom.getVisibleAttributes().length).toBe(1);
        expect(bom.getVisibleAttributes()[0].id).toBe(1);
        expect(bom.getVisibleAttributes()[0].get("name")).toBe("New Column");
    });

    it("hides an attribute and updates the order of visible columns", function() {
        bom.hideAttribute(3);
        expect(bom.getAttribute(3).get("visible")).toBe(false);
        expect(bom.getAttribute(1).get("position")).toBe(0);
    });

    // Children Boms

    it("gets the expected child bom ids", function() {
        expect(bom.get("bomIds")).toEqual([2, 3, 4, 5]);
    });

    it("attaches a child bom", function() {
        bom.attachBom(6);
        expect(bom.get("bomIds")).toEqual([2, 3, 4, 5, 6]);
    });

    it("doesn't attach an undefined child bom", function() {
        bom.attachBom(undefined);
        expect(bom.get("bomIds")).toEqual([2, 3, 4, 5]);
    });

    it("detaches a child bom", function() {
        bom.detachBom(3);
        expect(bom.get("bomIds")).toEqual([2, 4, 5]);
    });

    it("fixes a child bom id", function() {
        var child = new BomModel({
            id: 6
        });
        child.cid = "c1";

        bom.attachBom("c1");
        expect(bom.get("bomIds")).toEqual([2, 3, 4, 5, "c1"]);

        bom.fixChildBomId(child);
        expect(bom.get("bomIds")).toEqual([2, 3, 4, 5, 6]);
    });

    it("doesn't fix a child bom id for undefined", function() {
        var child = new BomModel();
        child.cid = "c1";

        bom.attachBom("c1");
        expect(bom.get("bomIds")).toEqual([2, 3, 4, 5, "c1"]);

        bom.fixChildBomId(child);
        expect(bom.get("bomIds")).toEqual([2, 3, 4, 5, "c1"]);
    });

    it("gets an item", function() {
        var item = bom.getItem(testBom.items[0].id);
        expect(item.toJSON( { json: { associations: true }} )).toEqual(testBom.items[0]);
    });

    it("gets undefined if item is not found", function() {
        expect(bom.getItem(testBom.items.length + 1)).toBeUndefined();
    });

    it("gets of all items", function() {
        var items = bom.getItems();
        expect(items.toJSON( { json: { associations: true }} )).toEqual(testBom.items);
    });

    it("adds a blank item", function() {
        bom.addItem();
        expect(bom.getItems().length).toBe(testBom.items.length + 1);
    });

    it("adda a new item from attributes without id or cid", function() {
        var items;
        var model;
        var item = {
            description: "New Item"
        };

        model = bom.addItem(item);
        expect(bom.getItems().length).toBe(testBom.items.length + 1);

        item.description = "Changed Item";

        items = bom.getItems();
        expect(model.get("description")).toBe("New Item");
        expect(model.cid).toBeDefined();
        expect(model.get("position")).toBe(testBom.items.length);
    });

    it("sets a new item from attributes and merge with the existing one", function() {
        var items;
        var item = {
            id: 1,
            type: "Resistor"
        };

        bom.setItem(item);

        items = bom.getItems();
        expect(items.length).toBe(testBom.items.length);

        item = items.first();
        expect(item.get("description")).toBe("Test Item");
        expect(item.get("type")).toBe("Resistor");
    });

    it("doesn't set a blank item", function() {
        bom.setItem();
        expect(bom.getItems().length).toBe(testBom.items.length);
    });

    it("removes an item", function() {
        bom.removeItem(1);
        expect(bom.getItems().toJSON( {json: {associations: true}} )).toEqual([testBom.items[1], testBom.items[2]]);
    });

    it("removes multiple items", function() {
        bom.removeItems([1, 2]);
        expect(bom.getItems().toJSON( {json: {associations: true}} )).toEqual([testBom.items[2]]);
    });

    it("gets the item field value for a given item and a field id", function() {
        expect(bom.getItemValueContentForField(2, 22)).toBe("Test Value 3");
    });

});
