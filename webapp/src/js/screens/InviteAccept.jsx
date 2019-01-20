"use strict";

var React = require("react");
var Navigation = require("react-router").Navigation;
var validator = require("validator");
var _ = require("underscore");
var backboneMixin = require("backbone-react-component");

var cx = require("react/lib/cx");

var ValidatedInput = require("components/forms/ValidatedInput.jsx");
var Spinner = require("components/Spinner.jsx");

var InviteAccept = React.createClass({
    mixins: [backboneMixin, Navigation],

    propTypes: {
        company: React.PropTypes.object,
        invite: React.PropTypes.object
    },

    getInitialState: function() {
        return {
            errors: {}
        };
    },

    render: function() {
        var emailIcon = <span className="glyphicon glyphicon-envelope" aria-hidden="true"></span>;
        var firstNameIcon = <span className="glyphicon glyphicon-user" aria-hidden="true"></span>;
        var passwordIcon = <span className="glyphicon glyphicon-lock" aria-hidden="true"></span>;

        return (
            <div className="invite-accept">
                <div className="panel panel-primary">
                    <div className="text-center">
                        {this.renderTitle()}
                        <h5>Learn to stop worrying and love the BoM</h5>
                    </div>
                    <div className="panel-body">
                        <div className="form-container text-left">
                            <form onSubmit={this.onFormSubmit}>
                                <div className="form-group">
                                    <ValidatedInput
                                        ref="email"
                                        name="email"
                                        value={this.props.invite ? this.props.invite.get("email") : null}
                                        icon={emailIcon}
                                        onChange={this.onChange}
                                        placeholder="Email"
                                        type="email"
                                        errorLabel={this.state.errors.email}
                                        displayFeedback={true}
                                        autoComplete="username"
                                        autoFocus={true}
                                    />
                                </div>
                                <div className="row">
                                    <div className="col-xs-12 col-md-6">
                                        <ValidatedInput
                                            ref="firstName"
                                            name="firstName"
                                            value={this.props.invite ? this.props.invite.get("firstName") : null}
                                            icon={firstNameIcon}
                                            onChange={this.onChange}
                                            placeholder="First Name"
                                            type="text"
                                            errorLabel={this.state.errors.firstName}
                                            displayFeedback={true}
                                            autoComplete="firstname"
                                        />
                                    </div>
                                    <div className="col-xs-12 col-md-6">
                                        <ValidatedInput
                                            ref="lastName"
                                            name="lastName"
                                            value={this.props.invite ? this.props.invite.get("lastName") : null}
                                            onChange={this.onChange}
                                            placeholder="Last Name"
                                            type="text"
                                            errorLabel={this.state.errors.lastName}
                                            displayFeedback={true}
                                            autoComplete="lastname"
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12">
                                        <ValidatedInput
                                            ref="password"
                                            name="password"
                                            icon={passwordIcon}
                                            onChange={this.onChange}
                                            placeholder="Password"
                                            type="password"
                                            errorLabel={this.state.errors.password}
                                            displayFeedback={true}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-12 form-group text-right">
                                    By clicking sign up, I agree to the <a target="_blank" href="http://bomsquad.io/policies/terms-of-service/">Terms of Service</a> and the <a target="_blank" href="http://bomsquad.io/policies/privacy-policy/">Privacy Policy</a>.
                                </div>
                                <div className="form-group text-right">
                                    <button
                                        type="submit"
                                        className={cx({
                                            "btn": true,
                                            "btn-primary": true,
                                            "disabled": !this.canSignup()
                                        })}
                                        disabled={!this.canSignup()}
                                        value="submit">{this.getModel().isStateSending() ? <Spinner /> : "Sign Up"}</button>
                                </div>
                                {this.renderStatusFeedback()}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    },

    canSignup: function() {
        return _.isEmpty(this.state.errors) &&
            (!this.props.invite || this.props.invite.get("status") !== this.props.invite.INVITE_STATUS_ACCEPTED) &&
            !this.getModel().isStateSending();
    },

    renderTitle: function() {
        var title = "Create an account";
        var companyName;

        if (this.props.company && this.props.company.get("name")) {
            companyName = this.props.company.get("name");
        }
        else if (this.props.invite && this.props.invite.get("companyName")) {
            companyName = this.props.invite.get("companyName");
        }

        if (companyName) {
            title += " and join " + companyName.replace(/ /g, "\u00a0");
        }

        return <h3>{title}</h3>;
    },

    renderStatusFeedback: function() {
        var message;

        if (this.props.invite && this.props.invite.get("status") === this.props.invite.INVITE_STATUS_ACCEPTED) {
            message = "This invite has been used."
        }
        else if (this.getModel().isStateIdle() || this.getModel().isStateSending()) {
            return null;
        }
        else {
            message = this.getModel().isStateSuccess() ?
                "Your account has been created!" :
                "A problem occurred while sending. Please try again.";
        }

        return (
            <div className={cx({
                    "alert": true,
                    "alert-danger": (this.getModel().isStateError()),
                    "alert-success": (this.getModel().isStateSuccess()),
                    "alert-dismissable": true
                })}>
                {message}
            </div>);
    },

    onChange: function(event) {
        var value = {}
        var errors;
        var allErrors = _.clone(this.state.errors);

        value[event.target.name] = event.target.value;
        errors = this.getModel().preValidate(value) || {};

        if (event.target.name === "password" && !event.target.value) {
            errors = _.extend(errors, { password: "Please enter a password with at least 8 characters"});
        }

        if (!errors[event.target.name]) {
            allErrors = _.omit(allErrors, event.target.name);
        }

        errors = _.extend(allErrors, errors);

        this.setState({errors: allErrors});
    },

    onFormSubmit: function(event) {
        var errors = {};
        var attrs;

        event.preventDefault();

        if (!this.refs.password.state.value) {
            errors = _.extend(errors, { password: "Please enter a password with at least 8 characters"});
        }

        if (!_.isEmpty(errors)) {
            this.setState({
                errors: errors
            });
            return;
        }

        attrs = {
            email: this.refs.email.state.value,
            firstName: this.refs.firstName.state.value,
            lastName: this.refs.lastName.state.value,
            password: this.refs.password.state.value,
            companyToken: this.props.company ? this.props.company.get("id") : null,
            inviteToken: this.props.invite ? this.props.invite.get("token") : null,
            signin: true
        };

        this.getModel().save(attrs).then(function(user) {
            this.transitionTo("confirm", this.props.params);
        }.bind(this), function(error) {
            console.error(error);
            this.setState({"errors": error.getValidationErrors()});
        }.bind(this));
    }
});

module.exports = InviteAccept;
