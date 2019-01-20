"use strict";

var React = require("react");

var SimpleHeader = React.createClass({
    render: function() {
        return (
			<header className="simple-header">
                <div className="logo"></div>
            </header>
        );
    }
});

module.exports = SimpleHeader;
