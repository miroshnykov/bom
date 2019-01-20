var AppDispatcher = require("../dispatcher/AppDispatcher");
var ActionConstants = require("../constants/ActionConstants");
var BomUtils = require("../utils/BomUtils");
var ApiConstants = require("../constants/ApiConstants");
var FieldConstants = require("../constants/FieldConstants");

var FieldStore = require("../stores/FieldStore");
var SelectedBomItemStore = require("../stores/SelectedBomItemStore");
var BomImportStore = require("../stores/BomImportStore");
var ProductStore; //delayed injection (see dispatch below)

var ExtendedCollection = require("../utils/ExtendedCollection");
var BomModel = require("../models/BomModel");

var BomCollection = ExtendedCollection.extend({
    model: BomModel,
    companyId: undefined,

    url: function() {
        return ApiConstants.PATH_PREFIX + "/" + this.companyId + "/bom";
    },

    initialize: function() {
        this.dispatchToken = AppDispatcher.register(this.dispatchCallback.bind(this));
    },

    setCompany: function(companyId) {
        this.companyId = companyId;
    },

    getCompany: function() {
        return this.companyId;
    },

    parse: function(resp, options) {
        var count;
        var total;
        if (resp) {
            if (resp && resp.count) {
                count = resp.count;
            } else if (resp && resp._embedded && _.isArray(resp._embedded.bom)) {
                count = resp._embedded.bom.length;
            }

            options.count = count;
            options.total = resp.total;

            //inject the companyId in each product
            if (resp._embedded && resp._embedded.bom) {
                _.each(resp._embedded.bom, function(result) {
                    result.companyId = this.companyId;
                }, this);

                return resp._embedded.bom;
            }
        }
    },

    getChildrenBomsOfBom: function(bomId) {
        var bom = this.get(bomId);
        var children = [];
        if (bom) {
            children = bom.get("bomIds").map(function(result) {
                return this.get(result);
            }, this);
        }
        return _.sortBy(children, function(child) {
            return child.get("position");
        });
    },

    getDescendantBomsOfBom: function(bomId) {
        var descendants = [];
        var children;
        var child;

        children = this.getChildrenBomsOfBom(bomId);
        for (var index in children) {
            child = children[index];
            descendants.push(child);
            descendants = descendants.concat(this.getDescendantBomsOfBom(child.id || child.cid));
        }

        return descendants;
    },

    getParentBomsOfBom: function(bomId) {
        var parents = [];

        this.each(function(result) {
            if (this.isBomParentOfBom(result.id || result.cid, bomId)) {
                parents.push(result);
            }
        }, this);

        return parents;
    },

    isBomParentOfBom: function(parentId, childId) {
        var children = this.getChildrenBomsOfBom(parentId);

        for (var index in children) {
            if (children[index].id === childId || children[index].cid === childId) {
                return true;
            }
        }

        return false;
    },

    dispatchCallback: function(payload) {
        ProductStore = require("../stores/ProductStore");

        var action = payload.action;
        switch (action.type) {

            case ActionConstants.FETCH_ALL_BOMS:
                this.fetch().then(function(collection) {
                    //console.log(collection);
                    action.resolve(collection);
                }, function(error) {
                    console.log(error);
                    action.reject(error);
                });
                break;

            case ActionConstants.CREATE_BOM:
                (function() {
                    var name;
                    var bom;
                    var parentBom;

                    if (!this.validateAction(action, ["name"])) { return; }

                    //clean up name and check the name
                    name = action.attributes.name.trim();
                    if (!name) { return; }

                    bom = this.add({
                        name: name,
                        position: undefined,
                        //position: parentBom.getBoms().length,
                        companyId: this.getCompany()
                    });
                    //parentBom.attachBom(bom.cid);

                    action.result = _.extend({}, action.result, {
                        bom: bom
                        //parentBom: parentBom
                    });
                }).apply(this);
                break;

            case ActionConstants.UPDATE_BOM_NAME:
                (function() {
                    var name;
                    var bom;

                    if (!this.validateAction(action, ["id", "name"])) {
                        return;
                    }

                    name = action.attributes.name.trim();
                    if (!name) {
                        return;
                    }

                    bom = this.get(action.attributes.id);
                    bom.set({
                        name: name
                    });

                    action.result = _.extend({}, action.result, {
                        bom: bom
                    });
                }).apply(this);
                break;

            case ActionConstants.DESTROY_BOM:
                (function() {
                    var bom;
                    var bomId;
                    var parentBoms;
                    var childrenIds;
                    var removeIds;

                    if (!this.validateAction(action, ["bomId"])) { return; }
                    bomId = action.attributes.bomId;

                    // Wait for products to clean up
                    AppDispatcher.waitFor([ProductStore.dispatchToken]);

                    //get the bom to remove
                    bom = this.get(bomId);
                    if (!bom) { return; }

                    //find all parents of this BoM, and detach it
                    parentBoms = this.getParentBomsOfBom(bomId);

                    _.each(parentBoms, function(parent) {
                        var siblingBoms = this.getChildrenBomsOfBom(parent.id || parent.cid);

                        parent.detachBom(bomId);

                        // Update positions of sibling Boms after the removed
                        _.each(siblingBoms, function(sibling) {
                            if (sibling.get("position") > bom.get("position")) {
                                sibling.set("position", sibling.get("position")-1);
                            }
                        });
                    }, this);

                    //remove the BoM and its children from the store
                    childrenIds = this.getDescendantBomsOfBom(bomId).map(function(result) {
                        return result.id || result.cid;
                    });

                    //don't delete children BoMs that are attached elsewhere
                    //TODO later

                    removeIds = [bomId];
                    removeIds = removeIds.concat(childrenIds);
                    this.remove(removeIds);

                    action.result = _.extend({}, action.result, {
                        bom: bom
                    });

                }).apply(this);
                break;

                // Bom Items

            case ActionConstants.ADD_BOM_ITEM:
                (function() {
                    var bom;
                    //var index;

                    if (!this.validateAction(action, ["bomId"])) {
                        return;
                    }

                    bom = this.get(action.attributes.bomId);
                    if (!bom) {
                        return;
                    }

                    //TODO
                    // index = action.attributes.index;
                    // if (index === undefined) {
                    //   index = bom.getItems().length;
                    // }

                    //bom.addItemAt(index);
                    bom.addItem();

                }).apply(this);
                break;

            case ActionConstants.REMOVE_BOM_ITEMS:
                (function() {
                    var items;
                    var allChangedBoms;
                    var allRemovedItems;

                    if (!this.validateAction(action, ["items"])) {
                        return;
                    }

                    items = action.attributes.items;
                    if (!items.length) {
                        return;
                    }

                    // removed = bom.removeItems(itemIds);
                    // if (!removed) {
                    //     return;
                    // }

                    items = _.groupBy(items, 'bomId');

                    allChangedBoms = [];
                    allRemovedItems = [];
                    _.each(items, function(value, key, list) {
                        var bom = this.get(key);
                        var itemIds = _.pluck(value, 'itemId');
                        var removed = bom.removeItems( itemIds );
                        if (removed) {
                            allChangedBoms.push( bom );
                            allRemovedItems = allRemovedItems.concat( removed );
                        }
                    }, this);

                    action.result = _.extend({}, action.result, {
                        boms: allChangedBoms,
                        items: allRemovedItems
                    });
                }).apply(this);
                break;

            case ActionConstants.UPDATE_BOM_ITEM:
                (function() {
                    var bom;
                    var item;
                    var content;
                    var bomField;
                    var itemField;

                    if (!this.validateAction(action, ["bomId", "itemId", "field"])) {
                        return;
                    }

                    bom = this.get(action.attributes.bomId);
                    if (!bom) {
                        return;
                    }

                    item = bom.getItem(action.attributes.itemId);
                    if (!item) {
                        return;
                    }

                    if (action.attributes.field.id) {
                        bomField = bom.getColumn( action.attributes.field.id );
                    }

                    content = action.attributes.content;
                    if (_.isString(content)) {
                        content = content.trim();
                    }

                    if (content === undefined || content === "") {

                        if (!bomField) {
                            return;
                        }

                        //no content and an existing column, so remove it

                        //get the item field
                        itemField = _.find(item.values, function(result) {
                            return result.bomFieldId === bomField.id || result.bomFieldId === bomField.cid;
                        });

                        //remove the field
                        fields = item.values.map(_.clone);
                        fields = _.filter(fields, function(result) {
                            return result.bomFieldId !== bomField.id && result.bomFieldId !== bomField.cid;
                        });

                        item.values = fields;

                    } else {

                        //create a BomField if not defined
                        if (!bomField) {
                            //make sure we have a fieldId
                            if (!action.attributes.field.fieldId) {
                                return;
                            }

                            //try to find a matching BomField
                            bomField = bom.getColumnForField(action.attributes.field.fieldId);

                            //no match, so create one
                            if (!bomField) {
                                bomField = bom.setColumn({
                                    fieldId: action.attributes.field.fieldId,
                                    name: action.attributes.field.name
                                });
                            }

                            if (!bomField) {
                                return;
                            }
                        }

                        //get the item field
                        itemField = _.find(item.values, function(result) {
                            return result.bomFieldId === bomField.id || result.bomFieldId === bomField.cid;
                        });

                        //set the value
                        if (itemField) {
                            itemField.content = action.attributes.content;
                        } else {
                            itemField = {
                                cid: _.uniqueId('c'),
                                bomFieldId: bomField.id || bomField.cid,
                                content: action.attributes.content
                            };

                            if (!item.values) {
                                item.values = [];
                            }

                            item.values.push(itemField);
                        }
                    }

                    //TODO fix this, item should have been cloned
                    bom.setItem(item);
                    action.result = _.extend({}, action.result, {
                        bom: bom,
                        field: _.clone(itemField)
                    });
                }).apply(this);
                break;

                // Bom Columns

            case ActionConstants.SET_BOM_COLUMN:
                (function() {
                    var bom;
                    var oldColumn;
                    var newColumn;
                    var matchColumn;
                    var field;

                    if (!this.validateAction(action, ["bomId", "column"])) {
                        return;
                    }

                    bom = this.get(action.attributes.bomId);
                    if (!bom) {
                        return;
                    }

                    oldColumn = _.clone(bom.getColumn(action.attributes.column.id));
                    if (!oldColumn) {
                        return;
                    }

                    newColumn = action.attributes.column;

                    //if the fieldId is custom then we are creating a column for a new field
                    if (!newColumn.fieldId) {
                        //wait for FieldStore to create a new field, and create column with it
                    }
                    //if the fieldId changed, check we another column with that id already exists
                    else if (newColumn.fieldId !== oldColumn.fieldId) {
                        // matchColumn = bom.getColumnForField(newColumn.fieldId);
                        // if (!matchColumn) {
                        //   bom.setColumn(_.extend({}, newColumn, {
                        //     id: undefined,
                        //     cid: undefined
                        //   }));
                        // }
                    }
                    //if not, then only change the name
                    else {
                        bom.setColumn(_.extend({}, oldColumn, {
                            name: newColumn.name
                        }));
                    }

                    action.result = _.extend({}, action.result, {
                        bom: bom,
                        oldColumn: oldColumn,
                        newColumn: newColumn
                            //TODO will need to pass previous state
                    });
                }).apply(this);
                break;

            case ActionConstants.SET_VISIBLE_BOM_COLUMNS:
                (function() {
                    var bom;

                    if (!this.validateAction(action, ["bomId", "columns"])) {
                        return;
                    }

                    bom = this.get(action.attributes.bomId);
                    if (!bom) {
                        return;
                    }

                    //wait for field store to create new fields if needed
                    AppDispatcher.waitFor([FieldStore.dispatchToken]);
                    if (!action.result.columns) {
                        return;
                    }

                    bom.setVisibleColumns(action.result.columns);

                    action.result = _.extend({}, action.result, {
                        bom: bom
                        //TODO will need to pass previous state
                    });
                }).apply(this);
                break;

            case ActionConstants.HIDE_BOM_COLUMN:
                (function() {
                    var bom;
                    var column;

                    if (!this.validateAction(action, ["bomId", "columnId"])) {
                        return;
                    }

                    bom = this.get(action.attributes.bomId);
                    if (!bom) {
                        return;
                    }

                    column = bom.hideColumn(action.attributes.columnId);

                    action.result = _.extend({}, action.result, {
                        bom: bom,
                        column: column
                    });
                }).apply(this);
                break;

                // Product

            case ActionConstants.CREATE_PRODUCT:
                (function() {
                    //create the default root BoM for this product
                    var bom = this.add({
                        name: "BoM",
                        position: 0,
                        companyId: this.companyId
                    });

                    //attach it for the ProductStore
                    action.result = _.extend({}, action.result, {
                        bom: bom
                    });

                }).apply(this);
                break;

            case ActionConstants.DESTROY_PRODUCT:
                //TODO add option to destroy BoMs recursively
                (function() {
                    var product;
                    var boms;
                    var rootBom;

                    AppDispatcher.waitFor([ProductStore.dispatchToken]);
                    product = action.result.product;

                    boms = product.getBoms().map(function(result) {
                        return this.get(result);
                    }, this);

                    _.each(boms, function(result) {
                        boms = boms.concat(this.getDescendantBomsOfBom(result.id || result.cid));
                    }, this);

                    this.remove(boms);

                }).apply(this);
                break;

            case ActionConstants.SELECT_COMPANY:
                (function() {
                    if (!this.validateAction(action, ["companyId"])) {
                        return;
                    }

                    this.setCompany(action.attributes.companyId);
                }).apply(this);
                break;

            case ActionConstants.IMPORT_PRODUCT:
            case ActionConstants.IMPORT_NEW_BOM:
                (function() {
                    var bom;
                    var targetBom;

                    // Validate action object
                    if (!this.validateAction(action)) {
                        action.reject(new Error("Invalid import parameters"));
                        return;
                    }

                    // Wait for field store to create new fields if needed
                    AppDispatcher.waitFor([BomImportStore.dispatchToken]);
                    if (!action.reult && !action.result.bom) {
                        action.reject(new Error("Failed to import BoM"));
                        return;
                    };

                    bom = action.result.bom;
                    bom.set({
                        name: "BoM",
                        position: 0,
                        companyId: this.getCompany()
                    });
                    this.add( bom );

                }).apply(this);
                break;

            // case ActionConstants.IMPORT_NEW_BOM:
            //     (function() {
            //         var bom;
            //         var parentBom;

            //         // Validate action object
            //         if (!this.validateAction(action, ["parentBomId"])) {
            //             action.reject(new Error("Invalid import parameters"));
            //             return;
            //         }

            //         // Wait for field store to create new fields if needed
            //         AppDispatcher.waitFor([BomImportStore.dispatchToken]);
            //         if (!action.reult && !action.result.bom) {
            //             action.reject(new Error("Failed to import BoM"));
            //             return;
            //         }

            //         parentBom = this.get( action.attributes.parentBomId );
            //         if (!parentBom) {
            //             action.reject(new Error("Invalid parent BoM"));
            //             return;
            //         }

            //         bom = action.result.bom;
            //         bom.set({
            //             name: "New BoM",
            //             position: parentBom.getBoms().length,
            //             companyId: this.getCompany()
            //         });

            //         parentBom.attachBom(bom.id || bom.cid);
            //         bom = this.add( bom );

            //         action.resolve(bom);

            //         //attach parent bom for revision store
            //         action.result = _.extend({}, action.result, {
            //             parentBom: parentBom
            //         });

            //     }).apply(this);
            //     break;

            case ActionConstants.IMPORT_UPDATE_BOM:
                break;

            default:
                // do nothing
        }
    }
});

var BomStore = new BomCollection();

module.exports = BomStore;
