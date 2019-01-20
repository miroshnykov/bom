var React = require("react");
var Link = require("react-router").Link;
var Button = require("react-bootstrap").Button;
var MenuItem = require('react-bootstrap').MenuItem;
var Navigation = require('react-router').Navigation;

var UserConstants = require("../constants/UserConstants");
var DropdownButton = require("../components/DropdownButton.react");

/**
 * Header of the application.
 */
var Header = React.createClass({displayName: "Header",
    mixins: [Navigation],

    propTypes: {
        user: React.PropTypes.object,
        allRevisions: React.PropTypes.object
    },

    getInitialState: function() {
        return {
            greeting: "Salut"
        };
    },

    /**
     * @return {object}
     */
    render: function() {
        return (
        React.createElement("header", null, 
            React.createElement("div", {className: "col-md-6"}, 
                React.createElement("div", {id: "fabule-logo"})
            ), 
            this._renderRightHeader()
        )
        );
    },

    /**
     * Get the right part of the header.
     */
     _renderRightHeader: function() {
        if (!this.props.user) { return null; }

        return (React.createElement("div", {id: "header-right", className: "col-md-6 text-right"}, 
                this._renderSaveStatus(), 

                React.createElement("div", {className: "vertical-divider"}), 
                React.createElement("div", {id: "user-menu"}, 
                    React.createElement("span", null, this.state.greeting, ", "), 
                    React.createElement(Link, {to: "profile"}, this._renderDisplayName()), 
                    React.createElement(DropdownButton, {id: "dropdown-user-menu", glyphicon: "option-vertical", pullRight: true}, 
                        React.createElement(MenuItem, {eventKey: "profile", onSelect: this._onShowProfile}, "Your Profile"), 
                        React.createElement(MenuItem, {divider: true}), 
                        React.createElement(MenuItem, {eventKey: "signout", onSelect: this._onSignout}, "Sign out")
                    )
                )
            ));
     },

    /**
     * Get the saving status from the Revision store.
     */
     _renderSaveStatus: function() {
        var status;
        var queueLength;
        var revisions = this.props.allRevisions;
        if (!revisions) { return null; }

        queueLength = revisions.getQueueLength();

        if (revisions.isSyncing()) {
            status = "Saving "+queueLength+" change"+(queueLength>1?"s":"")+".";
        }
        else if (queueLength) {
            status = "You have "+queueLength+" unsaved change"+(queueLength>1?"s":"")+".";
        }
        else {
            status = "All saved.";
        }

        if (!revisions.isConnected()) {
            status = "Disconnected. " + status;
        }

        return (React.createElement("div", {id: "save-status"}, 
                React.createElement("span", null, status)
            ));
     },

    /**
     * Get the display name based on the user prop.
     * @return {string}
     */
    _renderDisplayName: function() {
        var user = this.props.user;
        if (!user) { return null; }

        if (user.get("firstname")) {
            return user.get("firstname");
        } else if (user.get("lastname")) {
            return user.get("lastname");
        } else if (user.get("email")) {
            return user.get("email").substring(0, user.get("email").indexOf("@"));
        } else {
            return UserConstants.DefaultDisplayName;
        }
    },

    /**
     * Callback to redirect to the user profile.
     */
    _onShowProfile: function(key, href, target) {
        this.transitionTo("profile");
    },

    /**
     * Callback to redirect and signout.
     */
    _onSignout: function(key, href, target) {
        window.location.href = "/user/signout";
    }

});

module.exports = Header;
