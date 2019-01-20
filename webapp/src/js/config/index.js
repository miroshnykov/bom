"use strict";

if(!window.appConfig) {
    throw new Error("No app config has been loaded.");
}

var _            = require("underscore");
var Backbone     = require("backbone");
var LocalStorage = require("utils/LocalStorage");
var UserEvent    = require("events/UserEvent");

var SHOW_NOTIFICATIONS = "settings:show_notifications";

var promptForNotifications = function(granted, denied) {
    if (Notification.permission === "granted") {
        granted();
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission(function(permission) {
            if (permission === "granted") {
                granted();
            }
            else {
                denied();
            }
        });
    }
    else {
        denied();
    }
};

var areNotificationsGranted = function() {
    return "Notification" in window ? Notification.permission === "granted" : false;
};

var areNotificationsDenied = function() {
    return "Notification" in window ? Notification.permission === "denied" : false;
};

module.exports = _.extend({

    capabilities: {
        notifications: "Notification" in window
    },

    showNotifications: LocalStorage.get(SHOW_NOTIFICATIONS, {defaultValue: false}) && areNotificationsGranted(),
    deniedNotifications: areNotificationsDenied(),

    setNotifications: function(status) {
        return new Promise(function(resolve, reject) {
            var update = function() {
                this.showNotifications = status;
                LocalStorage.set(SHOW_NOTIFICATIONS, status);
                Backbone.trigger(UserEvent.EVENT_CONFIG_UPDATE, new UserEvent());
                resolve(status);
            }.bind(this);

            var denied = function() {
                this.deniedNotifications = true;
                reject();
            }.bind(this);

            if (status) {
                promptForNotifications(update, denied);
            } else {
                update();
            }
        }.bind(this));
    }
}, window.appConfig);
