"use strict";

var _ = require("underscore");
var ActionConstants = require("constants/ActionConstants");

var FieldModel = require("models/FieldModel");
var BaseCollection = require("collections/BaseCollection");

module.exports = BaseCollection.extend({
    model: FieldModel,
    comparator: "name",

    url: function() {
        return require("utils/BaseUrl").buildUrl("field");
    },

    initialize: function() {
        this.listenTo(this, "change:" + this.comparator, function() { this.sort(); });
    },

    getBestForName: function(name) {
        if (!name) { return; }

        var field = this.find(function(result) {
            return result.match(name);
        });

        return field;
    },

    onLoadData: function(event) {
        if (!event.company) { return; }

        this.reset();

        if (event.company.data && _.isArray(event.company.data.fields)) {
            this.set(event.company.data.fields, {parse: true});
        }
    },

    dispatchCallback: function(payload) {
        var action = payload.action;
        switch (action.type) {

            case ActionConstants.SET_VISIBLE_BOM_COLUMNS:
                (function() {
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
                                name: result.name
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

            default:
                // do nothing
        }
    }
});
