"use strict";

var React = require("react");
var Input = require("react-bootstrap").Input;

var InputConstants = require("../constants/InputConstants");

var TextInput = React.createClass({displayName: "TextInput",

    propTypes: {
        type: React.PropTypes.string,
        label: React.PropTypes.string,
        id: React.PropTypes.string,
        value: React.PropTypes.string,
        placeholder: React.PropTypes.string,
        help: React.PropTypes.string,
        error: React.PropTypes.string,
        autoFocus: React.PropTypes.bool,
        hasFeedback: React.PropTypes.bool,
        className: React.PropTypes.string,
        groupClassName: React.PropTypes.string,
        wrapperClassName: React.PropTypes.string,
        onSave: React.PropTypes.func,
        onChange: React.PropTypes.func,
        onCancel: React.PropTypes.func,
        onNext: React.PropTypes.func,
        validate: React.PropTypes.func
    },

    getInitialState: function(props) {
        props = props || this.props;

        return {
            value: props.value || ""
        };
    },

    getInputDOMNode: function() {
        return this.refs.input.getInputDOMNode();
    },

    componentDidMount: function() {
        var input = this.getInputDOMNode();
        input.focus();
        input.select();
    },

    getValue: function() {
        return this.state.value;
    },

    /**
     * @return {object}
     */
    render: function() /*object*/ {
        return (
            React.createElement(Input, {
                ref: "input", 
                label: this.props.label, 
                labelClassName: "sr-only", 
                type: this.props.type || "text", 
                className: this.props.className, 
                id: this.props.id, 
                placeholder: this.props.placeholder, 
                onBlur: this._onSave, 
                onChange: this._onChange, 
                onKeyDown: this._onKeyDown, 
                value: this.state.value, 
                autoFocus: this.props.autoFocus, 
                help: this.props.error ? this.props.error : this.props.help, 
                bsStyle: this.props.error ? "error" : undefined, 
                hasFeedback: this.props.hasFeedback, 
                wrapperClassName: this.props.wrapperClassName, 
                groupClassName: this.props.groupClassName})
        );
    },

    /**
     * Invokes the callback passed in as onSave, allowing this component to be
     * used in different ways.
     */
    _onSave: function() {
        if (this.props.validate) {
            this.props.validate(this.state.value);
        }

        if (!this.props.onSave) { return; }
        this.props.onSave(this.state.value);
    },

    /**
     * @param {object} event
     */
    _onChange: function(/*object*/ event) {
        if (this.props.onChange) {
            this.props.onChange(event.target.value);
        }

        this.setState({
            value: event.target.value
        });
    },

    _onCancel: function() {
        if (!this.props.onCancel) { return; }
        this.props.onCancel();
    },

    _onKeyDown: function(event) {
        switch(event.keyCode) {
            case InputConstants.ENTER:
                // Do nothing for multiline textarea
                if (this.props.type === "textarea") { return; }

                // Save for single line input
                this._onSave();
                event.preventDefault();
                break;

            case InputConstants.ESC:
                this._onCancel();
                event.preventDefault();
                break;

            case InputConstants.TAB:
                this._onSave();
                if (this.props.onNext) {
                    this.props.onNext();
                }
                event.preventDefault();
                break;
        }
    }
});

module.exports = TextInput;
