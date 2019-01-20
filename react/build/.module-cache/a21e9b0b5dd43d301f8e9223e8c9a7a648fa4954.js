jest.dontMock("../BomModel.js");

Backbone = require("backbone");
_ = require("underscore");

describe("BomModel", function() {
    var BomModel = require('../BomModel');
    var ApiConstants = require('../../constants/ApiConstants');
    var bom;

    var testCompanyId = 1;

    var testBom = {
        id: 1,
        name: "Test Bom",
        bomIds: [2, 3, 4, 5],
        companyId: testCompanyId,
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
    });

    it("initializes the correct urlRoot", function() {
        expect(_.result(bom, 'url')).toBe(ApiConstants.PATH_PREFIX + "/" + testCompanyId + "/bom/1");
    });

    it("initializes with the correct defaults", function() {
        bom = new BomModel();
        expect(bom.attributes).toEqual({
            bomIds: [],
            attributes: [],
            items: []
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
        expect(bom.getColumn(2)).toEqual(testBom.attributes[1]);
    });

    it("gets a column returns undefined if id is undefined", function() {
        expect(bom.getColumn(undefined)).toBeUndefined();
    });

    it("gets all columns sorted in ascending order", function() {
        var columns = bom.getColumns();

        expect(columns.length).toBe(3);
        expect(columns[0].id).toBe(2);
        expect(columns[1].id).toBe(3);
        expect(columns[2].id).toBe(1);
    });

    it("gets visible columns sorted in ascending order", function() {
        var columns = bom.getVisibleColumns();

        expect(columns.length).toBe(2);
        expect(columns[0].id).toBe(3);
        expect(columns[1].id).toBe(1);
    });

    it("gets a column for a field id", function() {
        expect(bom.getColumnForField(22)).toEqual(testBom.attributes[1]);
    });

    it("sets a new column without id or cid", function() {
        var columns;
        var column = {
            name: "New Column"
        };

        bom.setColumn(column);
        expect(bom.getColumns().length).toBe(testBom.attributes.length + 1);

        column.name = "Changed Column";

        columns = bom.getColumns();
        column = columns[columns.length - 1];
        expect(column.name).toBe("New Column");
        expect(column.cid).toBeDefined();
    });

    it("sets a new column from attributes and merge with the existing one", function() {
        var columns;
        var column = {
            id: 1,
            name: "Merged name"
        };

        bom.setColumn(column);

        columns = bom.getColumns();
        expect(columns.length).toBe(testBom.attributes.length);

        expect(bom.getColumn(1).name).toBe("Merged name");
    });

    it("sets a new column from attributes and replace the existing one", function() {
        var columns;
        var column = {
            id: 1
        };

        bom.setColumn(column, {
            merge: false
        });

        columns = bom.getColumns();
        expect(columns.length).toBe(testBom.attributes.length);

        expect(bom.getColumn(1).name).toBeUndefined();
    });

    // Tests a bug that would overwrite all items with undefined .cid
    // if the new item had an .id but undefined .cid
    it("sets a column with an undefined cid", function() {
        var columns;
        var column = {
            id: testBom.attributes[0].id,
            name: "New Column",
            cid: undefined
        };

        bom.setColumn(column);

        expect(bom.getColumn(testBom.attributes[0].id).name).toBe("New Column");
        expect(bom.getColumn(testBom.attributes[1].id).name).toBe(testBom.attributes[1].name);
    });

    it("sets all visible columns", function() {
        bom.setVisibleColumns([2, 3]);

        expect(bom.getColumn(1).visible).toBe(false);
        expect(bom.getColumn(1).position).toBe(-1);
        expect(bom.getColumn(2).visible).toBe(true);
        expect(bom.getColumn(2).position).toBe(0);
        expect(bom.getColumn(3).visible).toBe(true);
        expect(bom.getColumn(3).position).toBe(1);
    });

    it("sets all visible columns including a new column", function() {
        bom.setVisibleColumns([{
            fieldId: 1000,
            name: "New Column"
        }]);
        expect(bom.getColumns().length).toBe(4);
        expect(bom.getVisibleColumns().length).toBe(1);
    });

    it("sets all visible columns but fails to create a new column missing a field id", function() {
        bom.setVisibleColumns([{
            fieldId: undefined,
            name: "New Column"
        }]);
        expect(bom.getColumns().length).toBe(3);
        expect(bom.getVisibleColumns().length).toBe(0);
    });

    it("sets all visible columns including a new column with a field id that matches an existing column", function() {
        bom.setVisibleColumns([{
            fieldId: 21,
            name: "New Column"
        }]);
        expect(bom.getColumns().length).toBe(3);
        expect(bom.getVisibleColumns().length).toBe(1);
        expect(bom.getVisibleColumns()[0].id).toBe(1);
    });

    it("sets all visible columns including modifying the name of an existing column", function() {
        bom.setVisibleColumns([{
            id: 1,
            fieldId: 21,
            name: "New Column"
        }]);
        expect(bom.getColumns().length).toBe(3);
        expect(bom.getVisibleColumns().length).toBe(1);
        expect(bom.getVisibleColumns()[0].id).toBe(1);
        expect(bom.getVisibleColumns()[0].name).toBe("New Column");
    });

    it("sets all visible columns including creating a new column if the field changed", function() {
        bom.setVisibleColumns([{
            id: 1,
            fieldId: 21,
            name: "New Column"
        }]);
        expect(bom.getColumns().length).toBe(3);
        expect(bom.getVisibleColumns().length).toBe(1);
        expect(bom.getVisibleColumns()[0].id).toBe(1);
        expect(bom.getVisibleColumns()[0].name).toBe("New Column");
    });

    it("hides a column and updates the order of visible columns", function() {
        bom.hideColumn(3);
        expect(bom.getColumn(3).visible).toBe(false);
        expect(bom.getColumn(1).position).toBe(0);
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
        bom.attachBom("c1");
        expect(bom.get("bomIds")).toEqual([2, 3, 4, 5, "c1"]);

        bom.fixChildBomId("c1", 6);
        expect(bom.get("bomIds")).toEqual([2, 3, 4, 5, 6]);
    });

    it("doesn't fix a child bom id for undefined", function() {
        bom.attachBom("c1");
        expect(bom.get("bomIds")).toEqual([2, 3, 4, 5, "c1"]);

        bom.fixChildBomId("c1", undefined);
        expect(bom.get("bomIds")).toEqual([2, 3, 4, 5, "c1"]);
    });

    it("gets an item", function() {
        var item = bom.getItem(testBom.items[0].id);
        expect(item).toEqual(testBom.items[0]);
    });

    it("gets undefined if item is not found", function() {
        expect(bom.getItem(testBom.items.length + 1)).toBeUndefined();
    });

    it("gets of all items", function() {
        var items = bom.getItems();
        expect(items).toEqual(testBom.items);
    });

    it("gets all items", function() {
        var items = bom.getItems();
        expect(items).toEqual(testBom.items);
    });

    it("adds a blank item", function() {
        bom.addItem();
        expect(bom.getItems().length).toBe(testBom.items.length + 1);
    });

    it("adds a cloned item and replace the existing one", function() {
        var items;
        var item = {
            id: 1,
            description: "New Item"
        };

        bom.addItem(item);

        items = bom.getItems();
        expect(items.length).toBe(testBom.items.length);

        item = items[0];
        expect(item.description).toBe("New Item");
    });

    it("sets a new item from attributes without id or cid", function() {
        var items;
        var item = {
            description: "New Item"
        };

        bom.setItem(item);
        expect(bom.getItems().length).toBe(testBom.items.length + 1);

        item.description = "Changed Item";

        items = bom.getItems();
        item = items[items.length - 1];
        expect(item.description).toBe("New Item");
        expect(item.cid).toBeDefined();
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

        item = items[0];
        expect(item.description).toBe("Test Item");
        expect(item.type).toBe("Resistor");
    });

    it("sets a new item from attributes and replace the existing one", function() {
        var items;
        var item = {
            id: 1
        };

        bom.setItem(item, {
            merge: false
        });

        items = bom.getItems();
        expect(items.length).toBe(testBom.items.length);

        item = items[0];
        expect(item.description).toBeUndefined();
    });

    //Checks bug that would overwrite all items with undefined .cid
    // if the new item had an .id but undefined .cid
    it("sets an item with an undefined cid", function() {
        var items;
        var item = {
            id: testBom.items[0].id,
            description: "New Item",
            cid: undefined
        };

        bom.setItem(item);

        items = bom.getItems();

        expect(items[0].description).toBe("New Item");
        expect(items[1].description).toBe(testBom.items[1].description);
    });

    it("doesn't set a blank item", function() {
        bom.setItem();
        expect(bom.getItems().length).toBe(testBom.items.length);
    });

    it("removes an item", function() {
        bom.removeItem(1);
        expect(bom.get("items")).toEqual([testBom.items[1], testBom.items[2]]);
    });

    it("removes multiple items", function() {
        bom.removeItems([1, 2]);
        expect(bom.get("items")).toEqual([testBom.items[2]]);
    });

    it("gets item fields", function() {
        expect(bom.getItemFieldIds()).toEqual([10, 11, 12]);
    });

    it("gets an item field", function() {
        expect(bom.getItemField(2, 12).content).toBe("Test Value 3");
    });

    it("gets the item field for a given item and a field id", function() {
        expect(bom.getItemFieldForField(2, 22)).toEqual({
            id: 12,
            bomFieldId: 2,
            content: "Test Value 3"
        });
    });

    it("gets the item field value for a given item and a field id", function() {
        expect(bom.getItemFieldValueForField(2, 22)).toBe("Test Value 3");
    });

});
