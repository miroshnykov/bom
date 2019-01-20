var React = require('react');

var Input = require('react-bootstrap').Input;
var SplitButton = require('react-bootstrap').SplitButton;
var MenuItem = require('react-bootstrap').MenuItem;
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;
var Button = require('react-bootstrap').Button;

var ENTER_KEY_CODE = 13;

//TODO move to constants?
var CUSTOM_FIELD = {
  id: "_custom",
  name: "Custom",
  type: undefined
}

var SELECT_FIELD = {
  id: "_select",
  name: "Select a field",
  type: undefined
}

var BomFieldInput = React.createClass({displayName: "BomFieldInput",

  propTypes: {
    onSave: React.PropTypes.func.isRequired,
    onSkip: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func,
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

    if (field && field.id) {
      id = field.id;
      name = field.name || "";
      type = field.type;
    }
    else {
      id = SELECT_FIELD.id;
      name = SELECT_FIELD.name;
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
    var allFields = this.props.allFields;
    var allTypes = this.props.allTypes;
    var id = this.state.id;
    var name = this.state.name;
    var type = this.state.type;
    var fieldOptions;
    var typeOptions;
    var nameInput;
    var typeSelect;

    //create the list of field names
    fieldOptions = [];
    for( var key in allFields ) {
      if (allFields.hasOwnProperty(key)) {
        fieldOptions.push( React.createElement(MenuItem, {key: allFields[key].id, eventKey: allFields[key].id}, allFields[key].name) );
      }
    }

    typeOptions = [];
    for( var key in allTypes ) {
      if (allTypes.hasOwnProperty(key)) {
        typeOptions.push( React.createElement(MenuItem, {key: allTypes[key].id, eventKey: allTypes[key].id}, allTypes[key].name) );
      }
    }

    if (id === CUSTOM_FIELD.id) {
      nameInput = React.createElement(Input, {
        label: "Field Name", 
        labelClassName: "sr-only", 
        className: "col-md-1", 
        type: "text", 
        onChange: this._onChangeName, 
        value: name})
    }

    if (id !== SELECT_FIELD.id) {
      typeSelect = React.createElement(SplitButton, {
        bsStyle: "default", 
        title: type ? allTypes[type].name : "Select a data type", 
        onSelect: this._onSelectType, 
        disabled: id !== CUSTOM_FIELD.id}, 
        typeOptions
      )
    }

    return (
      React.createElement("div", null, 
        React.createElement(SplitButton, {
          bsStyle: "default", 
          title: id !== CUSTOM_FIELD.id ? name : CUSTOM_FIELD.name, 
          onSelect: this._onSELECT_FIELD}, 
          fieldOptions, 
          React.createElement(MenuItem, {divider: true}), 
          React.createElement(MenuItem, {eventKey: CUSTOM_FIELD.id}, "Custom")
        ), 
        nameInput, 
        typeSelect, 
        React.createElement(ButtonToolbar, null, 
          React.createElement(Button, {
            bsStyle: "danger", 
            onClick: this._onSkip}, 
            "Skip"
          ), 
          this.props.onCancel ? React.createElement(Button, {
            bsStyle: "default", 
            onClick: this._onCancel}, 
            "Cancel"
          ) : undefined, 
          React.createElement(Button, {
            bsStyle: "primary", 
            onClick: this._onSave, 
            disabled: id === SELECT_FIELD.id || (id === CUSTOM_FIELD.id && (!name || !type))}, 
            "Save"
          )
        )
      )
    );
  },

  _onSELECT_FIELD: function(id) {
    var field;

    if (id === CUSTOM_FIELD.id) {
      field = CUSTOM_FIELD;
      this.setState({
        id: field.id,
        name: "",
        type: field.type
      })
    }
    else {
      field = this.props.allFields[id];
      this.setState({
        id: field.id,
        name: field.name,
        type: field.type
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
    this.setState(SELECT_FIELD);
  },

  _onCancel: function() {
    this.props.onCancel()
    this.setState(SELECT_FIELD);
  },

  _onSkip: function() {
    this.props.onSkip();
    this.setState(SELECT_FIELD);
  }

});

module.exports = BomFieldInput;
