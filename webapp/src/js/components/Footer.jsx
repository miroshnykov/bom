"use strict";

var React = require("react");

var Footer = React.createClass({
    render: function() {
        return (
            <footer className="footer">
                <div className="row">
                    <div className="col-md-8 col-md-offset-2 col-sm-12">
                        <hr />
                        <div className="fabule-logo" />
                    </div>
                </div>
            </footer>
        );
    }
});

module.exports = Footer;
