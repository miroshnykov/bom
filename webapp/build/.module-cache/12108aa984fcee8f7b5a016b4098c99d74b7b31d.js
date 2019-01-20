"use strict";

var React = require("react");
var RouteHandler = require("react-router").RouteHandler;
var SplitButton = require("react-bootstrap").SplitButton;
var MenuItem = require("react-bootstrap").MenuItem;

var UserMenu = React.createClass({displayName: "UserMenu",

  propTypes: {
    user: React.PropTypes.object.isRequired
  },

  /**
   * @return {object}
   */
  render: function() {
    var user = this.props.user;
    var name;
    var title;

    name = user.get("firstname") ? user.get("firstname") : user.get("lastname");
    title = "Welcome" + (name ? ", " + name : "");

    return (
      React.createElement("div", {className: "user-menu"}, 
        React.createElement(SplitButton, {bsStyle: "default", bsSize: "large", title: title, key: "product"}, 
          React.createElement(MenuItem, {eventKey: "profile"}, "My profile"), 
          React.createElement(MenuItem, {divider: true}), 
          React.createElement(MenuItem, {eventKey: "signout"}, "Sign out")
        )
      )
    );
  },

  _onCreate: function(event) {
  },

  _onSelect: function(event) {
  }

});

module.exports = UserMenu;
