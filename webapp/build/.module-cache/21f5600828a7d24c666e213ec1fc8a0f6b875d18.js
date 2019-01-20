"use strict";

var _ = require("underscore");
var AppDispatcher = require("../dispatcher/AppDispatcher");
var ActionConstants = require("../constants/ActionConstants");
var ExtendedCollection = require("../utils/ExtendedCollection");
var BomExportModel = require("../models/BomExportModel");
var ApiConstants = require("../constants/ApiConstants");

var BomExportCollection = ExtendedCollection.extend({
    model: BomExportModel,

    url: function() {
        return ApiConstants.PATH_PREFIX + "/" + this.getCompany() + "/export/bom";
    },

    initialize: function() {
        this.dispatchToken = AppDispatcher.register(this.dispatchCallback.bind(this));
    },

    dispatchCallback: function(payload) {
        var action = payload.action;

        switch (action.type) {
            case ActionConstants.EXPORT_BOM_ITEMS:
                (function() {
                    var bom;

                    if (!this.validateAction(action, ["attributes", "itemIds"])) {
                        return;
                    }

                    this.reset();
                    bom = this.add({
                        attributes: action.attributes.attributes.map(_.clone),
                        itemIds: _.clone(action.attributes.itemIds)
                    });

                    bom.save().then(undefined, function() {
                        bom.set({
                            "status": "failed",
                            "message": "We failed to export your data. Please try again."
                        });
                    });

                }).apply(this);
                break;

            case ActionConstants.RETRY_EXPORT_BOM_ITEMS:
                (function() {

                    var bom = this.last();
                    if (!bom) { return;}

                    bom.set({
                        "status": "processing"
                    });

                    bom.save({
                        attributes: bom.get("attributes"),
                        itemIds: bom.get("itemIds")
                    }).then(undefined, function() {
                        bom.clear();
                        bom.set({
                            "status": "failed",
                            "message": "We failed to export your data. Please try again."
                        });
                    });

                }).apply(this);
                break;

            case ActionConstants.SELECT_COMPANY:
                (function() {
                    if (!this.validateAction(action, ["companyId"])) {
                        return;
                    }

                    this.setCompany(action.attributes.companyId);
                }).apply(this);
                break;

            default:
                // do nothing
        }
    }
});

var BomExportStore = new BomExportCollection();

module.exports = BomExportStore;
