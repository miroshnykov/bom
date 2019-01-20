
var ExtendedCollection = Backbone.Collection.extend({

  sync: function(method, collection, options) {
    return new Promise(function(resolve, reject) {
      var success;
      var error;

      success = options.success;
      options.success = function(response) {
        if (success) success(response);
        resolve(collection);
      };

      error = options.error;
      options.error = function(xhr, textStatus, errorThrown) {
        if (error) error.apply(this, arguments);
        //TODO create own error class
        reject({
          xhr: xhr,
          textStatus: textStatus,
          errorThrown: errorThrown
        });
        // reject(new Error(errorThrown));
      };

      Backbone.sync(method, collection, options);
    });
  },

  //TODO change this not to throw
  // verifyAttributes: function(action, attributes) {
  //   if (!action.attributes) {
  //     throw new Error("Missing attributes.");
  //   }

  //   for(var index in attributes) {
  //     if (action.attributes[ attributes[index] ] === undefined) {
  //       throw new Error("Missing attribute " + attributes[index]);
  //     }
  //   }
  // },

  validateAction: function(action, attributes) {
    if (!action) { return false; }

    if (attributes && !action.attributes) { return false; }

    for(var index in attributes) {
      if (action.attributes[ attributes[index] ] === undefined) {
        return false;
      }
    }

    return true;
  }

});

module.exports = ExtendedCollection;
