var React = require("react");
var BomActions = require("../actions/BomActions");
var BomFieldInput = require("./BomFieldInput.react");
var TypeConstants = require("../constants/TypeConstants");

var Button = require("react-bootstrap").Button;
var ButtonToolbar = require("react-bootstrap").ButtonToolbar;
var Glyphicon = require("react-bootstrap").Glyphicon;

var cx = require("react/lib/cx");

var BomField = React.createClass({displayName: "BomField",

  propTypes: {
    index: React.PropTypes.number.isRequired,
    attribute: React.PropTypes.object.isRequired,
    field: React.PropTypes.object.isRequired,
    onAddColumn: React.PropTypes.func.isRequired,
    onEditColumn: React.PropTypes.func.isRequired,
    readonly: React.PropTypes.bool
  },

  /**
   * @return {object}
   */
  render: function() {
    var attribute = this.props.attribute;

    return (
      React.createElement("th", {className: cx({
        "bom-field": true,
        "bom-field-boolean": this.props.field.get("typeId") === TypeConstants.BOOLEAN,
        "editing": false })}, 
        React.createElement("div", {className: "btn-add-column-wrapper btn-add-column-left btn-circle"}, 
          React.createElement(Button, {
            className: "btn-circle btn-add-column", 
            bsStyle: "primary", 
            onClick: this._onAddColumnBefore}, 
            React.createElement(Glyphicon, {
              glyph: "plus"})
          )
        ), 
        React.createElement("div", {className: "btn-add-column-wrapper btn-add-column-right btn-circle"}, 
          React.createElement(Button, {
            className: "btn-circle btn-add-column", 
            bsStyle: "primary", 
            onClick: this._onAddColumnAfter}, 
            React.createElement(Glyphicon, {
              glyph: "plus"})
          )
        ), 
        React.createElement("div", {className: "btn-group column-name"}, 
          attribute.name
        ), 
        React.createElement(ButtonToolbar, null, 
          React.createElement(Button, {className: "btn-nobg", onClick: this._onEditColumn}, 
            React.createElement(Glyphicon, {glyph: "pencil"})
          )
        )
      )
    );
  },

  _onAddColumnBefore: function(event) {
    this.props.onAddColumn(this.props.index);
  },

  _onAddColumnAfter: function(event) {
    this.props.onAddColumn(this.props.index+1);
  },

  _onEditColumn: function(index) {
    if (this.props.readonly) { return; }

    this.props.onEditColumn(this.props.index);
  },

});

module.exports = BomField;
