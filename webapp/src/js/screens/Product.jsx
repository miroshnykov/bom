"use strict";

var _ = require("underscore");
var React = require("react");
var Router = require("react-router");
var Navigation = require("react-router").Navigation;
var State = require("react-router").State;
var RouteHandler = Router.RouteHandler;

var LocalStorage = require("utils/LocalStorage");
var ProductStore = require("stores/ProductStore");

var cx = require("react/lib/cx");

var Product = React.createClass({
    mixins: [Navigation, State],

    componentWillMount: function() {
        this.validate();
    },

    componentWillReceiveProps: function(nextProps) {
        this.validate();
    },

    validate: function() {
        var product = this.getProduct();

        if (!product) {
            this.replaceWith("default");
        }
        // Redirect if productId is present as parameter but doesn't match
        // This is used to redirect a client id to its permanent id
        else if ( product.id && product.id !== +this.getParams().productId ) {
            this.replaceWith("product", _.extend(this.getParams(), {productId: product.id}));
        }
    },

    getProduct: function(props) {
        return ProductStore.collection.get( this.getParams().productId );
    },

    render: function() {
        var product = this.getProduct();
        if (!product) { return null; }

        return (<RouteHandler product={product} />);
    }
});

module.exports = Product;
