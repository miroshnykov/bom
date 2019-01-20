"use strict";

var React = require("react");

var Input = require("react-bootstrap").Input;
var SplitButton = require("react-bootstrap").SplitButton;
var MenuItem = require("react-bootstrap").MenuItem;
var ButtonToolbar = require("react-bootstrap").ButtonToolbar;
var Button = require("react-bootstrap").Button;

var FieldConstants = require("../constants/FieldConstants");
var TypeConstants = require("../constants/TypeConstants");

var BomFieldInput = React.createClass({displayName: "BomFieldInput",

  propTypes: {
    onSave: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func.isRequired,
    onRemove: React.PropTypes.func.isRequired,
    allFields: React.PropTypes.object.isRequired,
    allTypes: React.PropTypes.object.isRequired,
    field: React.PropTypes.object
  },

  getInitialState: function(props) {
    props = props || this.props;

    var id;
    var name;
    var type;
    var field = props.field;

    if (field) {
      id = field.id;
      name = field.get("name") || "";
      type = field.get("typeId");
    }
    else {
      id = FieldConstants.SELECT_FIELD.id;
      name = FieldConstants.SELECT_FIELD.name;
      type = undefined;
    }

    return {
      id: id,
      name: name,
      type: type
    };
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState(this.getInitialState(nextProps));
  },

  /**
   * @return {object}
   */
  render: function() /*object*/ {
    // var allFields = this.props.allFields;
    // var allTypes = this.props.allTypes;
    var id = this.state.id;
    var name = this.state.name;
    var type = this.state.type;
    var fieldOptions;
    var typeOptions;
    var nameInput;
    var typeSelect;
    var removeButton;

    //create the list of field names
    fieldOptions = this.props.allFields.map(function(result) {
      return (
        React.createElement(MenuItem, {
          key: result.id || result.cid, 
          eventKey: result.id || result.cid}, result.get("name"))
      );
    });

    typeOptions = this.props.allTypes.map(function(result) {
      return (
        React.createElement(MenuItem, {
          key: result.id || result.cid, 
          eventKey: result.id || result.cid}, result.get("name"))
      );
    });

    if (id === FieldConstants.CUSTOM_FIELD.id) {
      nameInput = React.createElement(Input, {
        label: "Field Name", 
        labelClassName: "sr-only", 
        className: "col-md-1", 
        type: "text", 
        onChange: this._onChangeName, 
        value: name})
    }

    if (id !== FieldConstants.SELECT_FIELD.id) {
      typeSelect = React.createElement(SplitButton, {
        bsStyle: "default", 
        title: type ? this.props.allTypes.get(type).get("name") : "Select a data type", 
        onSelect: this._onSelectType, 
        disabled: id !== FieldConstants.CUSTOM_FIELD.id}, 
        typeOptions
      )

      if (this.props.field) {
        removeButton = React.createElement(Button, {
          bsStyle: "danger", 
          onClick: this._onRemove}, 
          "Remove"
        );
      }
    }

    return (
      React.createElement("div", null, 
        React.createElement("form", {className: "form-inline"}, 
          React.createElement(SplitButton, {
            bsStyle: "default", 
            title: id === FieldConstants.CUSTOM_FIELD.id ? FieldConstants.CUSTOM_FIELD.name : name, 
            onSelect: this._onSELECT_FIELD}, 
            fieldOptions, 
            React.createElement(MenuItem, {divider: true}), 
            React.createElement(MenuItem, {eventKey: FieldConstants.CUSTOM_FIELD.id}, "Custom")
          ), 
          nameInput, 
          typeSelect, 
          React.createElement(ButtonToolbar, {className: "pull-right"}, 
            removeButton, 
            React.createElement(Button, {
              bsStyle: "default", 
              onClick: this._onCancel}, 
              "Cancel"
            ), 
            React.createElement(Button, {
              bsStyle: "primary", 
              onClick: this._onSave, 
              disabled: id === FieldConstants.SELECT_FIELD.id ||
                (id === FieldConstants.CUSTOM_FIELD.id &&
                (!name || !type))}, 
              "Save"
            )
          )
        )
      )
    );
  },

  _onSELECT_FIELD: function(id) {
    var field;

    if (id === FieldConstants.CUSTOM_FIELD.id) {
      this.setState({
        id: FieldConstants.CUSTOM_FIELD.id,
        name: "",
        type: FieldConstants.CUSTOM_FIELD.type
      })
    }
    else {
      field = this.props.allFields.get(id);
      this.setState({
        id: field.id,
        name: field.get("name"),
        type: field.get("typeId")
      })
    }
  },

  /**
   * @param {object} event
   */
  _onChangeName: function(/*object*/ event) {
    this.setState({
      name: event.target.value
    });
  },

  _onSelectType: function(id) {
    this.setState({
      type: id
    })
  },

  _onSave: function() {
    this.props.onSave(this.state.id, this.state.name, this.state.type);
    this.setState(FieldConstants.SELECT_FIELD);
  },

  _onCancel: function() {
    this.props.onCancel()
    this.setState(FieldConstants.SELECT_FIELD);
  },

  _onRemove: function() {
    this.props.onRemove();
    this.setState(FieldConstants.SELECT_FIELD);
  }

});

module.exports = BomFieldInput;
