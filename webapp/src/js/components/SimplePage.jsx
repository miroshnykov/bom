"use strict";

var React = require("react");

var Footer = require("components/Footer.jsx");
var SimpleHeader = require("components/SimpleHeader.jsx");

var NavigationErrorModel = require("models/NavigationErrorModel");

module.exports = React.createClass({

    propTypes: {
        statusCode: React.PropTypes.string
    },

    /**
     * @return {object}
     */
    render: function() {
        var model = new NavigationErrorModel({statusCode: this.props.statusCode});

        return (
            <div className="container-fluid dark-background">
                <SimpleHeader />
                <div className="row">
                    <div className="col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1">
                        {this.props.children}
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

});
