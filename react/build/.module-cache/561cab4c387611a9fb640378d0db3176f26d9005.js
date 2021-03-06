var AppDispatcher = require("../dispatcher/AppDispatcher");
var ActionConstants = require("../constants/ActionConstants");
var ApiConstants = require("../constants/ApiConstants");
var FieldConstants = require("../constants/FieldConstants");
var TypeConstants = require("../constants/TypeConstants");

var FieldModel = require("../models/FieldModel");
var ExtendedCollection = require("../utils/ExtendedCollection");

var FieldCollection = ExtendedCollection.extend({
    model: FieldModel,
    companyId: undefined,

    url: function() {
        return ApiConstants.PATH_PREFIX + "/" + this.companyId + "/field";
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
        if (!resp) return;

        // Get the total number of items returned
        if (resp.total_items) {
            options.count = resp.total_items;
        } else if (resp._embedded && _.isArray(resp._embedded.field)) {
            options.count = resp._embedded.field.length;
        }

        // Return the field array
        return resp._embedded ? resp._embedded.field : undefined;
    },

    getBestForName: function(name) {
        if (!name) { return; }

        var field = this.find(function(result) {
            // return _.isString(result.get("name"))
            //     && (result.get("name").toLowerCase() === name.toLowerCase());
            return result.match(name);
        });

        return field;
    },

    dispatchCallback: function(payload) {
        var action = payload.action;
        switch (action.type) {

            case ActionConstants.FETCH_ALL_FIELDS:
                this.fetch().then(function(collection) {
                    //console.log(collection);
                    action.resolve(collection);
                }, function(error) {
                    console.log(error);
                    action.reject(error);
                });
                break;


            case ActionConstants.SET_BOM_COLUMN:
                (function() {
                    //TODO later if we use SET_BOM_COLUMN to change more than just the name
                }).apply(this);
                break;

            case ActionConstants.SET_VISIBLE_BOM_COLUMNS:
                (function() {
                    var bom;
                    var columns;
                    var newFields = [];

                    if (!this.validateAction(action, ["columns"])) {
                        return;
                    }

                    columns = action.attributes.columns;

                    //go through columns, and create a new field for each without field id
                    columns = columns.map(function(result) {
                        var field;

                        if (!_.isObject(result)) {
                            return result;
                        } else if (result.fieldId) {
                            return _.clone(result);
                        } else if (result.typeId) {
                            field = this.add({
                                typeId: result.typeId,
                                name: result.name,
                                companyId: this.getCompany()
                            });

                            newFields.push(field);

                            return {
                                fieldId: field.id || field.cid,
                                name: result.name
                            };
                        }
                    }, this);

                    //TODO make sure that new field is saved correclty
                    // and what happens if the Bom fails to update after the fields are created? rollback?

                    action.result = _.extend({}, action.result, {
                        newFields: newFields,
                        columns: columns
                    });

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

            case ActionConstants.IMPORT_BOM_FILE:
                (function() {
                    var attributes;
                    var items;

                    if (!this.validateAction(action, ["import"])) {
                        return;
                    }

                    attributes = action.attributes.import.meta.fields;
                    if (!attributes) { return; }

                    items = action.attributes.import.data;

                    // Removed last attribute if empty
                    if (_.last(attributes) === "") {
                        attributes.pop();
                    }

                    // Find best field match for each attribute
                    attributes = attributes.map(function(result) {
                        var field = this.getBestForName(result);

                        return {
                            name: result,
                            fieldId: field ? field.id || field.cid : undefined
                        };
                    }, this);

                    // Make sure that a field is assigned only once
                    _.each(attributes, function(attribute, index) {
                        var rest = _.rest(attributes, index+1);

                        _.each(rest, function(result) {
                            if (result.fieldId === attribute.fieldId) {
                                result.fieldId = undefined;
                            }
                        });
                    });

                    // Store result for BomImportStore
                    action.result = _.extend({}, action.result, {
                        attributes: attributes
                    });

                }).apply(this);
                break;

            case ActionConstants.IMPORT_PRODUCT:
            case ActionConstants.IMPORT_NEW_BOM:
                (function() {
                    var attributes;
                    var newFields = [];

                    if (!this.validateAction(action, ["attributes"])) {
                        action.reject(new Error("Invalid import parameters"))
                        return;
                    }

                    attributes = action.attributes.attributes;

                    //go through attributes, and create a new field for each without field id
                    attributes = attributes.map(function(result) {
                        var field;
                        var typeId;

                        if (!_.isObject(result)) {
                            return result;
                        } else if (result.fieldId || result.skip) {
                            return _.clone(result);
                        } else {
                            typeId = result.typeId;
                            if (!typeId) {
                                typeId = TypeConstants.TEXT;
                            }

                            field = this.add({
                                typeId: typeId,
                                name: result.name,
                                companyId: this.getCompany()
                            });

                            newFields.push(field);

                            return _.extend({}, result, {
                                fieldId: field.id || field.cid,
                                name: result.name
                            });
                        }
                    }, this);

                    //TODO make sure that new field is saved correclty
                    // and what happens if the Bom fails to update after the fields are created? rollback?

                    action.result = _.extend({}, action.result, {
                        newFields: newFields,
                        attributes: attributes
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

var FieldStore = new FieldCollection();

module.exports = FieldStore;
