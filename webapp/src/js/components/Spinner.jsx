"use strict";

var React = require("react");
var cx = require("react/lib/cx");

module.exports = React.createClass({

    propTypes: {
        className: React.PropTypes.string
    },

    render: function() {
        return (
            <div className={cx("spinner", this.props.className)}>
                <div className="bounce1" />
                <div className="bounce2" />
                <div className="bounce3" />
            </div>
        );
    }
});
