var AppDispatcher = require("../dispatcher/AppDispatcher");
var ActionConstants = require("../constants/ActionConstants");

var ComponentActions = {

  /**
   * Get the component from the server.
   */
  fetchAll: function(productId) {
    return new Promise(function(resolve, reject) {
        AppDispatcher.handleViewAction({
          type: ActionConstants.FETCH_ALL_COMPONENTS,
          resolve: resolve,
          reject: reject
        });
      });
  },

  /**
   * Update a component field.
   */
  // updateField: function(componentId, fieldId, value) {
  //   AppDispatcher.handleViewAction({
  //     actionType: ComponentConstants.COMPONENT_UPDATE_FIELD,
  //     componentId: componentId,
  //     fieldId: fieldId,
  //     value: value
  //   });
  // },

  // /**
  //  * @param  {array} ids
  //  */
  // destroy: function(ids) {
  //   AppDispatcher.handleViewAction({
  //     actionType: ComponentConstants.COMPONENT_DESTROY,
  //     ids: ids
  //   });

  //   //TODO destroy from localStore to fake the API call
  // },

  // /**
  //  * @param  {string} id
  //  */
  // select: function(id) {
  //   AppDispatcher.handleViewAction({
  //     actionType: ComponentConstants.COMPONENT_SELECT,
  //     id: id
  //   });
  // }

};

module.exports = ComponentActions;
