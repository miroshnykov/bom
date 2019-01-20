"use strict";

var _ = require("underscore");
var backboneMixin = require("backbone-react-component");
var cx = require("react/lib/cx");
var React = require("react");

var AppDispatcher = require("dispatcher/AppDispatcher");
var Spinner = require("components/Spinner.jsx");
var ValidatedInput = require("components/forms/ValidatedInput.jsx");
var ConfirmPasswordModal = require("components/modals/ConfirmPassword.jsx");

var UserProfileForm = React.createClass({
    mixins: [backboneMixin],

    getInitialState: function() {
        return {
            fail: null,
            success: null,
            errors: {}
        };
    },

    render: function() {
        return (
            <form onSubmit={this.onSubmit}>
                <div className="row">
                    <div className="col-md-6">
                        <ValidatedInput
                            ref="firstName"
                            name="firstName"
                            label="First Name"
                            value={this.getModel().get("firstName")}
                            onChange={this.onChange}
                            onEnter={this.onSubmit}
                            type="text"
                            errorLabel={this.state.errors.firstName}
                            displayFeedback={!!this.state.errors.firstName}
                            autoComplete="firstname"
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <ValidatedInput
                            ref="lastName"
                            name="lastName"
                            label="Last Name"
                            value={this.getModel().get("lastName")}
                            onChange={this.onChange}
                            onEnter={this.onSubmit}
                            type="text"
                            errorLabel={this.state.errors.lastName}
                            displayFeedback={!!this.state.errors.lastName}
                            autoComplete="lastname"
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <ValidatedInput
                            ref="displayName"
                            name="displayName"
                            label="Display Name"
                            value={this.getModel().get("displayName")}
                            onChange={this.onChange}
                            onEnter={this.onSubmit}
                            type="text"
                            errorLabel={this.state.errors.displayName}
                            displayFeedback={!!this.state.errors.displayName}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <ValidatedInput
                            ref="email"
                            name="email"
                            label="Email"
                            value={this.getModel().get("email")}
                            onChange={this.onChange}
                            onEnter={this.onSubmit}
                            type="text"
                            help="Password confirmation is required to change your email."
                            errorLabel={this.state.errors.email}
                            displayFeedback={!!this.state.errors.email}
                            autoComplete="off"
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 text-right">
                        <div className="btn-toolbar pull-right">
                            <div className="btn-group">
                                <button
                                    type="submit"
                                    className={cx({
                                        "btn": true,
                                        "btn-primary": true,
                                        "disabled": !_.isEmpty(this.state.errors) || this.getModel().isStateSending()
                                    })}
                                    disabled={!_.isEmpty(this.state.errors) || this.getModel().isStateSending()}
                                    value="submit">{this.getModel().isStateSending() ? <Spinner /> : "Save"}</button>
                            </div>
                        </div>
                        {this.renderStatus()}
                    </div>
                </div>
            </form>
        );
    },

    renderStatus: function() {
        if (!this.state.fail && !this.state.success) {
            return null;
        }

        return (
            <div className={cx({
                    "text-danger": !!this.state.fail,
                    "text-success": !!this.state.success,
                    "text-center": true
                })}>
                {this.state.fail || this.state.success}
            </div>);
    },

    onChange: function(event) {
        var value = {}
        var errors;

        value[event.target.name] = event.target.value;
        errors = this.getModel().preValidate(value) || {};

        if (!errors[event.target.name]) {
            errors = _.omit(this.state.errors, event.target.name);
        }
        else {
            errors = _.extend(this.state.errors, errors);
        }

        this.setState({
            fail: null,
            success: null,
            errors: errors
        });
    },

    onSubmit: function(event) {
        if (event) {
            event.preventDefault();
        }

        if (this.refs.email.state.value !== this.getModel().get("email")) {
            AppDispatcher.dispatch({
                action: {
                    type: "show-modal"
                },
                modal: (
                    <ConfirmPasswordModal
                        onConfirm={this.onConfirmPassword}>
                        Are you sure you want to cancel the invitation for this user?
                    </ConfirmPasswordModal>)
            });
            return;
        }

        if (this.refs.firstName.state.value === this.getModel().get("firstName") &&
            this.refs.lastName.state.value === this.getModel().get("lastName") &&
            this.refs.displayName.state.value === this.getModel().get("displayName") &&
            this.refs.email.state.value === this.getModel().get("email")) {
            return;
        }

        this.save({
            firstName:       this.refs.firstName.state.value,
            lastName:        this.refs.lastName.state.value,
            email:           this.refs.email.state.value,
            displayName:     this.refs.displayName.state.value
        });
    },

    onConfirmPassword: function(password) {
        this.save({
            firstName:       this.refs.firstName.state.value,
            lastName:        this.refs.lastName.state.value,
            email:           this.refs.email.state.value,
            displayName:     this.refs.displayName.state.value,
            currentPassword: password
        });
    },

    save: function(attrs) {
        this.setState({
            fail: null,
            success: null
        });

        this.getModel().save(attrs, {wait: true}).then(function(user) {
            this.setState({
                success: "Your profile has been saved!"
            });
        }.bind(this), function(error) {
            this.setState({
                errors: error.getValidationErrors() || {},
                fail: _.isEmpty(error.getValidationErrors()) ? error.message : null
            });
        }.bind(this));
    }
});

module.exports = UserProfileForm;
