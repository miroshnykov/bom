var React = require("react");

var TextInput = require("../components/TextInput.react");
var TypeConstants = require("../constants/TypeConstants");
var Input = require('react-bootstrap').Input;
var Glyphicon = require('react-bootstrap').Glyphicon;

var cx = require("react/lib/cx");

var BomItemField = React.createClass({displayName: "BomItemField",

    propTypes: {
        value: React.PropTypes.object,
        field: React.PropTypes.object.isRequired,
        onSave: React.PropTypes.func.isRequired,
        readonly: React.PropTypes.bool
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
        var value = this.props.value;
        var content = value ? value.get("content") : undefined;
        var field = this.props.field;
        var item;
        var spinner;

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

        // Show spinner if the value is read only but not because of parent
        if (!this.props.readonly && this._isReadOnly()) {
            spinner = (
                React.createElement(Glyphicon, {
                    className: cx({
                        "glyphicon-spin" : value.isSyncing(),
                        "pull-right": true}), 
                    bsSize: "small", 
                    bsStyle: "default", 
                    glyph: "repeat"}));
        }

        return (
            React.createElement("td", {className: cx( {
                  "edit": this.state.isEditing,
                  "readonly": this._isReadOnly(),
                  "invalid": value && !value.isValid()
                }), 
                onDoubleClick: this._onDoubleClick}, 
                spinner, 
                item
            )
        );
    },

    /**
     * Render a text value.
     */
    renderText: function(content) {
        return (
            React.createElement("div", {className: "view"}, 
                React.createElement("label", null, content)
            ));
    },

    /**
     * Render input field for a text value.
     */
    renderTextInput: function(content, onSave) {
        return (
            React.createElement(TextInput, {
                className: "edit", 
                onSave: this._onSave, 
                onCancel: this._onCancel, 
                value: content}));
    },

    /**
     * Render input field for a boolean value.
     */
    renderBooleanInput: function(content, onSave) {
        return (
            React.createElement(Input, {
                type: "checkbox", labelClassName: "sr-only", 
                onChange: onSave.bind(this, !content), 
                checked: content, readOnly: true}));
    },

    /**
     * Check if value is read only
     * Readonly if readonly is true in properties
     * or if the value is dirty or new
     */
    _isReadOnly: function() {
        var value = this.props.value;
        return this.props.readonly || (value && (value.isDirty() || value.isNew()));
    },

    /**
     * Edit on doubleclick
     */
    _onDoubleClick: function(event) {
        // If read only, do nothing
        if (this._isReadOnly()) { return; }

        this.setState({isEditing: true});
    },

    /**
     * Cancel editing value
     */
    _onCancel: function() {
        this.setState({isEditing: false});
    },

    /**
     * Save the value
     */
    _onSave: function(newContent) {
        var field = this.props.field;
        var content = this.props.value ? this.props.value.get("content") : undefined;

        // Validate and filter content
        newContent = this._validate(newContent, field.get("typeId"));

        // Save only if content change
        if (newContent !== content) {
            this.props.onSave(field.id || field.cid, newContent);
        }

        this.setState({isEditing: false});
    },

    /**
     * Validate content for a specified value type
     */
    _validate: function(content, typeId) {
        switch (typeId) {

            case TypeConstants.TEXT:
            case TypeConstants.NUMBER:
              content = String(content);
              content = content.trim();
              break;

            case TypeConstants.BOOLEAN:
              break;
            default:
              //no op
        }

        return content;
    }
});

module.exports = BomItemField;
