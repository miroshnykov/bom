var AppDispatcher = require("../dispatcher/AppDispatcher");
var ApiConstants = require("../constants/ApiConstants");
var ActionConstants = require("../constants/ActionConstants");

var ExtendedModel = require("../utils/ExtendedModel");
var ExtendedCollection = require("../utils/ExtendedCollection");

var CompanyModel = ExtendedModel.extend({
    urlRoot: ApiConstants.PATH_PREFIX + "/company"
});

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
                }).apply(this);
                break;

            case ActionConstants.UPDATE_USER:
                (function() {
                    var profile;
                    var company;

                    if (!this.validateAction(action, ["profile"])) { return; }
                    //if (!action.attributes || !action.attributes.profile) { return; }

                    profile = action.attributes.profile;

                    if (profile.company !== undefined) {
                        company = this.getCurrent();
                        company.set({ name: profile.company });
                        action.result = _.extend({}, action.result, { company: company });
                    }
                }).apply(this);

            default:
                // do nothing
        }
    }

});

var CompanyStore = new CompanyCollection();

module.exports = CompanyStore;
