/*global window:false, JSON:false*/
"use strict";

module.exports = {
    get: function(key, options) {
        options = options || {};
        var value = window.localStorage[key];
        if(!value) {
            if(options.defaultValue) {
                return options.defaultValue;
            } else {
                return null;
            }
        }
        return JSON.parse(value);
    },

    set: function(key, value, options) {
        options = options || {overwrite: true};
        if(!options.overwrite && window.localStorage[key]) {
            throw new Error("Key already exists");
        }
        window.localStorage[key] = JSON.stringify(value);
    },

    clearAll: function() {
        return window.localStorage.clear();
    },

    remove: function(key) {
        return window.localStorage.removeItem(key);
    }
};
