"use strict";

var React = require("react");
var _ = require("underscore");
var Mousetrap = require("mousetrap");
var cx = require("react/lib/cx");

var InputConstants = require("constants/InputConstants");

var ValidatedInput = React.createClass({

    propTypes: {
        name: React.PropTypes.string.isRequired,
        value: React.PropTypes.string,
        onChange: React.PropTypes.func,
        onEnter: React.PropTypes.func,
        onBlur: React.PropTypes.func,
        label: React.PropTypes.string,
        placeholder: React.PropTypes.string,
        type: React.PropTypes.string,
        errorLabel: React.PropTypes.string,
        displayFeedback: React.PropTypes.bool,
        icon: React.PropTypes.node,
        autoFocus: React.PropTypes.bool,
        autoComplete: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.bool
        ]),
        rows: React.PropTypes.number,
        shortcuts: React.PropTypes.object,
        disabled: React.PropTypes.bool,
        formGroup: React.PropTypes.bool
    },

    getInitialState: function() {
        return {
            value: this.props.value
        };
    },

    componentDidMount: function () {
        if (!this.props.shortcuts) { return; }

        _.each(this.props.shortcuts, function(callback, combo) {
            Mousetrap(React.findDOMNode(this.refs.input)).bind(combo, function(event, combo) {
                callback(event);
            });
        }, this);
    },

    componentWillUnmount: function () {
        if (!this.props.shortcuts) { return; }

        Mousetrap(React.findDOMNode(this.refs.input)).reset();
    },

    render: function() {
    	var isValid = !this.props.errorLabel;
        return (
            <div>
                <div className={cx({
                    "form-group" : this.props.formGroup === undefined || this.props.formGroup,
                    "has-success": this.props.displayFeedback && this.state.value !== null && isValid,
                    "has-error": this.props.displayFeedback && this.state.value !== null && !isValid,
                    "has-feedback": this.props.displayFeedback && this.state.value !== null
                    })}>
                    {this.renderLabel()}
                    {this.renderInput()}
                    <span
                        className={cx({
                            "glyphicon": true,
                            "glyphicon-ok": this.props.displayFeedback && this.state.value !== null && isValid,
                            "glyphicon-remove": this.props.displayFeedback && this.state.value !== null && !isValid,
                            "hide": !this.props.displayFeedback && this.state.value !== null,
                            "form-control-feedback": true,
                        })}
                        aria-hidden="true"></span>
                    <div className={cx({
                        "hide": (!(this.props.displayFeedback && this.state.value !== null) || isValid) && !this.props.help,
                        "text-danger": !!this.props.errorLabel
                        })}>
                        {this.props.errorLabel || this.props.help}
                    </div>
                </div>
            </div>);
    },

    renderLabel: function() {
        return this.props.label ? <label>{this.props.label}</label> : null;
    },

    renderInput: function() {
        var icon = this.renderIcon();
        var input;

        switch(this.props.type) {
            case "textarea":
                input = (
                    <textarea
                        ref="input"
                        className={cx({
                            "form-control": true,
                            "mousetrap": true,
                            "disabled": this.props.disabled
                        })}
                        value={this.state.value}
                        name={this.props.name}
                        placeholder={this.props.placeholder || ""}
                        onChange={this.onChange}
                        onBlur={this.onBlur}
                        autoComplete={this.props.autoComplete}
                        autoFocus={this.props.autoFocus}
                        onKeyDown={this.onKeyDown}
                        rows={this.props.rows || 1}
                        disabled={this.props.disabled} />);
                break;
            default:
                input = (
                    <input
                        ref="input"
                        type={this.props.type || "text"}
                        value={this.state.value}
                        className={cx({
                            "form-control": true,
                            "mousetrap": true,
                            "disabled": this.props.disabled
                        })}
                        name={this.props.name}
                        placeholder={this.props.placeholder || ""}
                        onChange={this.onChange}
                        onBlur={this.onBlur}
                        autoComplete={this.props.autoComplete}
                        autoFocus={this.props.autoFocus}
                        onKeyDown={this.onKeyDown}
                        disabled={this.props.disabled} />);
                break;
        }



        if (icon) {
            input = (
                <div className="input-group">
                    {icon}
                    {input}
                </div>)
        }

        return input;
    },

    renderIcon: function() {
        return this.props.icon ? (
            <span className="input-group-addon">
                {this.props.icon}
            </span>
        ) : null;
    },

    onChange: function(event) {
        this.setState({
            value: event.target.value
        });

        if (this.props.onChange) {
            this.props.onChange(event);
        }
    },

    onBlur: function(event) {
        if (this.props.onBlur) {
            this.props.onBlur(event);
        }
    },

    onKeyDown: function(event) {
        if (event.keyCode === InputConstants.ENTER) {
            if (this.props.onEnter) {
                this.props.onEnter();
                event.preventDefault();
            }
        }
    },

    clear: function() {
        this.setState({
            value: ""
        });
    },

    focus: function() {
        var input = React.findDOMNode(this.refs.input);
        if (!input) { return; }

        input.focus();
    },

    select: function() {
        var input = React.findDOMNode(this.refs.input);
        if (!input) { return; }

        input.select();
    },

    reset: function() {
        this.onChange({
            target: {
                name: this.props.name,
                value: this.props.value
            }
        });
    }
});

module.exports = ValidatedInput;
