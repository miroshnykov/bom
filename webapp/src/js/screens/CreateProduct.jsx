"use strict";

var _          = require("underscore");
var Navigation = require("react-router").Navigation;
var React      = require("react");

var AppConstants   = require("constants/AppConstants");
var ContentPage    = require("components/ContentPage.jsx");
var ProductActions = require("actions/ProductActions");
var ProductModel   = require("models/ProductModel");
var Scroll         = require("components/Scroll.jsx");
var Spinner        = require("components/Spinner.jsx");

module.exports = React.createClass({
    mixins: [Navigation],

    getInitialState: function() {
        return {
            creating: false
        };
    },

    render: function() {
        var productLabel = (
            <span>
                Create new product <span className="fa fa-long-arrow-right"/>
            </span>);

        return (
            <ContentPage className="import" title="Looks like you don't have any products">
                <p className="text-center">
                    To get started, you need to create at least one product. Once you have a
                    product, you will be able to create or import BoMs. You can also create products
                    by adding them from the <span className="fa fa-plus-square-o" /> icon in the
                    left menu.
                </p>
                <p className="text-center">
                    Also, keep in mind that if you ever need help or want to chat with us, you can
                    click on the <strong>need help?</strong> link at the bottom left of the screen.
                </p>

                <div className="row">
                    <div className="col-sm-4 col-sm-offset-4 col-xs-12">
                        <button
                            className="btn btn-danger center-block"
                            disabled={this.state.creating}
                            onClick={this.create}>
                            {this.state.creating ?
                                <Spinner /> : productLabel}
                        </button>
                    </div>
                </div>
            </ContentPage>
        );
    },

    create: function() {
        this.setState({
            creating: true
        });

        ProductActions
            .create()
            .then(function(product) {
                this.transitionTo("addBom", { productId: product.id })
            }.bind(this))
            .catch(this.displayError);
    },

    displayError: function(error) {
        AppDispatcher.dispatch({
            action: {
                type: "show-alert"
            },
            alert: { type: "danger", message: error.message}
        });

        this.setState({
            creating: null
        });
    }
});
