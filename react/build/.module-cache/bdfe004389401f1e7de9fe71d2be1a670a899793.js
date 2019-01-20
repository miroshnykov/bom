var AppDispatcher = require("../dispatcher/AppDispatcher");
var ActionConstants = require("../constants/ActionConstants");

var ChangeActions = {

    /**
     * Get the boms from the server.
     */
    fetchAll: function() {
        return new Promise(function(resolve, reject) {
            AppDispatcher.handleViewAction({
                type: ActionConstants.FETCH_ALL_CHANGES,
                resolve: resolve,
                reject: reject
            });
        });
    },

    sync: function() {
        AppDispatcher.handleViewAction({
            type: ActionConstants.SYNC_CHANGES
        });
    },

};

module.exports = ChangeActions;
