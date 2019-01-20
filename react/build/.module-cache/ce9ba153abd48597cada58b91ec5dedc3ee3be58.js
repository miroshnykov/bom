var React = require("react");
var Modal = require("react-bootstrap").Modal;
var Button = require("react-bootstrap").Button;
var MenuItem = require("react-bootstrap").MenuItem;
var SplitButton = require("react-bootstrap").SplitButton;
var Input = require("react-bootstrap").Input;

var FieldConstants = require("../constants/FieldConstants");
var TypeConstants = require("../constants/TypeConstants");

var EditColumnModal = React.createClass({displayName: "EditColumnModal",

  propTypes: {
    index: React.PropTypes.number.isRequired,
    fields: React.PropTypes.array.isRequired,
    allTypes: React.PropTypes.object.isRequired,
    onCancel: React.PropTypes.func.isRequired,
    onSave: React.PropTypes.func.isRequired,
    onRemove: React.PropTypes.func,
    column: React.PropTypes.object,
    typeId: React.PropTypes.number
  },

  getInitialState: function() {
    if (this.props.column) {
      return {
        fieldId: this.props.column.fieldId,
        typeId: this.props.typeId,
        name: this.props.column.name
      };
    }
    else {
      return {
        fieldId: FieldConstants.SELECT_FIELD.id,
        typeId: TypeConstants.TEXT_ID,
        name: ""
      };
    }
  },

  /**
   * @return {object}
   */
  render: function() {
    var field;
    var fieldsElement;
    var fieldsOptions;
    var fieldsTitle;
    var nameInput;
    var type;
    var typesTitle;
    var typesOptions;
    var typesElement;

    if (this.state.fieldId === FieldConstants.SELECT_FIELD.id) {
      fieldsTitle = FieldConstants.SELECT_FIELD.name;
    }
    else if (this.state.fieldId === FieldConstants.CUSTOM_FIELD.id) {
      fieldsTitle = FieldConstants.CUSTOM_FIELD.name;
    }
    else {
      field = _.find(this.props.fields, function(result) {
        return result.id === this.state.fieldId;
      }, this);
      fieldsTitle = field.name;
    }

    // create the list of fields
    fieldsOptions = this.props.fields.map(function(result) {
      return (
        React.createElement(MenuItem, {
          className: result.disabled ? "disabled" : "", 
          key: result.id, 
          eventKey: result.id}, result.name)
      );
    });

    fieldsElement = (
      React.createElement("div", {className: "form-group col-md-4"}, 
        React.createElement("label", {className: "control-label"}, React.createElement("span", null, "Field")), 
        React.createElement("div", null, 
          React.createElement(SplitButton, {
            bsStyle: "default", 
            title: fieldsTitle, 
            onSelect: this._onSelectField}, 
            fieldsOptions, 
            React.createElement(MenuItem, {divider: true}), 
            React.createElement(MenuItem, {eventKey: FieldConstants.CUSTOM_FIELD.id}, FieldConstants.CUSTOM_FIELD.name)
          )
        )
      ));

    type = this.props.allTypes.get( this.state.typeId );
    typesTitle = type.get("name");

    // create the list of field types
    typesOptions = this.props.allTypes.map(function(result) {
      return (
        React.createElement(MenuItem, {
          key: result.id || result.cid, 
          eventKey: result.id || result.cid}, result.get("name"))
      );
    });

    typesElement = (
      React.createElement("div", {className: "form-group col-md-3"}, 
        React.createElement("label", {className: "control-label"}, React.createElement("span", null, "Value Type")), 
        React.createElement("div", null, 
          React.createElement(SplitButton, {
            bsStyle: "default", 
            title: typesTitle, 
            onSelect: this._onSelectType, 
            disabled: this.state.fieldId !== FieldConstants.CUSTOM_FIELD.id}, 
            typesOptions
          )
        )
      ));

    nameInput = (
      React.createElement(Input, {
        groupClassName: "col-md-5", 
        label: "Column Name", 
        type: "text", 
        onChange: this._onChangeName, 
        value: this.state.name}));

    return (
      React.createElement(Modal, React.__spread({},  this.props, 
        {onRequestHide: this.props.onCancel, 
        bsStyle: "primary", 
        title: "Edit a column", 
        animation: false, 
        className: "modal-add-column"}), 
        React.createElement("div", {className: "modal-body"}, 
          React.createElement("form", null, 
            React.createElement("div", {className: "row"}, 
              fieldsElement, 
              typesElement, 
              nameInput
            )
          )
        ), 
        React.createElement("div", {className: "modal-footer"}, 
          React.createElement(Button, {className: "pull-left", bsStyle: "danger", onClick: this._onRemove}, "Remove"), 
          React.createElement(Button, {onClick: this.props.onCancel}, "Close"), 
          React.createElement(Button, {bsStyle: "primary", onClick: this._onSave}, "Save")
        )
      )
      );
  },

  _onSelectField: function(id) {
    var typeId;
    var name;
    var field;

    if (id !== FieldConstants.CUSTOM_FIELD.id) {

      field = _.find(this.props.fields, function(result) {
        return result.id === id;
      }, this);
      if (!field) { return; }

      name = field.name;
      typeId = field.typeId; //TODO rename to typeIs
    }
    else {
      typeId = TypeConstants.TEXT;
    }

    this.setState({
      fieldId: id,
      name: name,
      typeId: typeId
    });
  },

  _onSelectType: function(id) {
    this.setState({
      typeId: id
    })
  },

  _onChangeName: function(event) {
    this.setState({
      name: event.target.value
    });
  },

  _onSave: function(event) {
    this.props.onSave(
      this.state.fieldId === FieldConstants.CUSTOM_FIELD.id ? undefined : this.state.fieldId,
      this.state.typeId,
      this.state.name,
      this.props.index,
      this.props.column.id || this.props.column.cid);
  },

  _onRemove: function(event) {
    this.props.onRemove(this.props.index);
  }

});

module.exports = EditColumnModal;
