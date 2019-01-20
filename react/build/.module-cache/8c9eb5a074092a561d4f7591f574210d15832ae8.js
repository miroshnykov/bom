
var ExtendedModel = Backbone.Model.extend({
  _syncing: false,
  _dirty: false,

  is: function(id, cid) {
    return (id && (this.id === id || this.cid === id)) ||
      (cid && (this.cid === cid));
  },

  initialize: function() {
    this.listenTo(this, "change", this._onChange);
    this.listenTo(this, "request", this._onRequest);
    this.listenTo(this, "sync", this._onSync);
    this.listenTo(this, "error", this._onError);
  },

  _onChange: function(model, optons) {
    //this.set({dirty: true}, {silent:true});
    this._dirty = true;
    //this.trigger("change:dirty");
  },

  _onRequest: function(model, options) {
    this._syncing = true;
    //this.trigger("change change:syncing");
  },

  _onSync: function(model, options) {
    //this.set({dirty: false}, {silent:true});
    this._dirty = false;
    this._syncing = false;
    //this.trigger("change change:dirty change:syncing");
  },

  _onError: function(model, options) {
    this._syncing = false;
    //this.trigger("change change:dirty change:syncing");
  },

  isDirty: function() {
    return this._dirty;
  },

  isSyncing: function() {
    return this._syncing;
  },

  sync: function(method, model, options) {
    return new Promise(function(resolve, reject) {
      var success;
      var error;

      success = options.success;
      options.success = function(response) {
        if (success) success(response);
        resolve(model);
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
        //reject( new Error(errorThrown) );
      };

      Backbone.sync(method, model, options);
    });
  },

  fetch: function fetch(options) {
    var xhr = Backbone.Model.prototype.fetch.apply(this, arguments);
    return (xhr !== false) ? xhr : Promise.reject(new Error("Invalid model attributes."));
  },

  save: function save(key, val, options) {
    var xhr = Backbone.Model.prototype.save.apply(this, arguments);
    return (xhr !== false) ? xhr : Promise.reject(new Error("Invalid model attributes."));
  },

  destroy: function destroy(options) {
    options = options ? options : {};

    // dirty hack around Backbone setting dataType: "json" for every requests
    if (!options.dataType) {
      options.dataType = "html";
    }

    var xhr = Backbone.Model.prototype.destroy.apply(this, [options]);
    return (xhr !== false) ? xhr : Promise.reject(new Error("Can't destroy new model"));
  }
});

module.exports = ExtendedModel;
