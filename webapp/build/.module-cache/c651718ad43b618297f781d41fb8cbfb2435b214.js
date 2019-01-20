"use strict";

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
        header: React.PropTypes.object.isRequired,
        field: React.PropTypes.object.isRequired,
        onAddColumn: React.PropTypes.func.isRequired,
        onEditColumn: React.PropTypes.func.isRequired,
        readonly: React.PropTypes.bool
    },

    /**
     * @return {object}
     */
    render: function() {
        var header = this.props.header;
        var attribute = this.props.header ? this.props.header.attribute : undefined;
        var spinner;

        // Show spinner if the value is read only but not because of parent
        if (!this.props.readonly && this._isReadOnly()) {
            spinner = (
                React.createElement(Glyphicon, {
                    className: cx({
                        "glyphicon-spin" : attribute && attribute.isSyncing(),
                        "pull-right": true
                    }), 
                    bsSize: "small", 
                    bsStyle: "default", 
                    glyph: "repeat"}));
        }

        return (
            React.createElement("th", {className: cx({
                "bom-field": true,
                "bom-field-boolean": this.props.field.get("typeId") === TypeConstants.BOOLEAN,
                "editing": false,
                "readonly": this._isReadOnly() })}, 
                spinner, 
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
                    header.name
                ), 
                React.createElement(ButtonToolbar, null, 
                    React.createElement(Button, {className: "btn-nobg", onClick: this._onEditColumn, disabled: this._isReadOnly()}, 
                        React.createElement(Glyphicon, {glyph: "pencil"})
                    )
                )
            )
        );
    },

    /**
     * Check if value is read only
     */
    _isReadOnly: function() {
        var attribute = this.props.header ? this.props.header.attribute : undefined;
        // TODO need to pass attribute object in case it's saving
        return this.props.readonly || (attribute && (attribute.isNew() || attribute.isDirty()));
    },

    _onAddColumnBefore: function(event) {
        this.props.onAddColumn(this.props.index);
    },

    _onAddColumnAfter: function(event) {
        this.props.onAddColumn(this.props.index+1);
    },

    _onEditColumn: function(index) {
        this.props.onEditColumn(this.props.index);
    },

});

module.exports = BomField;
