"use strict";

var cx = require("react/lib/cx");
var React = require("react");

module.exports = React.createClass({

    propTypes: {
        description: React.PropTypes.string.isRequired,
        imageSource: React.PropTypes.string.isRequired,
        title: React.PropTypes.string.isRequired
    },

    render: function() {
        return (
            <div className="carousel-slide text-center">
                <h1 className="carousel-title">
                    {this.props.title}
                </h1>
                <p className="carousel-description">
                    {this.props.description}
                </p>
                {this.props.children}
            </div>
        );
    }
});
