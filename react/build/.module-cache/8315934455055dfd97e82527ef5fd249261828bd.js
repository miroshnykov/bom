var AppDispatcher = require("../dispatcher/AppDispatcher");
var ActionConstants = require("../constants/ActionConstants");
var ExtendedCollection = require("../utils/ExtendedCollection");
var BomModel = require("../models/BomModel");
var FieldStore = require("../stores/FieldStore");

var BomImportCollection = ExtendedCollection.extend({
    model: BomModel,

    initialize: function() {
        this.dispatchToken = AppDispatcher.register(this.dispatchCallback.bind(this));
    },

    dispatchCallback: function(payload) {
        var action = payload.action;

        switch (action.type) {
            case ActionConstants.IMPORT_BOM_FILE:
                (function() {
                    var attributes;
                    var items;
                    var bom;

                    if (!this.validateAction(action, ["import"])) {
                        return;
                    }

                    // Get the items from the import data
                    items = action.attributes.import.data;

                    // Create the new BoM
                    bom = new BomModel({
                        name: "BoM"
                    });

                    attributeIds = [];

                    // Wait for field store to create new fields if needed
                    AppDispatcher.waitFor([FieldStore.dispatchToken]);

                    if (action.result) {
                        attributes = action.result.attributes;
                    }

                    attributes = attributes || [];

                    // If attributes are present
                    if (attributes.length) {
                        // Create the attributes in the Bom
                        attributes = attributes.map(function(result) {
                            return bom.setAttribute(result);
                        });

                        _.each(items, function(item) {
                            var values = [];

                            _.each(attributes, function(attribute) {
                                if (item[attribute.name] !== "") {
                                    values.push({
                                        content: item[attribute.name],
                                        bomFieldId: attribute.id || attribute.cid
                                    });
                                }
                            });

                            // Add an item with those values
                            bom.addItem({
                                values: values
                            });
                        });
                    }
                    else {
                        // Make sure we have at least one item to import as we don't have headers
                        if (!items || items.length === 0) { return; }

                        // Add an attribute for each of the first item's values
                        _.each(items[0], function(result) {
                            attributes.push({
                                name: "",
                                fieldId: undefined
                            });
                        });

                        // Create the attributes in the Bom
                        attributes = attributes.map(function(result) {
                            return bom.setAttribute(result);
                        });

                        // Parse each item
                        _.each(items, function(item) {
                            var values = [];

                            _.each(item, function(content, index) {
                                if (content !== "") {
                                    values.push({
                                        content: content,
                                        bomFieldId: attributes[index].id || attributes[index].cid
                                    });
                                }
                            });

                            // Add an item with those values
                            bom.addItem({
                                values: values
                            });
                        });
                    }

                    this.reset();
                    this.add(bom);

                }).apply(this);
                break;

            case ActionConstants.IMPORT_PRODUCT:
            case ActionConstants.IMPORT_NEW_BOM:
                (function() {
                    var importAttributes;
                    var bomId;
                    var importedBom;

                    if (!this.validateAction(action, ["importedBomId", "attributes"])) {
                        action.reject(new Error("Invalid import parameters"))
                        return;
                    }

                    importedBom = this.get(action.attributes.importedBomId);
                    if (!importedBom) {
                        action.reject(new Error("Invalid import id"));
                        return;
                    }

                    //wait for field store to create new fields if needed
                    AppDispatcher.waitFor([FieldStore.dispatchToken]);
                    if (!action.result && !action.result.attributes) {
                        action.reject(new Error("Failed to import fields"));
                        return;
                    }

                    // Go through the bom's attributes, and set the name and field
                    // or remove if the attributes were removed/skipped
                    importedBom.getAttributes().each(function(attribute, index) {

                        var importAttribute = _.find(action.result.attributes, function(result) {
                            return (result.id && (result.id === attribute.id))
                                || (result.cid && (result.cid === attribute.cid));
                        });

                        if (importAttribute) {
                            importedBom.setAttribute( _.extend(attribute.toJSON(), {
                                name: importAttribute.name,
                                fieldId: importAttribute.fieldId,
                                visible: true,
                                position: index
                            }));
                        }
                        else {
                            importedBom.removeColumn( attribute.id || attribute.cid );
                        }

                    });

                    // Clean up
                    this.reset();

                    // Pass Bom to the BomStore
                    action.result = _.extend({}, action.result, {
                        bom: importedBom
                    });

                }).apply(this);
                break;

            case ActionConstants.IMPORT_UPDATE_BOM:
                break;

            default:
                // do nothing
        }
    }
});

var BomImportStore = new BomImportCollection();

module.exports = BomImportStore;
