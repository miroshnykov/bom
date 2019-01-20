"use strict";

var AppDispatcher = require("../dispatcher/AppDispatcher");
var ActionConstants = require("../constants/ActionConstants");

var CompanyActions = {

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
  },
};

module.exports = CompanyActions;
