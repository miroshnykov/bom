"use strict";

var _ = require("underscore");
var backboneMixin = require("backbone-react-component");
var cx = require("react/lib/cx");
var React = require("react");

var Spinner = require("components/Spinner.jsx");
var ValidatedInput = require("components/forms/ValidatedInput.jsx");

var UserPasswordForm = React.createClass({
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
                            ref="currentPassword"
                            name="currentPassword"
                            label="Current Password"
                            onChange={this.onChange}
                            onEnter={this.onSubmit}
                            type="password"
                            errorLabel={this.state.errors.currentPassword}
                            displayFeedback={!!this.state.errors.currentPassword}
                            autoComplete="off"
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <ValidatedInput
                            ref="password"
                            name="password"
                            label="New Password"
                            onChange={this.onChange}
                            onEnter={this.onSubmit}
                            type="password"
                            errorLabel={this.state.errors.password}
                            displayFeedback={!!this.state.errors.password}
                            autoComplete="off"
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <ValidatedInput
                            ref="confirmPassword"
                            name="confirmPassword"
                            label="Confirm New Password"
                            onChange={this.onChange}
                            onEnter={this.onSubmit}
                            type="password"
                            errorLabel={this.state.errors.confirmPassword}
                            displayFeedback={!!this.state.errors.confirmPassword}
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
        var allErrors = _.clone(this.state.errors);

        value[event.target.name] = event.target.value;
        errors = this.getModel().preValidate(value) || {};

        if (event.target.name === "currentPassword") {
            if (!event.target.value) {
                errors = _.extend(errors, { currentPassword: "Please confirm your current password"});
            }
            else if (event.target.value === this.refs.password.state.value) {
                errors = _.extend(errors, { password: "This password is the same as your current password"});
            }

            allErrors = !errors["password"] ? _.omit(allErrors, "password") : allErrors;
        }
        else if (event.target.name === "password") {
            if (!event.target.value) {
                errors = _.extend(errors, { password: "Please enter a new password"});
            }
            else {
                if (this.refs.confirmPassword.state.value && event.target.value !== this.refs.confirmPassword.state.value) {
                    errors = _.extend(errors, { confirmPassword: "This password does not match your new password"});
                }

                if (event.target.value === this.refs.currentPassword.state.value) {
                    errors = _.extend(errors, { password: "This password is the same as your current password"});
                }
            }

            allErrors = !errors["confirmPassword"] ? _.omit(allErrors, "confirmPassword") : allErrors;
        }
        else if (event.target.name === "confirmPassword") {
            if (!event.target.value) {
                errors = _.extend(errors, { confirmPassword: "Please confirm your new password"});
            }
            else if (event.target.value !== this.refs.password.state.value) {
                errors = _.extend(errors, { confirmPassword: "This password does not match your new password"});
            }
        }

        allErrors = !errors[event.target.name] ? _.omit(allErrors, event.target.name) : allErrors;

        errors = _.extend(allErrors, errors);

        this.setState({
            fail: null,
            success: null,
            errors: errors
        });
    },

    onSubmit: function(event) {
        var errors = {};
        var attrs;

        if (event) {
            event.preventDefault();
        }

        if (!this.refs.currentPassword.state.value) {
            errors = _.extend(errors, { currentPassword: "Please confirm your current password"});
        }

        if (!this.refs.password.state.value) {
            errors = _.extend(errors, { password: "Please enter your new password"});
        }

        if (!this.refs.confirmPassword.state.value) {
            errors = _.extend(errors, { confirmPassword: "Please confirm your new password"});
        }
        else if (this.refs.confirmPassword.state.value !== this.refs.password.state.value) {
            errors = _.extend(errors, { confirmPassword: "This password does not match your new password"});
        }

        if (!_.isEmpty(errors)) {
            this.setState({
                errors: errors
            });
            return;
        }

        attrs = {
            password: this.refs.password.state.value,
            currentPassword: this.refs.currentPassword.state.value,
        };

        this.setState({
            fail: null,
            success: null
        });

        this.getModel().save(attrs).then(function(user) {
            this.setState({
                success: "Your password has been saved!"
            });

            this.refs.currentPassword.clear();
            this.refs.password.clear();
            this.refs.confirmPassword.clear();
        }.bind(this), function(error) {
            this.setState({
                errors: error.getValidationErrors() || {},
                fail: error.message
            });
        }.bind(this));
    }
});

module.exports = UserPasswordForm;
