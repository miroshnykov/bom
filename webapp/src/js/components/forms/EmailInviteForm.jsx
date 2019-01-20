"use strict";

var _ = require("underscore");
var backboneMixin = require("backbone-react-component");
var cx = require("react/lib/cx");
var React = require("react");
var ValidatedInput = require("components/forms/ValidatedInput.jsx");
var Spinner = require("components/Spinner.jsx");
var UserStore = require("stores/UserStore");

var EmailInviteForm = React.createClass({
    mixins: [backboneMixin],

    propTypes: {
        isEmailInvited: React.PropTypes.func.isRequired
    },

    getInitialState: function() {
        return {
            errors: {}
        };
    },

    render: function() {
        var personIcon = <span className="fa fa-user" aria-hidden="true"></span>;
        var emailIcon = <span className="fa fa-envelope" aria-hidden="true"></span>;
        var buttonText = this.getButtonText();
        var statusFeedback = this.getStatusFeedback();
        return (
            <form
                id="email-invite-form"
                ref="form"
                className="form"
                autoComplete="off"
                onSubmit={this.onFormSubmit} >
                <div className="row">
                    <div className="form-group">
                        <div className="col-md-6">
                            <ValidatedInput
                                ref="firstName"
                                name="firstName"
                                icon={personIcon}
                                onChange={this.onChange}
                                placeholder="First Name"
                                errorLabel={this.state.errors.firstName}
                                displayFeedback={this.getModel().has("firstName")}
                            />
                        </div>
                        <div className="col-md-6">
                            <ValidatedInput
                                ref="lastName"
                                name="lastName"
                                icon={personIcon}
                                onChange={this.onChange}
                                placeholder="Last Name"
                                errorLabel={this.state.errors.lastName}
                                displayFeedback={this.getModel().has("lastName")}
                            />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <ValidatedInput
                        ref="email"
                        name="email"
                        icon={emailIcon}
                        onChange={this.onChange}
                        placeholder="Email"
                        type="email"
                        errorLabel={this.state.errors.email}
                        displayFeedback={this.getModel().has("email")}
                    />
                </div>
                <button
                    type="submit"
                    className={cx({
                        "btn": true,
                        "btn-primary": true,
                        "pull-right": true,
                        "disabled": !this.canSubmit()
                    })}
                    disabled={!this.canSubmit()}
                    value="submit">{buttonText}</button>
                {statusFeedback}
            </form>
        );
    },

    canSubmit: function() {
        return _.isEmpty(this.state.errors) &&
                !!this.getModel().get("email") &&
                this.getModel().get("state") !== this.getModel().STATE_SENDING;
    },

    getStatusFeedback: function(){
        if(this.getModel().get("state") === this.getModel().STATE_IDLE ||
           this.getModel().get("state") === this.getModel().STATE_SENDING) {
            return null;
        }

        var message =
            (this.getModel().get("state") === this.getModel().STATE_SUCCESS) ?
            "The invitation has been sent!" :
            "A problem occurred while sending. Please try again.";

        var statusMessage = (<p className={cx({
            "text-center": true,
            "text-danger": (this.getModel().get("state") === this.getModel().STATE_ERROR),
            "text-success": (this.getModel().get("state") === this.getModel().STATE_SUCCESS)
        })} >{message}</p>);
        return (
            <div className="row">
                <div className="col-md-12">
                    <hr />
                </div>
                <div className="col-md-12">
                    {statusMessage}
                </div>
            </div>);
    },

    getButtonText: function(){
        if(this.getModel().get("state") === this.getModel().STATE_SENDING) {
            return (<Spinner />);
        } else {
            return "Send";
        }
    },

    onChange: function(event) {
        this.getModel().set(event.target.name, event.target.value);
        var errors = this.getModel().validate() || {};

        if (event.target.name === "email") {
            if (this.props.isEmailInvited(event.target.value)) {
                errors.email = "An invitation already exists for this email";
            }
            else if (event.target.value === UserStore.current.get("email")) {
                errors.email = "This is ackward. Isn't this you?";
            }
        }

        this.setState({errors: errors});
    },

    onFormSubmit: function(e) {
        e.preventDefault();
        this.getModel().save().then(function() {
            this.reset();
        }.bind(this), function(error) {
            this.setState({
                errors: error.getValidationErrors() || {}
            });
        }.bind(this));
    },

    reset: function() {
        this.refs.firstName.reset();
        this.refs.lastName.reset();
        this.refs.email.reset();
    }
});

module.exports = EmailInviteForm;
