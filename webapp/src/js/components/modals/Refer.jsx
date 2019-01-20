"use strict";

var _ = require("underscore");
var Modal = require("components/modals/Modal.jsx");
var React = require("react");
var UserStore = require("stores/UserStore");
var ValidatedInput = require("components/forms/ValidatedInput.jsx");


var options = {
    designer: "Hardware Designer",
    cm: "Contract Manufacturer",
    other: "Other"
};

module.exports = React.createClass({

    getInitialState: function() {
        return {
            selectedOption: "other"
        };
    },

    render: function() {
        return (
            <Modal
                saveLabel="Confirm"
                dismissLabel="Cancel"
                disableConfirm={!(this.state.emailIsValid && this.state.selectedOption)}
                onConfirm={this.onConfirm}
                title="BoM Squad Pilot Invite">
                <div className="row">
                    <div className="col-md-6">
                        Do you know someone who would be a great addition to
                        the BoM Squad Pilot? If so, let us know and we will review
                        their profile to see if they qualify. Should they join the pilot,
                        we will make sure to send you a thank you gift.
                    </div>
                    <div className="col-md-6">
                        <ValidatedInput
                            ref="email"
                            name="email"
                            type="email"
                            label="Email"
                            formGroup={true}
                            onChange={this.onChangeEmail}
                            errorLabel={this.state.emailIsValid ? "" : "Invalid Email"}
                            displayFeedback={!(this.state.emailIsValid === undefined)}
                            autoComplete="off" />
                        {this.renderOptions()}
                    </div>
                </div>
            </Modal>
        );
    },

    renderOptions: function() {
        return _.map(options, function(value, key) {
            return (
               <div className="radio">
                    <label>
                        <input
                            type="radio"
                            name="userType"
                            onClick={this.onClickUserType}
                            checked={this.state.selectedOption === key}
                            value={key} />
                            {value}
                    </label>
                </div>
            );
        }.bind(this));
    },

    onClickUserType: function(event) {
        this.setState({selectedOption: event.target.value});
    },

    onChangeEmail: function(event) {
        this.setState({emailIsValid: /.+@.+\..+/.test(event.target.value)});
    },

    onConfirm: function(event) {
        var body =
            "payload={\"text\": \"User " + UserStore.current.get("email") +
            " referred a " + options[this.state.selectedOption] + ": " +
            this.refs.email.state.value + ")\"}";
        $.post("https://hooks.slack.com/services/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",
            body
        ).fail(function(error) {
            console.log(error);
        });
    }

});
