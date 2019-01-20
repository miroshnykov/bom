"use strict";

var _ = require("underscore");
var AppDispatcher = require("../dispatcher/AppDispatcher");
var ApiConstants = require("../constants/ApiConstants");
var ActionConstants = require("../constants/ActionConstants");

var CompanyModel = require("../models/CompanyModel");
var ExtendedCollection = require("../utils/ExtendedCollection");

var CompanyCollection = ExtendedCollection.extend({
    model: CompanyModel,
    url: ApiConstants.PATH_PREFIX + "/company",
    currentId: undefined,

    initialize: function() {
        this.dispatchToken = AppDispatcher.register(this.dispatchCallback.bind(this));
    },

    setCurrent: function(companyId) {
        this.currentId = companyId;
        this.trigger("change");
    },

    getCurrent: function() {
        return this.get(this.currentId);
    },

    dispatchCallback: function(payload) {
        var action = payload.action;

        switch (action.type) {

            case ActionConstants.SELECT_COMPANY:
                (function() {
                    if (!this.validateAction(action, ["companyId"])) { return; }

                    this.setCurrent(action.attributes.companyId);

                    // Set the company for other stores
                    action.result = _.extend({}, action.result, {
                        company: this.getCurrent()
                    });
                }).apply(this);
                break;

            case ActionConstants.UPDATE_USER:
                (function() {
                    var profile;
                    var company;

                    if (!this.validateAction(action, ["profile"])) { return; }

                    profile = action.attributes.profile;

                    if (profile.company !== undefined) {
                        company = this.getCurrent();
                        company.clearErrors();
                        company.set({ name: profile.company });
                        action.result = _.extend({}, action.result, { company: company });
                    }
                }).apply(this);
                break;

            case ActionConstants.VALIDATE_USER:
                (function() {
                    var company = this.getCurrent();
                    company.clearErrors();
                }).apply(this);
                break;

            default:
                // do nothing
        }
    }

});

var CompanyStore = new CompanyCollection();

module.exports = CompanyStore;
