"use strict";

var React = require("react");
var Navigation = require("react-router").Navigation;
var Link = require("react-router").Link;
var MenuItem = require("react-bootstrap").MenuItem;
var backboneMixin = require("backbone-react-component");

var DropdownButton = require("components/DropdownButton.jsx");

var Sidebar = React.createClass({
    mixins: [Navigation, backboneMixin],

    render: function() {
        var user = this.getModel();

        return (
            <header>
                <div className="btn btn-logo">
                    <Link to="app" tabIndex="-1"><div className="logo"></div></Link>
                </div>
                <div className="menu">
                    <div className="pull-right">
                        <DropdownButton icon="chevron-down">
                            <MenuItem eventKey="userAccount" onSelect={this.transitionTo}>Your Account</MenuItem>
                            <MenuItem eventKey="/company/invite" onSelect={this.transitionTo}>Invite Team Members</MenuItem>
                            <MenuItem eventKey="gettingStarted" onSelect={this.transitionTo}>Getting Started</MenuItem>
                            <MenuItem divider />
                            <MenuItem eventKey="signout" onSelect={this.signout}>Sign out</MenuItem>
                        </DropdownButton>
                    </div>
                    <div className="user-name">
                        <Link to="userAccount">{user.getDisplayName()}</Link>
                    </div>
                </div>
            </header>
        );
    },

    signout: function() {
        this.getModel().logout();
    }
});

module.exports = Sidebar;
