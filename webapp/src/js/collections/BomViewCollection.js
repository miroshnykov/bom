"use strict";

var _ = require("underscore");
var ActionConstants = require("constants/ActionConstants");

var BomViewModel = require("models/BomViewModel");
var ExtendedCollection = require("utils/ExtendedCollection");

module.exports = ExtendedCollection.extend({
    model: BomViewModel,
    comparator: "name",

    url: function() {
        return require("utils/BaseUrl").buildUrl("view");
    },

    initialize: function() {
        this.listenTo(this, "change:" + this.comparator, function() { this.sort(); });
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

    onLoadData: function(event) {
        if (!event.company) { return; }

        this.reset();

        if (event.company.data && _.isArray(event.company.data.views)) {
            this.set(event.company.data.views, {parse: true});
        }
    },

    dispatchCallback: function(payload) {
        var action = payload.action;
        switch (action.type) {

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
