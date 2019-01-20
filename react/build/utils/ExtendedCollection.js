
//TODO split this into PromiseCollection and CompanyCollection (maybe)
var ExtendedCollection = Backbone.Collection.extend({
    companyId: undefined,

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
            };

            Backbone.sync(method, collection, options);
        });
    },

    set: function(models, options) {
        var models = Backbone.Collection.prototype.set.apply(this, arguments);
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

        for(var index in attributes) {
            if (action.attributes[ attributes[index] ] === undefined) {
                return false;
            }
        }

        for(var index in result) {
            if (action.result[ result[index] ] === undefined) {
                return false;
            }
        }

        return true;
    }

});

module.exports = ExtendedCollection;
