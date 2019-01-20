var React = require("react");

var BomActions = require("../actions/BomActions");
var TextInput = require("../components/TextInput.react");
var TypeConstants = require("../constants/TypeConstants");
var Input = require('react-bootstrap').Input;

var BomItemField = React.createClass({displayName: "BomItemField",

  propTypes: {
    bomId: React.PropTypes.any.isRequired,
    itemId: React.PropTypes.any.isRequired,
    content: React.PropTypes.any,
    field: React.PropTypes.object.isRequired,
    headerName: React.PropTypes.string.isRequired,
    attribute: React.PropTypes.object,
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
        switch (field.get("typeId")) {
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
        switch (field.get("typeId")) {
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
            React.createElement("label", null, content)
        ));
  },

  renderTextInput: function(content, onSave) {
    return (React.createElement(TextInput, {
        className: "edit", 
        onSave: this._onSave, 
        value: content}));
  },

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

  _onSave: function(content) {
    var attribute;

    // validate the new content
    switch (this.props.field.get("typeId")) {
      case TypeConstants.TEXT: //"text"
        content = String(content);
        content = content.trim();
        break;
      case TypeConstants.NUMBER: //"number"
        content = Number(content);
        //if (isNaN(content)) {
          //TODO show warning
          //this.setState({isEditing: false});
          //return;
        //}
      case TypeConstants.BOOLEAN: //"boolean"
        break;
      default:
        //no op
    }

    //TODO use a different method for new attribute, clearer
    if (this.props.attribute) {
        attribute = {
            id: this.props.attribute.id || this.props.attribute.cid
        }
    }
    else {
        attribute = {
            fieldId: this.props.field.id || this.props.field.cid,
            name: this.props.headerName
        }
    }

    if (content !== this.props.content) {
        BomActions.updateItem(
          this.props.bomId,
          this.props.itemId,
          attribute,
          content);
    }

    this.setState({isEditing: false});
  },
});

module.exports = BomItemField;
