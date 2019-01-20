"use strict";

var _ = require("underscore");
var React = require("react");

var ValidatedInput = require("components/forms/ValidatedInput.jsx");
var Modal = require("components/modals/Modal.jsx");

var ConfirmPassword = React.createClass({

  propTypes: {
      onConfirm: React.PropTypes.func.isRequired
  },

  render: function() {
    return (
        <Modal
            saveLabel="Confirm"
            dismissLabel="Cancel"
            onConfirm={this.onConfirm}
            title="Please confirm your current password">
            <div className="row">
                <div className="col-md-6">
                    <ValidatedInput
                        ref="password"
                        name="password"
                        type="password"
                        formGroup={false}
                        autoComplete="off" />
                </div>
            </div>
        </Modal>
      );
  },

  onConfirm: function(event) {
      this.props.onConfirm(this.refs.password.state.value);
  }

});

module.exports = ConfirmPassword;
