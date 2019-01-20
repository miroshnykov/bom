"use strict";

var _ = require("underscore");
var React = require("react");

var Breadcrumbs = React.createClass({
    render: function() {
        return (
            <div className="breadcrumbs h4">
                {this.renderCrumbs()}
            </div>
        );
    },

    renderCrumbs: function() {
        var crumbs = [];

        _.each(this.props.children, function(child) {
            if (crumbs.length) {
                crumbs.push(<span className="fa fa-angle-right"></span>);
            }
            crumbs.push(child);
        });

        return crumbs;
    }
});

module.exports = Breadcrumbs;
