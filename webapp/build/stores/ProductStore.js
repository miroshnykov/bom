"use strict";

var _ = require("underscore");
var moment = require("moment");

var AppDispatcher = require("../dispatcher/AppDispatcher");
var ActionConstants = require("../constants/ActionConstants");
var ApiConstants = require("../constants/ApiConstants");

var ExtendedCollection = require("../utils/ExtendedCollection");
var ProductModel = require("../models/ProductModel");
var BomStore = require("../stores/BomStore");
var CompanyStore = require("../stores/CompanyStore");

var ProductCollection = ExtendedCollection.extend({
    model: ProductModel,
    comparator: "position",

    url: function() {
        return ApiConstants.PATH_PREFIX + "/" + this.getCompany() + "/product";
    },

    initialize: function() {
        this.dispatchToken = AppDispatcher.register(this.dispatchCallback.bind(this));
    },

    parse: function(resp, options) {
        if (!resp) {
            return;
        }

        // Get the total number of items returned
        if (resp.total_items) {
            options.count = resp.total_items;
        } else if (resp._embedded && _.isArray(resp._embedded.product)) {
            options.count = resp._embedded.product.length;
        } else if (_.isArray(resp)) {
            options.count = resp.length;
        }

        // Return the field array
        return resp._embedded ? resp._embedded.product : resp;
    },

    getParentsOfBom: function(bomId) {
        return this.filter(function(product) {
            return product.isParentOfBom(bomId);
        });
    },

    dispatchCallback: function(payload) {
        var ChangeStore = require("../stores/ChangeStore");

        var action = payload.action;
        switch (action.type) {

            case ActionConstants.SELECT_COMPANY:
                (function() {
                    var company;
                    var data;

                    AppDispatcher.waitFor([CompanyStore.dispatchToken, ChangeStore.dispatchToken]);

                    if (!this.validateAction(action, undefined, ["company"])) {
                        return;
                    }

                    company = action.result.company;
                    this.reset();
                    this.setCompany(company.id);

                    if (company.has("data")) {
                        data = company.get("data");

                        if (data.products) {
                            this.set(data.products, {parse: true});
                        }
                    }

                }).apply(this);
                break;

            case ActionConstants.FETCH_PRODUCT_CHANGES:
                (function() {
                    var product;

                    if (!this.validateAction(action, ["productId"])) { return; }

                    product = this.get(action.attributes.productId);
                    if (!product) { return; }

                    action.result = _.extend({}, action.result, {
                        product: product
                    });
                }).apply(this);
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
                        bomIds: [bom.cid]
                    });

                    action.result = _.extend({}, action.result, {
                        product: product
                    });
                }).apply(this);
                break;

            case ActionConstants.DESTROY_PRODUCT:
                //TODO add option to destroy BoMs recursively
                (function() {
                    var removed;

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
                        bomIds: [bom.id || bom.cid]
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
                    });

                    product.attachBom(bom.id || bom.cid);

                    action.result = _.extend({}, action.result, {
                        product: product
                    });
                }).apply(this);
                break;

            case ActionConstants.DESTROY_BOM:
                (function() {
                    var bomId;
                    var product;

                    if (!this.validateAction(action, ["bomId"])) { return; }
                    bomId = action.attributes.bomId;

                    //remove the bom from products
                    // this.each(function(product) {
                    //     if (_.contains(product.getBoms(), bomId)) {
                    //         product.detachBom(bomId);
                    //     }
                    // });

                    product = this.find(function(product) {
                        return _.contains(product.getBoms(), bomId);
                    });
                    if (!product) { return; }

                    product.detachBom(bomId);

                    action.result = _.extend({}, action.result, {
                        product: product
                    });

                }).apply(this);
                break;

            case ActionConstants.FETCH_PRODUCT_COMMENTS:
                (function() {
                    var product;
                    var comments;
                    var prevLength;

                    if (!this.validateAction(action, ["productId", "count"])) { return; }

                    product = this.get(action.attributes.productId);
                    if (!product) { return; }

                    comments = product.getComments();
                    comments.decLeftServerCount( action.attributes.count );

                    prevLength = comments.length;
                    comments.fetch({
                        data: {
                            count: action.attributes.count,
                            before: comments.length ? comments.last().get("createdAt") : undefined
                        },
                        remove: false
                    }).then(function(comments) {
                        if (comments.length-prevLength < action.attributes.count) {
                            comments.setTotalServerCount(0);
                            this.trigger("update");
                        }
                    }.bind(this));

                    this.trigger("update");

                }).apply(this);
                break;

            case ActionConstants.CREATE_PRODUCT_COMMENT:
                (function() {
                    var product;
                    var comment;

                    if (!this.validateAction(action, ["productId", "body"])) { return; }

                    product = this.get(action.attributes.productId);
                    if (!product) { return; }

                    comment = product.getComments().add({
                        body: action.attributes.body,
                        createdAt: moment().unix()
                    });

                    action.result = _.extend({}, action.result, {
                        comment: comment
                    });
                }).apply(this);
                break;

            case ActionConstants.UPDATE_PRODUCT_COMMENT:
                (function() {
                    var product;
                    var comment;

                    if (!this.validateAction(action, ["productId", "commentId", "body"])) { return; }

                    product = this.get(action.attributes.productId);
                    if (!product) { return; }

                    comment = product.getComments().get(action.attributes.commentId);
                    if (!comment) { return; }

                    comment.set({
                        body: action.attributes.body
                    });

                    action.result = _.extend({}, action.result, {
                        comment: comment
                    });
                }).apply(this);
                break;

            case ActionConstants.DESTROY_PRODUCT_COMMENT:
                (function() {
                    var product;
                    var comment;

                    if (!this.validateAction(action, ["productId", "commentId"])) { return; }

                    product = this.get(action.attributes.productId);
                    if (!product) { return; }

                    comment = product.getComments().remove(action.attributes.commentId);
                    if (!comment) { return; }

                    action.result = _.extend({}, action.result, {
                        comment: comment
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
