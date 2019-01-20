"use strict";

var cx = require("react/lib/cx");
var React = require("react");

module.exports = React.createClass({

    propTypes: {
        type: React.PropTypes.string.isRequired,
        index: React.PropTypes.string.isRequired,
        onClick: React.PropTypes.func.isRequired,
        sticky: React.PropTypes.bool
    },


    componentDidMount: function() {
        var current = $(React.findDOMNode(this));
        current.slideDown("fast");
        if(!this.props.sticky) {
            current.delay(5000).fadeOut(600, function() {
                this.onClick();
            }.bind(this));
        }
    },

    render: function() {
        var classes = {
            alert: true,
            "alert-dismissible": true
        };
        classes["alert-" + this.props.type] = true;
        return (
            <div className={cx(classes)} role="alert">
                <button
                    type="button"
                    onClick={this.onClick}
                    className="close"
                    aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                {this.props.children}
            </div>
        );
    },

    onClick: function() {
        this.props.onClick(this.props.index);
    }
});
