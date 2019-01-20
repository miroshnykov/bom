"use strict";

var Dispatcher = require("flux").Dispatcher;
var _ = require("underscore");

module.exports = _.extend(new Dispatcher(), {
    handle: function(action, attrs) {
        return new Promise(function(resolve, reject) {
            this.dispatch({
                source: "VIEW_ACTION",
                action: {
                    type: action,
                    attributes: attrs,
                    resolve: resolve,
                    reject: reject
                }
            });
        }.bind(this));
    },

    partial: function(action) {
        return _.bind(this.handle, this, action);
    }
});
