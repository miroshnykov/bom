"use strict";

var Backbone = require("backbone");

var React = require("react");
var Link = require("react-router").Link;
var Navigation = require("react-router").Navigation;
var backboneMixin = require("backbone-react-component");

var Button = require("react-bootstrap").Button;
var MenuItem = require("react-bootstrap").MenuItem;
var Popover = require("react-bootstrap").Popover;
var OverlayTrigger = require("react-bootstrap").OverlayTrigger;

var DropdownButton = require("components/DropdownButton.jsx");

var UserEvent = require("events/UserEvent");

/**
 * Header of the application.
 */
var Header = React.createClass({
    mixins: [Navigation, backboneMixin],

    render: function() {
        return (
        <header className="bom-header">
            <div className="row no-gutter">
                <div className="col-xs-6">
                    <Link to="app" tabIndex="-1"><div className="logo"></div></Link>
                </div>
                {this.renderRightHeader()}
            </div>
        </header>
        );
    },

    renderRightHeader: function() {
        if (this.getModel().isNew()) { return null; }

        return (<div className="col-xs-6 text-right header-right">
                <div className="menu">
                    <span>Hello, </span>
                    <Link to="userAccount">{this.getModel().getDisplayName()}</Link>
                    <DropdownButton id="dropdown-user-menu" glyphicon="option-vertical" pullRight>
                        <MenuItem eventKey="userAccount" onSelect={this.transitionTo}>Your Account</MenuItem>
                        <MenuItem eventKey="/company/invite" onSelect={this.transitionTo}>Invite Team Members</MenuItem>
                        <MenuItem divider />
                        <MenuItem eventKey="signout" onSelect={this.onSignout}>Sign out</MenuItem>
                    </DropdownButton>
                </div>
            </div>);
    },

    onSignout: function() {
        console.log("signout...");
        this.getModel().logout();
    }
});

module.exports = Header;
