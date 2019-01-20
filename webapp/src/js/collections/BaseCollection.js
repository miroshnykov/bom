"use strict";

var _ = require("underscore");
var Backbone = require("backbone");

var ApiError = require("errors/ApiError");

var BaseCollection = Backbone.Collection.extend({

    loading: false,

    sync: function(method, collection, options) {
        options = options || {};

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
                reject(new ApiError({
                    xhr: xhr,
                    textStatus: textStatus,
                    errorThrown: errorThrown
                }));
            };

            Backbone.sync(method, collection, options);
        });
    },

    fetch: function fetch(options) {
        var success, error;

        options = options || {};

        success = options.success;
        options.success = function(response) {
            if (success) {
                success(response);
            }
            this.loading = false;
        }.bind(this);

        error = options.error;
        options.error = function() {
            if (error) {
                error.apply(this, arguments);
            }
            this.loading = false;
        }.bind(this);

        this.loading = true;

        var xhr = Backbone.Collection.prototype.fetch.apply(this, arguments);
        return (xhr !== false) ? xhr : Promise.reject(new Error("Invalid collection attributes."));
    },

    isLoading: function() {
        return this.loading;
    },

    destroy: function(models, options) {
        options = options ? _.clone(options) : {};

        var singular = !_.isArray(models);
        var collection = this;
        var xhr = false;
        var success = options.success;
        var error = options.error;
        var wait = options.wait;

        models = singular ? [models] : _.clone(models);

        var destroy = function() {
            _.each(models, function(model) {
                model.stopListening();
                model.trigger("destroy", model, model.collection, options);
            });
        };

        options.success = function(resp) {
            if (wait) { destroy(); }
            if (success) { success.call(options.context, collection, resp, options); }
            collection.trigger("sync", collection, resp, options);
        };

        options.error = function(resp) {
            if (error) { error.call(options.context, collection, resp, options); }
            collection.trigger("error", collection, resp, options);
        };

        if (!options.url) {
            options.url = _.result(this, "url") + "?" + $.param({
                ids: _.pluck(models, "id")
            });
        }

        xhr = this.sync("delete", this, options);
        if (!wait) { destroy(); }
        return xhr;
    },

    // TMP until we clean up collections
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

module.exports = BaseCollection;
