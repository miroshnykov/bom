var Dispatcher = require("flux").Dispatcher;

var _ = require("underscore");

/**
 * Dispatcher of the application connecting the views and the stores.
 */
var AppDispatcher = _.extend(new Dispatcher(), {

  /**
   * A bridge function between the views and the dispatcher.
   * @param  {object} action The data coming from the view.
   */
  handleViewAction: function(action) {
    this.dispatch({
      source: "VIEW_ACTION",
      action: action
    });
  },

  /**
   * A bridge function between the views and the dispatcher.
   * @param  {object} action The data coming from the server.
   */
  // handleServerAction: function(action) {
  //   this.dispatch({
  //     source: "SERVER_ACTION",
  //     action: action
  //   });
  // }

});

module.exports = AppDispatcher;
