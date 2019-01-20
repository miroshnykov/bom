"use strict";

var React = require("react");

module.exports = React.createClass({
    propTypes: {
        title:       React.PropTypes.string,
        description: React.PropTypes.string,
        header:      React.PropTypes.node
    },

    render: function() {
        var header = this.props.header || (
            <span className="h5">
                <span className="text-uppercase">{this.props.title}</span>
                <small>
                    <span className="pull-right">
                        {this.props.description}
                    </span>
                </small>
            </span>
        );
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <div className="panel-title">
                        {header}
                    </div>
                </div>
                <div className="panel-body">
                    {this.props.children}
                </div>
            </div>
        );
    }
});
