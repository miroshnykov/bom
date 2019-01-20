/*global document:false*/
"use strict";

var _ = require("underscore");
var Backbone = require("backbone");
var AppDispatcher = require("dispatcher/AppDispatcher");

module.exports = _.extend({

    start: function() {
        $(document).on("ajaxError", this.onError);
    },

    stop: function() {
        $(document).off("ajaxError", this.onError);
    },

    onError: function(event, jqxhr, settings, thrownError) {
        // Don't display alerts for 4XX errors
        if (/^(4[0-9]{2}|0)$/.test(jqxhr.status)) {
            return;
        }

        console.error(jqxhr.status, ": ", jqxhr.statusText, " - threw error: ", thrownError);
        AppDispatcher.dispatch({
            action: {
                type: "show-alert"
            },
            alert: {
                type: "danger",
                message: "An error occured while sending a server request. Please refresh and try again",
                sticky: true
            }
        });
    }

}, Backbone.Events);
