var AppDispatcher = require("../dispatcher/AppDispatcher");
var ActionConstants = require("../constants/ActionConstants");
var ApiConstants = require("../constants/ApiConstants");
var ExtendedModel = require("../utils/ExtendedModel");
var CompanyStore = require("../stores/CompanyStore");

var UserModel = ExtendedModel.extend({
    urlRoot: ApiConstants.PATH_PREFIX + "/me",

    url: function() {
      var base =
        _.result(this, "urlRoot") ||
        _.result(this.collection, 'url') ||
        urlError();
      return base;
    },

    initialize: function () {
        ExtendedModel.prototype.initialize.apply(this);
        this.dispatchToken = AppDispatcher.register(this.dispatchCallback.bind(this));
    },

    parse: function(resp, options) {
        // Remove attributes that start with underscore
        resp = _.omit(resp, function(value, key, object) {
            return _.isString(key) && key.slice(0, 1) === "_";
        });

        return resp;
    },

    dispatchCallback: function (payload) {
        var action = payload.action;

        switch(action.type) {
            case ActionConstants.FETCH_USER:
                (function() {
                    this.fetch().then(function(model) {
                        // TODO
                        // move the company store as an association collection of the user
                        CompanyStore.reset();
                        _.each(model.get("companies"), function(company) {
                            CompanyStore.add(company);
                        });

                        model.unset("companies");

                        if (action.resolve) {
                            action.resolve(model);
                        }

                    }, function(error) {
                        if (action.reject) {
                            action.reject(error);
                        }
                    });
                }).apply(this);
            break;

            case ActionConstants.UPDATE_USER:
                (function() {
                    var profile;

                    //if (!this.validateAction(action, ["profile"])) { return; }
                    if (!action.attributes || !action.attributes.profile) { return; }

                    profile = _.clone(action.attributes.profile);
                    profile = _.omit(profile, ["company", "newPassword", "oldPassword"]);

                    if (!_.isEmpty(profile)) {
                        this.set(profile);
                        action.result = _.extend({}, action.result, { user: this });
                    }

                    AppDispatcher.waitFor([CompanyStore.dispatchToken]);

                    this.save(undefined, {
                        patch: true,
                        attrs: _.clone(action.attributes.profile)
                    }).then(function(user) {
                        if (action.resolve) {
                            action.resolve(user);
                        }
                    }, function(error) {
                        // Revert User
                        if (action.result) {
                            if (action.result.user) {
                                action.result.user.set( action.result.user.previousAttributes() );
                            }

                            // Revert company
                            if (action.result.company) {
                                action.result.company.set( action.result.company.previousAttributes() );
                            }
                        }

                        if (action.reject) {
                            action.reject(error);
                        }
                    }.bind(this));

                }).apply(this);
                break;

        default:
            // do nothing
    }
  }
});

module.exports = UserModel;
