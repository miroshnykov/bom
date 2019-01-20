"use strict";

var _ = require("underscore");
var cx = require("react/lib/cx");
var React = require("react");

module.exports = React.createClass({
    propTypes: {
        title: React.PropTypes.string.isRequired
    },

    render: function() {
        return (
            <div className={cx("content-page", this.props.className)}>
                <div className="col-lg-8 col-md-10 col-sm-12 col-md-offset-1 col-lg-offset-2">
                    <img
                        className="logo"
                        src="/assets/images/gearswithsquishy.svg" />
                    <h4 className="text-center">
                        {this.props.title}
                    </h4>
                    {this.props.children}
                </div>
            </div>
        );
    }
});
