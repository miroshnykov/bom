"use strict";

var _ = require("underscore");
var React = require("react");
var Toggle = require("react-toggle");
var Glyphicon = require("react-bootstrap").Glyphicon;

var TextInput = require("components/TextInput.jsx");
var TypeConstants = require("constants/TypeConstants");
var FieldConstants = require("constants/FieldConstants");

var cx = require("react/lib/cx");

var BomItemField = React.createClass({

    propTypes: {
        value: React.PropTypes.object,
        field: React.PropTypes.object,
        bom: React.PropTypes.object,
        onNext: React.PropTypes.func,
        onSave: React.PropTypes.func.isRequired,
        readonly: React.PropTypes.bool
    },

    getInitialState: function() {
        return {
            isEditing: false
        };
    },

    componentDidMount: function() {
        if (this.props.value) {
            this.props.value.on("change:state", this.onChange);
            this.props.value.on("change:content", this.onChange);
            this.props.value.on("change:alerts", this.onChange);
        }
    },

    componentWillUnmount: function() {
        if (this.props.value) {
            this.props.value.off("change:state", this.onChange);
            this.props.value.off("change:content", this.onChange);
            this.props.value.off("change:alerts", this.onChange);
        }
    },

    componentWillReceiveProps: function(nextProps) {
        if (this.props.value !== nextProps.value) {
            if (this.props.value) {
                this.props.value.off("change:state", this.onChange);
                this.props.value.off("change:content", this.onChange);
                this.props.value.off("change:alerts", this.onChange);
            }
            if (nextProps.value) {
                nextProps.value.on("change:state", this.onChange);
                nextProps.value.on("change:content", this.onChange);
                nextProps.value.on("change:alerts", this.onChange);
            }
        }
    },

    onChange: function() {
        this.forceUpdate();
    },

    render: function() {
        var value = this.props.value;
        var field = this.props.field;
        var content = value ? value.get("content") : (field ? field.getDefault() : undefined);
        var typeId = field ? field.get("typeId") : undefined;
        var element;

        if (this.state.isEditing) {
            switch (typeId) {
                case TypeConstants.TEXT:
                case TypeConstants.NUMBER:
                    element = this.renderTextInput(content, this.onSave);
                    break;

                case TypeConstants.BOOLEAN:
                    element = this.renderBooleanInput(content, this.onSave);
                    break;
            }
        }
        else {
            switch (typeId) {
                case TypeConstants.TEXT:
                case TypeConstants.NUMBER:
                    element = this.renderText(content);
                    break;

                case TypeConstants.BOOLEAN:
                    element = this.renderBooleanInput(content, this.onSave);
                    break;
            }
        }

        return (
            <td className={cx( {
                  "edit": this.state.isEditing,
                  "readonly": this.isReadOnly(),
                  "invalid": value && !_.isEmpty(value.get("alerts"))
                })}
                onClick={this.onClick} >
                {element}
            </td>
        );
    },

    /**
     * Render a text value.
     */
    renderText: function(content) {
        return (
            <span>{content}</span>);
    },

    /**
     * Render input field for a text value.
     */
    renderTextInput: function(content, onSave) {
        return (
            <TextInput
                className="edit"
                onSave={this.onSave}
                onNext={this.onNext}
                onCancel={this.onCancel}
                value={content}
                maxLength={255} />);
    },

    /**
     * Render input field for a boolean value.
     */
    renderBooleanInput: function(content, onSave) {
        var checked = content;
        var fieldId = this.props.field ? this.props.field.id : undefined;
        var checkedLabel;
        var uncheckedLabel;
        var hasFeedback = true;

        switch(fieldId) {
            case FieldConstants.DNI:
                checkedLabel = "Include";
                uncheckedLabel = "DNI";
                break;
            case FieldConstants.SMT:
                checked = content === undefined ? true : content;
                checkedLabel = "SMT";
                uncheckedLabel = "TH";
                hasFeedback = false;
                break;
            case FieldConstants.SIDE:
                checked = content === undefined ? true : content;
                checkedLabel = "Top";
                uncheckedLabel = "Bottom";
                hasFeedback = false;
                break;
        }

        return (
            <Toggle
                checked={!!checked}
                checkedLabel={checkedLabel}
                uncheckedLabel={uncheckedLabel}
                hasFeedback={hasFeedback}
                onChange={function(event) { onSave(event.target.checked); }} />
        );
    },

    setEditing: function(editing) {
        this.setState({
            isEditing: editing
        });
    },

    isReadOnly: function() {
        var value = this.props.value;
        return this.props.readonly || (value && value.isStateSending());
    },

    onClick: function(event) {
        if (this.isReadOnly()) { return; }
        if (this.props.field && this.props.field.isBoolean()) { return; }

        this.setState({isEditing: true});
    },

    onCancel: function() {
        this.setState({isEditing: false});
    },

    onSave: function(newContent) {
        if (this.isReadOnly()) { return; }

        var value = this.props.value;
        var content = value ? value.get("content") : "";
        var field = this.props.field;

        if (newContent === content) {
            this.setState({isEditing: false});
            return;
        }

        this.props.onSave(newContent, field.id);

        this.setState({isEditing: false});
    },

    onNext: function() {
        var field = this.props.field;

        if (this.props.onNext) {
            this.props.onNext(field.id || field.cid);
        }
    },
});

module.exports = BomItemField;
