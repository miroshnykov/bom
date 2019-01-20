var AppDispatcher = require("../dispatcher/AppDispatcher");
var ActionConstants = require("../constants/ActionConstants");

var UserActions = {

  /**
   * Get the user data from the server.
   */
  fetch: function() {
    return new Promise(function(resolve, reject) {
      AppDispatcher.handleViewAction({
        type: ActionConstants.FETCH_USER,
        resolve: resolve,
        reject: reject
      });
    });
  }

};

module.exports = UserActions;
