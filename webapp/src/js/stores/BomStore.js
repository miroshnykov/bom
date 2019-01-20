"use strict";

var _               = require("underscore");
var ActionConstants = require("constants/ActionConstants");
var AppDispatcher   = require("dispatcher/AppDispatcher");
var Backbone        = require("backbone");
var BomCollection   = require("collections/BomCollection");
var BomEvent        = require("events/BomEvent");
var FieldStore      = require("stores/FieldStore");
var ProductStore    = require("stores/ProductStore");
var S3Upload        = require("utils/S3Upload");
var UserEvent       = require("events/UserEvent");


var BomStore = _.extend({
    collection: new BomCollection(),

    createBom: function(file, product, options) {
        var promise =
            new Promise(function(resolve, reject) {
                var bom = this.collection.create({
                    name: file && file.name ? file.name : "BoM",
                    fromImport: !!file,
                    productId: product.id
                }, {success: resolve, error: reject});

                product.attachBom(bom);
                return {bom: bom};
            }.bind(this));

        return promise
            .then(function(bom) {
                if(!file) {
                    // Done processing. Call the success handler
                    return options.success ? options.success(bom) : bom;
                }

                if(!bom.has("uploadUrl")) {
                    throw new Error("No upload URL for the file. Aborting.");
                }

                var s3 = new S3Upload({
                    onComplete: options.success,
                    onProgress: function(percent) {
                        if(options.onUpdate) {
                            options.onUpdate(percent);
                        }
                    },
                    onError: options.error
                });
                s3.upload(file, bom.get("uploadUrl"));

            })
            .catch(options.error);
    },

    destroyBom: function(bomId) {
        //get the bom to remove
        var bom = this.collection.get(bomId);
        if (!bom) { return; }

        //find all parents of this BoM, and detach it
        var parentBoms = this.collection.getParentBomsOfBom(bomId);

        _.each(parentBoms, function(parent) {
            parent.detachBom(bomId);
        }, this);

        var removedBoms = [bom];
        removedBoms = removedBoms.concat(this.collection.getDescendantBomsOfBom(bomId));
        this.collection.remove(removedBoms);

        _.each(removedBoms, function(item) {
            item.destroy();
        });

        return {bom: bom};
    },

    setBomColumn: function(bomId, attribute) {
        var bom = this.get(bomId);
        if (!bom || !attribute) { return; }

        var result = bom.setColumn(attribute);
        return {
            bom: bom,
            attribute: result
        };
    },

    setVisibleColumns: function(bomId, columns) {
        var bom = this.get(bomId);
        if (!bom) { return; }

        bom.setVisibleAttributes(columns);

        return {bom: bom};
    },

    updateBom: function(bomId, update) {
        if(update.name) {
            update.name = update.name.trim();
        }

        if(update.description) {
            update.description = update.description.trim();
        }

        var bom = this.collection.get(bomId);
        if (!bom) { return; }

        bom.save(update, {patch: true});
        return {bom: bom};
    }

}, Backbone.Events);

BomStore.dispatchToken = AppDispatcher.register(function(payload) {
    ProductStore = require("stores/ProductStore");

    var action = payload.action;
    var result = null;
    var options = {success: action.resolve, error: action.reject};
    var attrs = action.attributes || {};
    if(attrs.onUpdate) {
        options.onUpdate = attrs.onUpdate;
    }

    switch (action.type) {

        case ActionConstants.CREATE_BOM:
            result = BomStore.createBom(attrs.file, attrs.product, options);
            break;

        case ActionConstants.DESTROY_BOM:
            result = BomStore.destroyBom(attrs.bomId);
            break;

        case ActionConstants.SET_BOM_COLUMN:
            result = BomStore.setBomColumn(attrs.bomId, attrs.attribute);
            break;

        case ActionConstants.SET_VISIBLE_BOM_COLUMNS:
            //wait for field store to create new fields if needed
            AppDispatcher.waitFor([FieldStore.dispatchToken]);
            if (!action.result.columns) { return; }

            result = BomStore.setVisibleColumns(attrs.bomId, action.result.columns);
            break;

        case ActionConstants.UPDATE_BOM:
            result = BomStore.updateBom(attrs.bomId, attrs.update);
            break;

        default:
            // do nothing
    }

    action.result = _.extend({}, action.result, result);
});


BomStore.listenTo(Backbone, UserEvent.EVENT_LOAD_DATA, function(event) {
    BomStore.collection.onLoadData(event);
});

BomStore.listenTo(Backbone, BomEvent.EVENT_CREATE, function(event) {
    BomStore.collection.onBomCreate(event);
});

module.exports = BomStore;
