"use strict";

var _ = require("underscore");
var ApiError = require("../errors/ApiError");
var Backbone = require("backbone");

var ExtendedModel = Backbone.Model.extend({
    _syncing: false,
    _dirty: false,
    _associations: undefined,

    is: function(model) {
        return ((model.id && (this.id === model.id)) ||
                (model.cid && (this.cid === model.cid)));
    },

    initialize: function() {
        this.listenTo(this, "change", this._onChange);
        this.listenTo(this, "request", this._onRequest);
        this.listenTo(this, "sync", this._onSync);
        this.listenTo(this, "error", this._onError);
    },

    _onChange: function() {
        this._dirty = true;
    },

    _onRequest: function() {
        this._syncing = true;
    },

    _onSync: function() {
        this._dirty = false;
        this._syncing = false;
    },

    _onError: function() {
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
                if (success) {
                    success(response);
                }
                resolve(model);
            };

            error = options.error;
            options.error = function(xhr, textStatus, errorThrown) {
                if (error) {
                    error.apply(this, arguments);
                }
                reject(new ApiError({
                  xhr: xhr,
                  textStatus: textStatus,
                  errorThrown: errorThrown
                }));
            };

            Backbone.sync(method, model, options);
        });
    },

    fetch: function fetch() {
        var xhr = Backbone.Model.prototype.fetch.apply(this, arguments);
        return (xhr !== false) ? xhr : Promise.reject(new Error("Invalid model attributes."));
    },

    save: function save() {
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

        options.json.associations = options.json.associations || [];

        json = {};

        // Check if we need to include the client id
        if (options.json.cid) {
            json = _.extend(json, { cid: this.cid });
        }

        if (_.isArray(options.json.attributes)) {
            _.each(options.json.attributes, function(attribute) {
                json[attribute] = this.get(attribute);
            }, this);
        }
        else if (options.json.attributes !== false) {
            json = _.extend(json, _.clone(this.attributes));
        }

        // If the model doesn't have any associations, then stop here
        if (_.isEmpty(this._associations)) {
            return json;
        }

        if (options.json.associations === true) {
            _.each(this._associations, function(association, key) {
                var newOptions;

                if (this._associations.hasOwnProperty(key)) {
                    if (!association || association.length === 0) { return; }

                    newOptions = _.omit(options, "json"); // watch out, not deep clone
                    newOptions.json = {
                        attributes: true,
                        associations: true
                    };

                    json[key] = association.map(function(model) {
                        return model.toJSON(newOptions);
                    });
                }
            }, this);
        }
        else if (_.isObject(options.json.associations)) {
            _.each(options.json.associations, function(value, key) {
                var association;
                var newOptions = _.omit(options, "json"); // watch out, not deep clone;
                newOptions.json = value === true ? { associations: true } : _.clone(value);

                association = this.getAssociation(key);
                if (!association || association.length === 0) { return; }

                json[key] = association.map(function(model) {
                    return model.toJSON(newOptions);
                });
            }, this);
        }

        return json;
    }
});

module.exports = ExtendedModel;
