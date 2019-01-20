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
  },

  getCurrent: function() {
    return this.currentId;
  },

  dispatchCallback: function(payload) {
    var action = payload.action;
    switch (action.type) {

      case ActionConstants.SELECT_COMPANY:
        (function() {
          if (!this.validateAction(action, ["companyId"])) {
            return;
          }

          this.setCurrent(action.attributes.companyId);
        }).apply(this);
        break;

      default:
        // do nothing
    }
  }

});

var CompanyStore = new CompanyCollection();

module.exports = CompanyStore;
