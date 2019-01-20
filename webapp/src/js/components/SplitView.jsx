"use strict";

var React = require("react");

module.exports = React.createClass({
    propTypes: {
        left: React.PropTypes.node.isRequired,
        right: React.PropTypes.node.isRequired
    },

    render: function() {
        return (
           	<div className="row">
           		<div className="col-sm-12 col-md-6 col-lg-5">
            		{this.props.left}
        		</div>
        		<div className="col-sm-12 col-md-6 col-lg-7">
        			{this.props.right}
        		</div>
            </div>
        );
    }
});
