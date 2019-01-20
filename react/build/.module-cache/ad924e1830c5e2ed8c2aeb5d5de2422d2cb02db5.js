
var ExtendedModel = Backbone.Model.extend({
    _syncing: false,
    _dirty: false,
    _associations: undefined,

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
        this._dirty = true;
    },

    _onRequest: function(model, options) {
        this._syncing = true;
    },

    _onSync: function(model, options) {
        this._dirty = false;
        this._syncing = false;
    },

    _onError: function(model, options) {
        this._syncing = false;
    },

    isDirty: function() {
        return this._dirty;
    },

    isSyncing: function() {
        return this._syncing;
    },

    getAssociations: function() {
        return this._associations;
    },

    getAssociation: function(association) {
        return this._associations ? this._associations[association] : undefined;
    },

    setAssociation: function(key, value) {
        this._associations = this._associations || {};
        this._associations[key] = value;
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
    },

    toJSON: function(options) {
        var json;

        options = options || {};

        if (_.isEmpty(options) || !options.json) {
            return _.clone(this.attributes);
        }

        options.json.attributes = options.json.attributes || [];
        options.json.associations = options.json.associations || [];

        json = {};

        if (options.json.attributes === true) {
            json = _.extend(json, _.clone(this.attributes));
        }
        else if (_.isArray(options.json.attributes)) {
            _.each(options.json.attributes, function(attribute) {
                json[attribute] = this.get(attribute);
            }, this);
        }

        // If the model doesn't have any associations, then stop here
        if (_.isEmpty(this._associations)) {
            return json;
        }

        if (options.json.associations === true) {
            _.each(this._associations, function(value, key) {
                if (this._associations.hasOwnProperty(key)) {
                    json[key] = value.map(function(model) {
                        return model.toJSON(_.omit(options, "json"));
                    });
                }
            }, this)
        }
        else if (_.isArray(options.json.associations)) {
            _.each(options.json.associations, function(association) {
                json[association] = this.getAssociation(association).map(function(model) {
                    return model.toJSON(_.omit(options, "json"));
                });
            }, this);
        }

        return json;
    }
});

module.exports = ExtendedModel;
