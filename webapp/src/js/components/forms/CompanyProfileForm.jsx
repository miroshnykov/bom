"use strict";

var _ = require("underscore");
var backboneMixin = require("backbone-react-component");
var cx = require("react/lib/cx");
var React = require("react");

var AppDispatcher = require("dispatcher/AppDispatcher");
var Spinner = require("components/Spinner.jsx");
var ValidatedInput = require("components/forms/ValidatedInput.jsx");
var ConfirmPassword = require("components/modals/ConfirmPassword.jsx");

var CompanyProfileForm = React.createClass({
    mixins: [backboneMixin],

    getInitialState: function() {
        return {
            fail: null,
            success: null,
            errors: {}
        };
    },

    render: function() {
        var company = this.getModel().getCurrentCompany();

        return (
            <form onSubmit={this.onSubmit}>
                <div className="row">
                    <div className="col-md-6">
                        <ValidatedInput
                            ref="companyName"
                            name="companyName"
                            label="Name"
                            value={company.name}
                            onChange={this.onChange}
                            onEnter={this.onSubmit}
                            type="text"
                            errorLabel={this.state.errors.companyName}
                            displayFeedback={!!this.state.errors.companyName}
                            autoComplete="firstname"
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
        var company = this.getModel().getCurrentCompany();

        if (event) {
            event.preventDefault();
        }

        if (this.refs.companyName.state.value === company.name) {
            return;
        }

        this.setState({
            fail: null,
            success: null
        });

        this.getModel().save({
            companyName: this.refs.companyName.state.value
        }, {
            wait: true
        }).then(function(user) {
            this.setState({
                success: "Your company profile has been saved!"
            });
        }.bind(this), function(error) {
            this.setState({
                errors: error.getValidationErrors() || {},
                fail: _.isEmpty(error.getValidationErrors()) ? error.message : null
            });
        }.bind(this));
    }

});

module.exports = CompanyProfileForm;
