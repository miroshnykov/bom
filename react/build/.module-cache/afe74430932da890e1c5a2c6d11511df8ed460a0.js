var AppDispatcher = require("../dispatcher/AppDispatcher");
var ActionConstants = require("../constants/ActionConstants");
var ExtendedCollection = require("../utils/ExtendedCollection");
var BomExportModel = require("../models/BomExportModel");

var BomExportCollection = ExtendedCollection.extend({
    model: BomExportModel,
    companyId: undefined,

    url: function() {
        return ApiConstants.PATH_PREFIX + "/" + this.companyId + "/export/bom";
    },

    initialize: function() {
        this.dispatchToken = AppDispatcher.register(this.dispatchCallback.bind(this));
    },

    setCompany: function(companyId) {
        this.companyId = companyId;
    },

    getCompany: function() {
        return this.companyId;
    },

    dispatchCallback: function(payload) {
        var action = payload.action;

        switch (action.type) {
            case ActionConstants.EXPORT_BOM_ITEMS:
                (function() {
                    var attributes;
                    var items;
                    var bom;

                    if (!this.validateAction(action, ["attributes", "itemIds"])) {
                        return;
                    }

                    this.reset();
                    bom = this.add({
                        attributes: action.attributes.attributes.map(_.clone),
                        itemIds: _.clone(action.attributes.itemIds),
                        companyId: this.getCompany()
                    });

                    bom.save().then(undefined, function(error) {
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
                        itemIds: bom.get("itemIds"),
                        companyId: bom.get("companyId"),
                    }).then(undefined, function(error) {
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
