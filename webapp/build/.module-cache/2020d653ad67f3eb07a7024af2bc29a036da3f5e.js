"use strict";

var _ = require("underscore");
var Backbone = require("backbone");

//TODO split this into PromiseCollection and CompanyCollection (maybe)
var ExtendedCollection = Backbone.Collection.extend({
    companyId: undefined,
    _syncing: false,
    _fetched: false,
    _fetching: false,

    initialize: function() {
        this.listenTo(this, "request", this._onRequest);
        this.listenTo(this, "sync", this._onSync);
        this.listenTo(this, "error", this._onError);
    },

    _onRequest: function() {
        this._syncing = true;
    },

    _onSync: function() {
        this._syncing = false;
    },

    _onError: function() {
        this._syncing = false;
    },

    isSyncing: function() {
        return this._syncing;
    },

    isFetching: function() {
        return this._fetching;
    },

    hasFetched: function() {
        return this._fetched;
    },

    setCompany: function(companyId) {
        //this.reset([]);
        this.companyId = companyId;

        this.each(function(model) {
            if (_.isFunction(model.setCompany)) {
                model.setCompany( companyId );
            }
        });
    },

    getCompany: function() {
        return this.companyId;
    },

    sync: function(method, collection, options) {
        return new Promise(function(resolve, reject) {
            var success;
            var error;

            success = options.success;
            options.success = function(response) {
                if (success) {
                    success(response);
                }
                resolve(collection);
            };

            error = options.error;
            options.error = function(xhr, textStatus, errorThrown) {
                if (error) {
                    error.apply(this, arguments);
                }
                //TODO create own error class
                reject({
                    xhr: xhr,
                    textStatus: textStatus,
                    errorThrown: errorThrown
                });
            };

            Backbone.sync(method, collection, options);
        });
    },

    fetch: function fetch(options) {
        var success, error;

        this._fetched = true;
        this._fetching = true;

        options = options || {};

        success = options.success;
        options.success = function(response) {
            if (success) {
                success(response);
            }
            this._fetching = false;
        }.bind(this);

        error = options.error;
        options.error = function() {
            if (error) {
                error.apply(this, arguments);
            }
            this._fetching = false;
        }.bind(this);

        var xhr = Backbone.Collection.prototype.fetch.apply(this, arguments);
        return (xhr !== false) ? xhr : Promise.reject(new Error("Invalid collection attributes."));
    },

    set: function(models) {
        models = Backbone.Collection.prototype.set.apply(this, arguments);
        var singular;

        // If the company is not set, return models as usual
        if (!this.companyId) {
            return models;
        }

        // If company is set, then set on all set models
        singular = !_.isArray(models);

        if (singular) {
            if (models && _.isFunction(models.setCompany)) {
                models.setCompany( this.companyId );
            }
        }
        else {
            _.each(models, function(model) {
                if (model && _.isFunction(model.setCompany)) {
                    model.setCompany( this.companyId );
                }
            }, this);
        }

        return models;
    },

    validateAction: function(action, attributes, result) {
        if (!action) { return false; }

        if (attributes && !action.attributes) { return false; }
        if (result && !action.result) { return false; }

        var index;
        for(index in attributes) {
            if (action.attributes[ attributes[index] ] === undefined) {
                return false;
            }
        }

        for(index in result) {
            if (action.result[ result[index] ] === undefined) {
                return false;
            }
        }

        return true;
    }

});

module.exports = ExtendedCollection;
