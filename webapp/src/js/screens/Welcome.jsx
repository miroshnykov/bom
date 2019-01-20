"use strict";

var _ = require("underscore");
var React = require("react");
var Navigation = require("react-router").Navigation;

var ContentPage = require("components/ContentPage.jsx");
var ProductModel = require("models/ProductModel");
var AppConstants = require("constants/AppConstants");
var Spinner = require("components/Spinner.jsx");
var Scroll = require("components/Scroll.jsx");

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
                Create a new product <span className="fa fa-long-arrow-right"/>
            </span>);

        return (
            <ContentPage className="import" title="Welcome to BoM Squad">

                <div className="row">
                    <div className="text-center col-xs-12 col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2">
                        Welcome to the BoM Squad pilot! Thanks a ton for trying us out and helping us
                        improve our product. We want to help you learn to stop worrying and love the BoM.
                    </div>

                    <div className="col-xs-12">
                        <button
                            className="btn btn-danger center-block"
                            onClick={this.getStarted}>
                            Get Started <span className="fa fa-long-arrow-right"/>
                        </button>
                    </div>
                </div>
            </ContentPage>
        );
    },

    getStarted: function() {
        this.transitionTo("gettingStarted");
    }
});
