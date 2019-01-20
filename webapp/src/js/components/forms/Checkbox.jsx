"use strict";

var cx = require("react/lib/cx");
var React = require("react");

var Checkbox = React.createClass({

    propTypes: {
        checked: React.PropTypes.bool,
        label: React.PropTypes.string,
        onClick: React.PropTypes.func,
        disabled: React.PropTypes.bool,
        tooltip: React.PropTypes.string
    },

    getDefaultProps: function(){
        return {
            checked: false,
            label: null,
            onClick: null
        };
    },

    componentWillMount: function() {
        this.setState({
            checked: this.props.checked
        });
    },

    componentWillReceiveProps: function(nextProps) {
        this.setState({
            checked: nextProps.checked
        });
    },

    render: function() {
        var checkbox = (
            <input
                type="checkbox"
                label={this.props.label}
                checked={this.state.checked}
                disabled={this.props.disabled}
                onClick={this.onClick}
                onChange={function(){}}/>
        );

        if(this.props.label) {
            checkbox = (
                <label>
                    {checkbox}
                    {this.props.label}
                </label>
            );
        }

        return (
            <div className={cx({checkbox: true, disabled: this.props.disabled})} title={this.props.tooltip}>
                {checkbox}
            </div>
        );
    },

    isChecked: function() {
        return this.state.checked;
    },

    onClick: function() {
        var checked = !this.state.checked;
        this.setState({
            checked: checked
        });

        if (this.props.onClick) {
            this.props.onClick(checked);
        }
    }

});

module.exports = Checkbox;
