"use strict";

var _ = require("underscore");
var classNames = require("classnames");
var Glyphicon = require("react-bootstrap").Glyphicon;
var React = require("react");
var TextInput = require("components/TextInput.jsx");

module.exports = React.createClass({

    propTypes: {
        inline: React.PropTypes.bool,
        onSave: React.PropTypes.func,
        value: React.PropTypes.string.isRequired
    },

    getInitialState: function() {
        return {
            editing: false
        };
    },

    render: function() {
        var other = _.omit(this.props, ["value", "onSave", "className"]);
        var className = classNames(this.props.className, {inline: this.props.inline});

        if(this.state.editing) {
            className = classNames(className, "editable-input");
            return (
                <TextInput
                    groupClassName={className}
                    onSave={this.onSave}
                    onCancel={this.onCancel}
                    value={this.props.value} />
            );
        } else {
            className = classNames(className, "editable-label", "cursor-text");
            return (
                <label
                    {...other}
                    className={className}
                    title="Click to edit"
                    onClick={this.toggle}>
                    {this.props.value}</label>
            );
        }
    },

    onSave: function(name) {
        this.setState({editing: false});
        this.props.onSave(name);
    },

    toggle: function() {
        this.setState({editing: !this.state.editing});
    }
});
