"use strict";

var _ = require("underscore");
var AppDispatcher = require("../dispatcher/AppDispatcher");
var ActionConstants = require("../constants/ActionConstants");
var ApiConstants = require("../constants/ApiConstants");

var BomViewModel = require("../models/BomViewModel");
var ExtendedCollection = require("../utils/ExtendedCollection");
var CompanyStore = require("../stores/CompanyStore");

var BomViewCollection = ExtendedCollection.extend({
    model: BomViewModel,
    comparator: "name",

    url: function() {
        return ApiConstants.PATH_PREFIX + "/" + this.getCompany() + "/view";
    },

    initialize: function() {
        this.dispatchToken = AppDispatcher.register(this.dispatchCallback.bind(this));
        this.listenTo(this, "change:" + this.comparator, function() { this.sort(); });
    },

    parse: function(resp, options) {
        if (!resp) {
            return;
        }

        // Get the total number of items returned
        if (resp.total_items) {
            options.count = resp.total_items;
        } else if (resp._embedded && _.isArray(resp._embedded.view)) {
            options.count = resp._embedded.view.length;
        } else if (_.isArray(resp)) {
            options.count = resp.length;
        }

        // Return the field array
        return resp._embedded ? resp._embedded.view : resp;
    },

    getDefaults: function() {
        var defaults = this.filter(function(view) {
            return view.get("default");
        });

        defaults = _.sortBy(defaults, function(view) {
            return view.id;
        });

        return defaults;
    },

    getSaved: function() {
        return this.filter(function(view) {
            return !view.get("default");
        });
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

                        if (data.views) {
                            this.set(data.views, {parse: true});
                        }
                    }

                }).apply(this);
                break;

            // case ActionConstants.FETCH_ALL_BOM_VIEWS:
            //     this.fetch().then(function(collection) {
            //        action.resolve(collection);
            //     }, function(error) {
            //         console.log(error);
            //         action.reject(error);
            //     });
            //     break;

            case ActionConstants.CREATE_BOM_VIEW:
                (function() {
                    var name;
                    var view;

                    if (!this.validateAction(action, ["name", "fieldIds"])) {
                        action.reject("Missing parameter to create view");
                        return;
                    }

                    //clean up name and check the name
                    name = action.attributes.name.trim();
                    if (!name) {
                        action.reject("View name cannot be empty");
                        return;
                    }

                    var fieldIds = _.clone(action.attributes.fieldIds);

                    view = this.add({
                        name: name,
                        fieldIds: fieldIds
                    });

                    view.setCompany( this.getCompany() );
                    action.resolve(view);

                    action.result = _.extend({}, action.result, {
                        view: view
                    });
                }).apply(this);
                break;

            case ActionConstants.UPDATE_BOM_VIEW:
                (function() {
                    var view;

                    if (!this.validateAction(action, ["viewId", "name", "fieldIds"])) {
                        action.reject("Missing parameter to update view");
                        return;
                    }

                    view = this.get(action.attributes.viewId);
                    view.set({
                        name: action.attributes.name,
                        fieldIds: _.clone(action.attributes.fieldIds)
                    });

                    action.resolve(view);

                    action.result = _.extend({}, action.result, {
                        view: view
                    });
                }).apply(this);
                break;

            case ActionConstants.DESTROY_BOM_VIEW:
                (function() {
                    var view;

                    if (!this.validateAction(action, ["viewId"])) {
                        action.reject("Missing view id");
                        return;
                    }

                    view = this.remove(action.attributes.viewId);
                    action.resolve(view);

                    action.result = _.extend({}, action.result, {
                        view: view
                    });
                }).apply(this);
                break;

            default:
                // do nothing
        }
    }
});

var BomViewStore = new BomViewCollection();

module.exports = BomViewStore;
