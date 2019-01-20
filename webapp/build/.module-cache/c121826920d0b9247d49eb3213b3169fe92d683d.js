"use strict";

var _ = require("underscore");
var AppDispatcher = require("../dispatcher/AppDispatcher");
var ActionConstants = require("../constants/ActionConstants");
var ApiConstants = require("../constants/ApiConstants");

var FieldTypeModel = require("../models/FieldTypeModel");
var ExtendedCollection = require("../utils/ExtendedCollection");
var CompanyStore = require("../stores/CompanyStore");

var FieldTypeCollection = ExtendedCollection.extend({
    model: FieldTypeModel,
    url: ApiConstants.PATH_PREFIX + "/fieldtype",

    initialize: function() {
        this.dispatchToken = AppDispatcher.register(this.dispatchCallback.bind(this));
    },

    parse: function(resp, options) {
        if (!resp) {
            return;
        }

        // Get the total number of items returned
        if (resp.total_items) {
            options.count = resp.total_items;
        } else if (resp._embedded && _.isArray(resp._embedded.fieldtype)) {
            options.count = resp._embedded.fieldtype.length;
        } else if (_.isArray(resp)) {
            options.count = resp.length;
        }

        // Return the fieldtype array
        return resp._embedded ? resp._embedded.fieldtype : resp;
    },

    dispatchCallback: function(payload) {
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

                        if (data.types) {
                            this.set(data.types, {parse: true});
                        }
                    }

                }).apply(this);
                break;

            // case ActionConstants.FETCH_ALL_FIELDTYPES:
            //     this.fetch().then(function(collection) {
            //         //console.log(collection);
            //         action.resolve(collection);
            //     }, function(error) {
            //         console.log(error);
            //         action.reject(error);
            //     });
            //     break;

            default:
                // do nothing
        }
    }

});

var FieldTypeStore = new FieldTypeCollection();

module.exports = FieldTypeStore;
