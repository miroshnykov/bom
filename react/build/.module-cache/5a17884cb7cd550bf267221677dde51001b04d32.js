var AppDispatcher = require("../dispatcher/AppDispatcher");
var ActionConstants = require("../constants/ActionConstants");

var ProductActions = {

  /**
   * Get the products from the server.
   */
  // fetchAll: function() {
  //   return new Promise(function(resolve, reject) {
  //     AppDispatcher.handleViewAction({
  //       type: ActionConstants.FETCH_ALL_PRODUCTS,
  //       resolve: resolve,
  //       reject: reject
  //     });
  //   });
  // },

  /**
   * Load the products from an array.
   */
  // load: function(products) {
  //     AppDispatcher.handleViewAction({
  //         type: ActionConstants.LOAD_PRODUCTS,
  //         attributes: {
  //           products: products
  //         }
  //     });
  // },

  /**
   * @param  {string} name
   */
  create: function(name) {
    name = name ? name.trim() : undefined;
    if (!name) {
      return;
    }

    AppDispatcher.handleViewAction({
      type: ActionConstants.CREATE_PRODUCT,
      attributes: { name: name }
    });
  },

  /**
   * @param  {string} id
   */
  destroy: function(id) {
    AppDispatcher.handleViewAction({
      type: ActionConstants.DESTROY_PRODUCT,
      attributes: { id: id }
    });
  },

  /**
   * @param  {string} id The ID of the product item
   * @param  {object} attributes
   */
  updateName: function(id, name) {
    if (!id) {
      return;
    }

    name = name ? name.trim() : undefined;
    if (!name) {
      return;
    }

    AppDispatcher.handleViewAction({
      type: ActionConstants.UPDATE_PRODUCT_NAME,
      attributes: {
        id: id,
        name: name
      }
    });
  }
};

module.exports = ProductActions;
