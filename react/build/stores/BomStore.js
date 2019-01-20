var AppDispatcher = require("../dispatcher/AppDispatcher");
var ActionConstants = require("../constants/ActionConstants");
var BomUtils = require("../utils/BomUtils");
var ApiConstants = require("../constants/ApiConstants");
var FieldConstants = require("../constants/FieldConstants");

var FieldStore = require("../stores/FieldStore");
var SelectedBomItemStore = require("../stores/SelectedBomItemStore");
var BomImportStore = require("../stores/BomImportStore");
var ProductStore; //delayed injection (see dispatch below)
var CompanyStore = require("../stores/CompanyStore");

var ExtendedCollection = require("../utils/ExtendedCollection");
var BomModel = require("../models/BomModel");

var BomCollection = ExtendedCollection.extend({
    model: BomModel,

    url: function() {
        return ApiConstants.PATH_PREFIX + "/" + this.getCompany() + "/bom";
    },

    initialize: function() {
        this.dispatchToken = AppDispatcher.register(this.dispatchCallback.bind(this));
    },

    parse: function(resp, options) {
        if (!resp) return;

        // Get the total number of items returned
        if (resp.total_items) {
            options.count = resp.total_items;
        } else if (resp._embedded && _.isArray(resp._embedded.bom)) {
            options.count = resp._embedded.bom.length;
        } else if (_.isArray(resp)) {
            options.count = resp.length;
        }

        // Return the field array
        return resp._embedded ? resp._embedded.bom : resp;
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

            case ActionConstants.SELECT_COMPANY:
                (function() {
                    var company;
                    var data;

                    AppDispatcher.waitFor([CompanyStore.dispatchToken]);

                    if (!this.validateAction(action, undefined, ["company"])) {
                        return;
                    }

                    company = action.result.company;
                    this.reset();
                    this.setCompany(company.id);

                    if (company.has("data")) {
                        data = company.get("data");

                        if (data.boms) {
                            this.set(data.boms, {parse: true});
                        }
                    }

                }).apply(this);
                break;

            // case ActionConstants.FETCH_ALL_BOMS:
            //     this.fetch().then(function(collection) {
            //         //console.log(collection);
            //         action.resolve(collection);
            //     }, function(error) {
            //         console.log(error);
            //         action.reject(error);
            //     });
            //     break;

            case ActionConstants.FETCH_BOM:
                (function() {
                    var bom;

                    if (!this.validateAction(action, ["bomId"])) { return; }

                    bom = this.get(action.attributes.bomId);
                    if (!bom) { return; }

                    bom.setLoading(true);

                    bom.fetch().then(function(bom) {
                        bom.setLoaded(true);
                    }, function(error) {
                        //TODO set error on model to display in the view
                        console.log(error);
                    });
                }).apply(this);
                break;

            case ActionConstants.FETCH_BOM_CHANGES:
                (function() {
                    var bom;

                    if (!this.validateAction(action, ["bomId"])) { return; }

                    bom = this.get(action.attributes.bomId);
                    if (!bom) { return; }

                    action.result = _.extend({}, action.result, {
                        bom: bom
                    });
                }).apply(this);
                break;

            case ActionConstants.FETCH_ITEM_CHANGES:
                (function() {
                    var bom;
                    var item;

                    if (!this.validateAction(action, ["bomId", "itemId"])) { return; }

                    bom = this.get(action.attributes.bomId);
                    if (!bom) { return; }

                    item = bom.getItem(action.attributes.itemId);
                    if (!item) { return; }

                    action.result = _.extend({}, action.result, {
                        item: item
                    });
                }).apply(this);
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
                        name: name
                    });

                    bom.setLoaded(true);

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

                    if (!this.validateAction(action, ["bomId"])) { return; }

                    bom = this.get(action.attributes.bomId);
                    if (!bom) { return; }

                    bom.addItem();

                }).apply(this);
                break;

            case ActionConstants.REMOVE_BOM_ITEMS:
                (function() {
                    var itemIds;
                    var bom;
                    var allRemovedItems;
                    var removed;

                    if (!this.validateAction(action, ["bomId", "items"])) { return; }

                    bomId = action.attributes.bomId;
                    itemIds = action.attributes.items;
                    if (!itemIds.length) { return; }

                    bom = this.get(bomId);
                    if (!bom) { return; }

                    removed = bom.removeItems( itemIds );

                    action.result = _.extend({}, action.result, {
                        bom: bom,
                        items: removed
                    });
                }).apply(this);
                break;

            case ActionConstants.UPDATE_BOM_ITEM:
                (function() {
                    var bom;
                    var item;
                    var content;
                    var attribute;
                    var value;
                    var values;

                    if (!this.validateAction(action, ["bomId", "itemId", "attribute"])) { return; }

                    bom = this.get(action.attributes.bomId);
                    if (!bom) { return; }

                    item = bom.getItem(action.attributes.itemId);
                    if (!item) { return; }

                    if (action.attributes.attribute) {
                        attribute = bom.getAttribute( action.attributes.attribute.id || action.attributes.attribute.cid);
                    }

                    content = action.attributes.content;

                    // If the content is undefined of an empty string
                    // then remove the value
                    if (content === undefined || content === "") {

                        if (!attribute) { return; }

                        //no content and an existing column, so remove it
                        //get the item's values for the attribute
                        value = item.getValueForAttribute(attribute.id);
                        if (!value) { return; }

                        //remove the value
                        item.removeValue(value.id || value.cid);

                    } else {

                        //if we didn't find an attribute object, create one
                        if (!attribute) {

                            //make sure we passed a field id
                            if (!action.attributes.attribute.fieldId) { return; }

                            //try to find a matching attribute
                            attribute = bom.getAttributeForField(action.attributes.attribute.fieldId);

                            //no match, so create one
                            if (!attribute) {
                                attribute = bom.addAttribute({
                                    fieldId: action.attributes.attribute.fieldId,
                                    name: action.attributes.attribute.name
                                });
                            }

                            if (!attribute) { return; }
                        }

                        //get the item field
                        value = item.getValueForAttribute(attribute.id);

                        //set the value if we already have one
                        if (value) {
                            value.set({content: action.attributes.content});
                        }
                        //add the value if its new
                        else {
                            value = item.addValue({
                                bomFieldId: attribute.id || attribute.cid,
                                content: action.attributes.content
                            });
                        }
                    }

                    action.result = _.extend({}, action.result, {
                        bom: bom,
                        item: item,
                        attribute: attribute,
                        value: value
                    });

                }).apply(this);
                break;

                // Bom Columns

            case ActionConstants.ADD_BOM_COLUMN:
                (function() {
                    var bom;
                    var data;
                    var attribute;
                    // var matchColumn;
                    // var field;

                    if (!this.validateAction(action, ["bomId", "attribute"])) { return; }

                    bom = this.get(action.attributes.bomId);
                    if (!bom) { return; }

                    data = action.attributes.attribute;
                    if (!data) { return; }

                    if (data.fieldId) {
                        attribute = bom.getAttributeForField(data.fieldId);
                        if (!attribute) {
                            attribute = bom.addAttribute(data);
                        }
                        else {
                            //bom.setAttribute(attribute.toJSON());
                            //attribute.set(data);
                            bom.setAttribute(_.extend({
                                id: attribute.id || attribute.cid,
                            }, data));
                        }
                    }
                    else {
                        //wait for field store to create new fields if needed
                        AppDispatcher.waitFor([FieldStore.dispatchToken]);
                        if (!action.result || !action.result.field || !action.result.attribute) { return; }

                        attribute = bom.addAttribute(action.result.attribute);
                    }

                    action.result = _.extend({}, action.result, {
                        bom: bom,
                        attribute: attribute
                    });
                }).apply(this);
                break;

            case ActionConstants.SET_BOM_COLUMN:
                (function() {
                    var bom;
                    var oldAttribute;
                    var newAtribute;
                    var matchColumn;
                    var field;

                    if (!this.validateAction(action, ["bomId", "attribute"])) { return; }

                    bom = this.get(action.attributes.bomId);
                    if (!bom) { return; }

                    newAttribute = action.attributes.attribute;
                    if (!newAttribute) { return; }

                    oldAttribute = bom.getAttribute(newAttribute.id);
                    if (!oldAttribute) { return; }

                    oldAttribute.set({
                        name: newAttribute.name
                    });

                    action.result = _.extend({}, action.result, {
                        bom: bom,
                        attribute: oldAttribute
                    });
                }).apply(this);
                break;

            case ActionConstants.SET_VISIBLE_BOM_COLUMNS:
                (function() {
                    var bom;

                    if (!this.validateAction(action, ["bomId", "columns"])) { return; }

                    bom = this.get(action.attributes.bomId);
                    if (!bom) { return; }

                    //wait for field store to create new fields if needed
                    AppDispatcher.waitFor([FieldStore.dispatchToken]);
                    if (!action.result.columns) { return; }

                    bom.setVisibleAttributes(action.result.columns);

                    action.result = _.extend({}, action.result, {
                        bom: bom
                        //TODO will need to pass previous state
                    });
                }).apply(this);
                break;

            case ActionConstants.HIDE_BOM_COLUMN:
                (function() {
                    var bom;
                    var attribute;

                    if (!this.validateAction(action, ["bomId", "attributeId"])) { return; }

                    bom = this.get(action.attributes.bomId);
                    if (!bom) { return; }

                    attribute = bom.hideAttribute(action.attributes.attributeId);

                    action.result = _.extend({}, action.result, {
                        bom: bom,
                        attribute: attribute
                    });
                }).apply(this);
                break;

                // Product

            case ActionConstants.CREATE_PRODUCT:
                (function() {
                    //create the default root BoM for this product
                    var bom = this.add({
                        name: "BoM"
                    });

                    bom.setLoaded(true);

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
                        position: 0
                    });
                    bom.setLoaded(true);
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

            //         //attach parent bom for change store
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
