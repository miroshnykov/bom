var AppDispatcher = require("../dispatcher/AppDispatcher");
var ActionConstants = require("../constants/ActionConstants");

var RevisionActions = {

  /**
   * Get the products from the server.
   */
  sync: function() {
    AppDispatcher.handleViewAction({
      type: ActionConstants.SYNC_REVISION
    });
  },

};

module.exports = RevisionActions;
