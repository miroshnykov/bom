var AppDispatcher = require("../dispatcher/AppDispatcher");
var ActionConstants = require("../constants/ActionConstants");
var ApiConstants = require("../constants/ApiConstants");

var ExtendedCollection = require("../utils/ExtendedCollection");
var ProductModel = require("../models/ProductModel");
var BomStore = require("../stores/BomStore");

var ProductCollection = ExtendedCollection.extend({
    model: ProductModel,
    companyId: undefined,
    comparator: "position",

    url: function() {
        return ApiConstants.PATH_PREFIX + "/" + this.companyId + "/product";
    },

    initialize: function() {
        this.dispatchToken = AppDispatcher.register(this.dispatchCallback.bind(this));
    },

    setCompany: function(companyId) {
        this.companyId = companyId;
    },

    parse: function(resp, options) {
        var count;
        var total;
        if (resp) {
            if (resp && resp.count) {
                count = resp.count;
            } else if (resp && resp._embedded && _.isArray(resp._embedded.product)) {
                count = resp._embedded.product.length;
            }

            options.count = count;
            options.total = resp.total;

            //inject the companyId in each product
            if (resp._embedded && resp._embedded.product) {
                _.each(resp._embedded.product, function(result) {
                    result.companyId = this.companyId;
                }, this);

                return resp._embedded.product;
            }
        }
    },

    dispatchCallback: function(payload) {
        var action = payload.action;
        switch (action.type) {

            case ActionConstants.FETCH_ALL_PRODUCTS:
                this.fetch().then(function(collection) {
                    action.resolve(collection);
                }, function(error) {
                    console.log(error);
                    action.reject(error);
                });
                break;

            case ActionConstants.CREATE_PRODUCT:
                (function() {
                    var bom;
                    var product;

                    if (!this.validateAction(action, ["name"])) {
                        return;
                    }

                    //clean up name and create product
                    if (!action.attributes.name) {
                        return;
                    }

                    AppDispatcher.waitFor([BomStore.dispatchToken]);
                    bom = action.result.bom;

                    product = this.add({
                        name: action.attributes.name,
                        position: this.length ? this.last().get("position")+1 : 0,
                        bomIds: [bom.cid],
                        companyId: this.companyId
                    });

                    action.result = _.extend({}, action.result, {
                        product: product
                    });
                }).apply(this);
                break;

            case ActionConstants.DESTROY_PRODUCT:
                //TODO add option to destroy BoMs recursively
                (function() {
                    var product;

                    if (!this.validateAction(action, ["id"])) {
                        return;
                    }

                    removed = this.remove(action.attributes.id);

                    // Update positions of Products after the removed
                    this.each(function(product) {
                        if (product.get("position") > removed.get("position")) {
                            product.set("position", product.get("position")-1);
                        }
                    });

                    action.result = _.extend({}, action.result, {
                        product: removed
                    });
                }).apply(this);
                break;

            case ActionConstants.UPDATE_PRODUCT_NAME:
                (function() {
                    var product;
                    var id;
                    var name;

                    if (!this.validateAction(action, ["id", "name"])) {
                        return;
                    }

                    product = this.get(action.attributes.id);
                    product.set({
                        name: action.attributes.name
                    });

                    action.result = _.extend({}, action.result, {
                        product: product
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

            case ActionConstants.IMPORT_PRODUCT:
                (function() {
                    var product;
                    var bom;

                    // Validate action object
                    if (!this.validateAction(action)) { return; }

                    // Wait for field store to create new fields if needed
                    AppDispatcher.waitFor([BomStore.dispatchToken]);
                    if (!action.reult && !action.result.bom) {
                        action.reject(new Error("Failed to import BoM"));
                        return;
                    }

                    bom = action.result.bom;

                    product = this.add({
                        name: "My Product",
                        position: this.length ? this.last().get("position")+1 : 0,
                        bomIds: [bom.id || bom.cid],
                        companyId: this.companyId
                    });

                    if (!product) {
                        action.reject(new Error("Failed to create product"));
                        return;
                    }

                    action.resolve(product);

                    action.result = _.extend({}, action.result, {
                        product: product
                    });

                }).apply(this);
                break;

            case ActionConstants.IMPORT_NEW_BOM:
                (function() {
                    var product;
                    var bom;

                    // Validate action object
                    if (!this.validateAction(action, ["parentProductId"])) { return; }

                    // Get the parent product
                    product = this.get(action.attributes.parentProductId);
                    if (!product) {
                        action.reject(new Error("Invalid product"));
                    }

                    // Wait for field store to create new fields if needed
                    AppDispatcher.waitFor([BomStore.dispatchToken]);
                    if (!action.reult && !action.result.bom) {
                        action.reject(new Error("Failed to import BoM"));
                        return;
                    }

                    bom = action.result.bom;
                    product.attachBom(bom.id || bom.cid);

                    action.resolve(bom);

                    action.result = _.extend({}, action.result, {
                        product: product
                    });

                }).apply(this);
                break;

            case ActionConstants.CREATE_BOM:
                (function() {
                    var bom;
                    var product;

                    if (!this.validateAction(action, ["productId"])) { return; }

                    AppDispatcher.waitFor([BomStore.dispatchToken]);
                    if (!action.reult && !action.result.bom) {
                        return;
                    }

                    product = this.get(action.attributes.productId);
                    if (!product) { return; }

                    bom = action.result.bom;
                    bom.set({
                        position: product.getBoms().length
                    })

                    product.attachBom(bom.id || bom.cid);

                    action.result = _.extend({}, action.result, {
                        product: product
                    });
                }).apply(this);
                break;

            case ActionConstants.DESTROY_BOM:
                (function() {
                    var bomId;

                    if (!this.validateAction(action, ["bomId"])) { return; }
                    bomId = action.attributes.bomId;

                    //remove the bom from products
                    this.each(function(product) {
                        if (_.contains(product.getBoms(), bomId)) {
                            product.detachBom(bomId);
                        }
                    });

                }).apply(this);
                break;

            default:
                // do nothing
        }
    }
});

var ProductStore = new ProductCollection();

module.exports = ProductStore;
