var React = require("react");

var BomActions = require("../actions/BomActions");
var TextInput = require("../components/TextInput.react");
var TypeConstants = require("../constants/TypeConstants");
var Input = require('react-bootstrap').Input;

var BomItemField = React.createClass({displayName: "BomItemField",

  propTypes: {
    bomId: React.PropTypes.oneOfType([
      React.PropTypes.string.isRequired,
      React.PropTypes.number.isRequired
    ]),
    itemId: React.PropTypes.oneOfType([
      React.PropTypes.string.isRequired,
      React.PropTypes.number.isRequired
    ]),
    content: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
      React.PropTypes.bool
    ]),
    bomField: React.PropTypes.object,
    field: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      isEditing: false
    };
  },

  /**
   * @return {object}
   */
  render: function() {
    var content = this.props.content;
    var field = this.props.field;
    var item;

    if (this.state.isEditing) {
        switch (this.props.field.get("typeId")) {
            case TypeConstants.TEXT:
            case TypeConstants.NUMBER:
                item = this.renderTextInput(content, this._onSave);
                break;

            case TypeConstants.BOOLEAN:
                item = this.renderBooleanInput(content, this._onSave);
                break;
        }
    }
    else {
        switch (this.props.field.get("typeId")) {
            case TypeConstants.TEXT:
            case TypeConstants.NUMBER:
                item = this.renderText(content);
                break;

            case TypeConstants.BOOLEAN:
                item = this.renderBooleanInput(content, this._onSave);
                break;
        }
    }

    return (
        React.createElement("td", {onDoubleClick: this._onDoubleClick}, 
            item
        )
    );
  },

  renderText: function(content) {
    return (React.createElement("div", {className: "view"}, 
        React.createElement("label", null, content)));
  },

  renderTextInput: function(content, onSave) {
    return (React.createElement(TextInput, {
        className: "edit", 
        onSave: this._onSave, 
        value: content}));
  },

  // renderNumberInput: function() {

  // },

  renderBooleanInput: function(content, onSave) {
    return (React.createElement(Input, {
        type: "checkbox", labelClassName: "sr-only", 
        onChange: onSave.bind(this, !content), 
        checked: content, readOnly: true}));
  },

  _onDoubleClick: function(event) {
    if (this.props.readonly) { return; }

    this.setState({isEditing: true});
  },

  _onSave: function(value) {
    //validate the new value
    switch (this.props.field.get("typeId")) {
      case TypeConstants.TEXT: //"text"
        value = String(value);
        value = value.trim();
        break;
      case TypeConstants.NUMBER: //"number"
        value = Number(value);
        if (isNaN(value)) {
          //TODO show warning
          this.setState({isEditing: false});
          return;
        }
      case TypeConstants.BOOLEAN: //"boolean"
        //TODO
       break;
      default:
        //no op
    }

    if (value !== this.props.content) {
        BomActions.updateItem(
          this.props.bomId,
          this.props.itemId,
          _.clone(this.props.bomField),
          value);
    }

    this.setState({isEditing: false});
  },
});

module.exports = BomItemField;
