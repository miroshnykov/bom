"use strict";

var React = require("react");
var Router = require("react-router");
var RouteHandler = Router.RouteHandler;

var Sidebar = require("components/Sidebar.jsx");

var SidebarApp = React.createClass({

    render: function() {
        return (
            <div className="content-area full-height">
                <Sidebar />
                <div className="center-panel">
                    <RouteHandler />
                </div>
            </div>
        );
    },
});

module.exports = SidebarApp;
