"use strict";

var AppDispatcher = require("../dispatcher/AppDispatcher");
var ActionConstants = require("../constants/ActionConstants");

var CompanyActions = {

    /**
     * Get the company from the server.
     */
    fetch: function(token) {
        return new Promise(function(resolve, reject) {
            AppDispatcher.handleViewAction({
                type: ActionConstants.FETCH_COMPANY,
                resolve: resolve,
                reject: reject,
                attributes: {
                    token: token
                }
            });
        });
    },

    /**
     * Select a company, make it the current company.
     */
    select: function(companyId) {
        AppDispatcher.handleViewAction({
            type: ActionConstants.SELECT_COMPANY,
            attributes: {
                companyId: companyId
            }
        });
    }
};

module.exports = CompanyActions;
