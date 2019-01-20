"use strict";

var _ = require("underscore");
var React = require("react");
var Button = require("react-bootstrap").Button;
var MenuItem = require("react-bootstrap").MenuItem;
var SplitButton = require("react-bootstrap").SplitButton;
var Input = require("react-bootstrap").Input;

var FieldConstants = require("constants/FieldConstants");
var TypeConstants = require("constants/TypeConstants");
var InputConstants = require("constants/InputConstants");
var FieldTypeStore = require("stores/FieldTypeStore");
var Modal = require("components/modals/Modal.jsx");

var AddColumnModal = React.createClass({

  propTypes: {
    index: React.PropTypes.number.isRequired,
    onConfirm: React.PropTypes.func.isRequired,
    fields: React.PropTypes.array.isRequired
  },

  getInitialState: function() {
    return {
      fieldId: FieldConstants.SELECT_FIELD.id,
      typeId: TypeConstants.TEXT,
      name: ""
    };
  },

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

    var dismissHeader = (
        <button type="button" className="close" data-dismiss="modal" tabIndex="-1">
            <span aria-hidden="true">&times;</span>
        </button>);
    var dismissFooter = (
        <button type="button" className="btn btn-default" data-dismiss="modal" tabIndex="2">
            Cancel
        </button>);

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
        <MenuItem
          className={result.disabled ? "disabled" : ""}
          key={result.id}
          eventKey={result.id}>
          {result.name}</MenuItem>
      );
    });

    fieldsElement = (
      <div className="form-group col-md-12">
        <label className="control-label"><span>Attribute</span></label>
        <div>
          <SplitButton
            bsStyle="default"
            title={fieldsTitle}
            onSelect={this._onSelectField}>
            {fieldsOptions}
            <MenuItem divider />
            <MenuItem eventKey={FieldConstants.CUSTOM_FIELD.id}>New Attribute</MenuItem>
          </SplitButton>
        </div>
      </div>);

    type = FieldTypeStore.get( this.state.typeId );
    typesTitle = type.get("name");

    // create the list of field types
    typesOptions = FieldTypeStore.map(function(result) {
      return (
        <MenuItem
          key={result.id || result.cid}
          eventKey={result.id || result.cid}>{result.get("name")}</MenuItem>
      );
    });

    typesElement = (
      <div className="form-group col-md-4">
        <label className="control-label"><span>Value Type</span></label>
        <div>
          <SplitButton
            bsStyle="default"
            title={typesTitle}
            onSelect={this._onSelectType}
            disabled={this.state.fieldId !== FieldConstants.CUSTOM_FIELD.id} >
            {typesOptions}
          </SplitButton>
        </div>
      </div>);

    nameInput = (
      <Input
        groupClassName="col-md-4"
        label="Display Name"
        type="text"
        onChange={this._onChangeName}
        onKeyUp={this._onKeyUp}
        value={this.state.name} />);

    return (
        <Modal
            saveLabel="Add"
            dismissLabel="Cancel"
            onConfirm={this._onSave}
            title="Add column"
            className="modal-add-column">
            <form>
                <div className="row">
                    {fieldsElement}
                    {typesElement}
                    {nameInput}
                </div>
            </form>
        </Modal>
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
      if (!field || field.disabled) { return; }

      name = field.name;
      typeId = field.typeId;
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

  _onKeyUp: function(event) {
    switch(event.keyCode) {
      case InputConstants.ENTER:
        this._onSave();
        event.preventDefault();
        break;

      case InputConstants.ESC:
        this.props.onCancel();
        event.preventDefault();
        break;
    }
  },

  _onSave: function(event) {
    this.props.onConfirm(
      this.state.fieldId === FieldConstants.CUSTOM_FIELD.id ? undefined : this.state.fieldId,
      this.state.typeId,
      this.state.name,
      this.props.index);
  }

});

module.exports = AddColumnModal;
