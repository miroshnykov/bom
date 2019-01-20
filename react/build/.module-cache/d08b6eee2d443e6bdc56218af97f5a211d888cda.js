var React = require('react');
var Input = require('react-bootstrap').Input;

var InputConstants = require('../constants/InputConstants');

var TextInput = React.createClass({displayName: "TextInput",

  propTypes: {
    label: React.PropTypes.string,
    className: React.PropTypes.string,
    wrapperClassName: React.PropTypes.string,
    id: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    onSave: React.PropTypes.func.isRequired,
    value: React.PropTypes.string
  },

  getInitialState: function() {
    return {
      value: this.props.value || ''
    };
  },

  /**
   * @return {object}
   */
  render: function() /*object*/ {
    return (
      React.createElement(Input, {
        label: this.props.label, 
        labelClassName: "sr-only", 
        type: "text", 
        className: this.props.className, 
        id: this.props.id, 
        placeholder: this.props.placeholder, 
        onBlur: this._onSave, 
        onChange: this._onChange, 
        onKeyDown: this._onKeyDown, 
        value: this.state.value, 
        autoFocus: true, 
        wrapperClassName: this.props.wrapperClassName})
    );
  },

  /**
   * Invokes the callback passed in as onSave, allowing this component to be
   * used in different ways.
   */
  _onSave: function() {
    this.props.onSave(this.state.value);
    this.setState({
      value: ''
    });
  },

  /**
   * @param {object} event
   */
  _onChange: function(/*object*/ event) {
    this.setState({
      value: event.target.value
    });
  },

  /**
   * @param  {object} event
   */
  _onKeyDown: function(event) {
    if (event.keyCode === InputConstants.ENTER_KEY_CODE) {
      this._onSave();
      event.preventDefault();
    }
  }

});

module.exports = TextInput;
