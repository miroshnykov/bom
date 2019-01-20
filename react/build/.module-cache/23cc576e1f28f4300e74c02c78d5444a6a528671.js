var AppDispatcher = require("../dispatcher/AppDispatcher");
var ActionConstants = require("../constants/ActionConstants");
var ApiConstants = require("../constants/ApiConstants");
var ExtendedModel = require("../utils/ExtendedModel");

var UserModel = ExtendedModel.extend({
  urlRoot: ApiConstants.PATH_PREFIX + "/me",

  initialize: function () {
    ExtendedModel.prototype.initialize.apply(this);
    this.dispatchToken = AppDispatcher.register(this.dispatchCallback.bind(this));
  },

  dispatchCallback: function (payload) {
    var action = payload.action;

    switch(action.type) {
      case ActionConstants.FETCH_USER:
        this.fetch().then(function(model) {
          if (action.resolve) {
            action.resolve(model);
          }
        }, function(error) {
          if (action.reject) {
            action.reject(error);
          }
        });
        break;

      default:
        // do nothing
    }
  }
});

module.exports = UserModel;
