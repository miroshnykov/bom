"use strict";

var AppDispatcher = require("../dispatcher/AppDispatcher");
var ActionConstants = require("../constants/ActionConstants");

var UserActions = {

    /**
     * Create a new user.
     * @param token company token that the user wants to join (undefined to create a new company)
     */
    create: function(email, password, firstname, lastname, token) {
        return new Promise(function(resolve, reject) {
            AppDispatcher.handleViewAction({
                type: ActionConstants.CREATE_USER,
                attributes: {
                    email: email,
                    password: password,
                    firstname: firstname,
                    lastname: lastname,
                    token: token
                },
                resolve: resolve,
                reject: reject
            });
        });
    },

    /**
     * Get the user data from the server including the initial company data
     */
    init: function() {
        return new Promise(function(resolve, reject) {
            AppDispatcher.handleViewAction({
                type: ActionConstants.INIT_USER,
                resolve: resolve,
                reject: reject
            });
        });
    },

    /**
     * Update the user profile.
     */
    update: function(profile) {
        return new Promise(function(resolve, reject) {
            AppDispatcher.handleViewAction({
                type: ActionConstants.UPDATE_USER,
                attributes: {
                    profile: profile
                },
                resolve: resolve,
                reject: reject
            });
        });
    },

    /**
     * Validate the user profile.
     */
    validate: function() {
        AppDispatcher.handleViewAction({
            type: ActionConstants.VALIDATE_USER,
        });
    }

};

module.exports = UserActions;
