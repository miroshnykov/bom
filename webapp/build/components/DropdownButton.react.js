"use strict";

var React = require("react");
var DropdownStateMixin = require("react-bootstrap").DropdownStateMixin;
var Button = require("react-bootstrap").Button;
var ButtonGroup = require("react-bootstrap").ButtonGroup;
var DropdownMenu = require("react-bootstrap").DropdownMenu;
var MenuItem = require("react-bootstrap").MenuItem;

var cx = require("react/lib/cx");

/**
 * A component with a Button and a DropdownMenu.
 */
var DropdownButton = React.createClass({displayName: "DropdownButton",
  mixins: [DropdownStateMixin],

  propTypes: {
    id: React.PropTypes.string,
    glyphicon: React.PropTypes.string,
    title: React.PropTypes.string,
    pullRight: React.PropTypes.bool,
    bsStyle: React.PropTypes.string,
    trigger: React.PropTypes.string
  },

  render: function() {
    var glyphicon;
    var buttonGroupId;
    var buttonId;

    //generate the glyphicon if it is specified
    if (this.props.glyphicon) {
      glyphicon = React.createElement("span", {className: "glyphicon glyphicon-" + this.props.glyphicon})
    }

    //get the buttonGroupId or default if not specified
    buttonGroupId = this.props.id ? this.props.id : "dropdown-menu";

    //get the buttonId or default if not specified
    buttonId = this.props.id ? this.props.id + "-button" : "dropdown-menu-button";

    //TODO pass className

    return (
      React.createElement(ButtonGroup, {
        id: buttonGroupId, 
        className: cx({
          "open": this.state.open
        })}, 
        React.createElement(Button, {
          id: buttonId, 
          bsStyle: this.props.bsStyle, 
          ref: "dropdownButton", 
          className: "dropdown-toggle btn-nobg", 
          onClick: !this.props.trigger || this.props.trigger === "click" ? this._toggle : undefined, 
          onMouseOver: this.props.trigger === "hover" ? this._open : undefined, 
          onMouseLeave: this.props.trigger === "hover" ? this._close : undefined}, 
          this.props.title, 
          glyphicon
        ), 
        React.createElement(DropdownMenu, {
          ref: "menu", 
          "aria-labelledby": buttonId, 
          pullRight: !!this.props.pullRight, 
          onMouseOver: this.props.trigger === "hover" ? this._open : undefined, 
          onMouseLeave: this.props.trigger === "hover" ? this._close : undefined}, 
          this.props.children.map(this._renderMenuItem)
        )
      )
    );
  },

  /**
   * Callback to close the DropdownMenu when the user clicks a MenuItem.
   */
  _toggle: function (event) {
    event.preventDefault();
    this.setDropdownState(!this.state.open);
  },

  _open: function (event) {
    event.preventDefault();

    if (this.state.closeId) {
        clearTimeout(this.state.closeId);
        this.setState({
            closeId: undefined
        })
    }

    this.setDropdownState(true);
  },

  _close: function (event) {
    event.preventDefault();
    this.setState({
        closeId: setTimeout(function() {
            this.setDropdownState(false);
            this.setState({
                closeId: undefined
            });
        }.bind(this), 1000)
    })
  },

  /**
   * Extend and render a MenuItem
   */
  _renderMenuItem: function(item) {
    var origSelect = item.props.onSelect;

    item.props.onSelect = function(key, href, target) {
      this.setDropdownState(false);
      if (origSelect) {
        origSelect(key, href, target);
      }
    }.bind(this);

    return item;
  }

});

module.exports = DropdownButton;
