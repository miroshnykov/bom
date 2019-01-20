"use strict";

var React = require("react");
var Navigation = require("react-router").Navigation;
var validator = require("validator");

var cx = require("react/lib/cx");

var TextInput = require("../components/TextInput.react");
var UserActions = require("../actions/UserActions");

var InviteAccept = React.createClass({displayName: "InviteAccept",
    mixins: [Navigation],

    propTypes: {
        user: React.PropTypes.object,
        company: React.PropTypes.object
    },

    getInitialState: function() {
        return {
            email: undefined,
            emailError: undefined,
            firstname: undefined,
            firstnameError: undefined,
            lastname: undefined,
            lastnameError: undefined,
            password: undefined,
            passwordError: undefined,
            serverError: undefined
        };
    },

    componentWillReceiveProps: function(nextProps) {
        var user = nextProps.user;
        if (!user) { return; }

        if (!user.isNew()) {
            window.location.href = "/";
            return;
        }

        this.setState({
            emailError: user.getValidationError("email"),
            firstnameError: user.getValidationError("firstname"),
            lastnameError: user.getValidationError("lastname"),
            passwordError: user.getValidationError("password"),
            serverError: user.getServerError()
        });
    },

    render: function() {
        var companyName = this.props.company ? this.props.company.get("name") : undefined;
        var user = this.props.user;
        var error;

        if (this.state.serverError && user && !user.hasValidationErrors()) {
            error = (
                React.createElement("div", {className: "alert alert-danger alert-dismissable"}, 
                    this.state.serverError
                ));
        }

        return (
            React.createElement("div", {className: "invite-accept"}, 
                React.createElement("div", {className: "panel panel-default"}, 
                    React.createElement("div", {className: "panel-body"}, 
                        React.createElement("h1", null, "Create an account", companyName ? " and join "+companyName : ""), 
                        React.createElement("h2", null, "Learn to stop worrying and love the BoM"), 
                        React.createElement("div", {className: "form-container row col-xs-10 col-xs-offset-1 text-left"}, 
                            React.createElement("form", null, 
                                React.createElement("div", {className: cx({
                                    "form-group": true,
                                    "has-feedback": true,
                                    "has-success": this.isEmailValidated() && this.isEmailValid(),
                                    "has-error": this.isEmailValidated() && !this.isEmailValid()})}, 
                                    React.createElement("input", {type: "text", className: "form-control", placeholder: "Email", value: this.state.email, onChange: this.onChangeEmail, onBlur: this.onBlurEmail, onFocus: this.onFocusEmail}), 
                                    React.createElement("span", {className: cx({
                                        "glyphicon": true,
                                        "form-control-feedback": true,
                                        "glyphicon-ok": this.isEmailValidated() && this.isEmailValid(),
                                        "glyphicon-remove": this.isEmailValidated() && !this.isEmailValid()})}), 
                                     this.isEmailValidated() && !this.isEmailValid() ?
                                        (React.createElement("span", {className: "help-block"}, this.getEmailError())) :
                                        undefined
                                ), 
                                React.createElement("div", {className: "row"}, 
                                    React.createElement("div", {className: "col-xs-12 col-md-6"}, 
                                        React.createElement("div", {className: cx({
                                            "form-group": true,
                                            "has-feedback": true,
                                            "has-success": this.isFirstnameValidated() && this.isFirstnameValid() && this.state.firstname,
                                            "has-error": this.isFirstnameValidated() && !this.isFirstnameValid()})}, 
                                            React.createElement("input", {type: "text", className: "form-control", placeholder: "Firstname", value: this.state.firstname, onChange: this.onChangeFirstname, onBlur: this.onBlurFirstname, onFocus: this.onFocusFirstname}), 
                                            React.createElement("span", {className: cx({
                                                "glyphicon": true,
                                                "form-control-feedback": true,
                                                "glyphicon-ok": this.isFirstnameValidated() && this.isFirstnameValid() && this.state.firstname,
                                                "glyphicon-remove": this.isFirstnameValidated() && !this.isFirstnameValid()})}), 
                                             this.isFirstnameValidated() && !this.isFirstnameValid() ?
                                                (React.createElement("span", {className: "help-block"}, this.getFirstnameError())) :
                                                undefined
                                        )
                                    ), 
                                    React.createElement("div", {className: "col-xs-12 col-md-6"}, 
                                        React.createElement("div", {className: cx({
                                            "form-group": true,
                                            "has-feedback": true,
                                            "has-success": this.isLastnameValidated() && this.isLastnameValid() && this.state.lastname,
                                            "has-error": this.isLastnameValidated() && !this.isLastnameValid()})}, 
                                            React.createElement("input", {type: "text", className: "form-control", placeholder: "Lastname", value: this.state.lastname, onChange: this.onChangeLastname, onBlur: this.onBlurLastname, onFocus: this.onFocusLastname}), 
                                            React.createElement("span", {className: cx({
                                                "glyphicon": true,
                                                "form-control-feedback": true,
                                                "glyphicon-ok": this.isLastnameValidated() && this.isLastnameValid() && this.state.lastname,
                                                "glyphicon-remove": this.isLastnameValidated() && !this.isLastnameValid()})}), 
                                             this.isLastnameValidated() && !this.isLastnameValid() ?
                                                (React.createElement("span", {className: "help-block"}, this.getLastnameError())) :
                                                undefined
                                        )
                                    )
                                ), 
                                React.createElement("div", {className: cx({
                                    "form-group": true,
                                    "has-feedback": true,
                                    "has-success": this.isPasswordValidated() && this.isPasswordValid(),
                                    "has-error": this.isPasswordValidated() && !this.isPasswordValid()})}, 
                                    React.createElement("input", {type: "password", className: "form-control", placeholder: "Password", value: this.state.password, onChange: this.onChangePassword, onBlur: this.onBlurPassword, onFocus: this.onFocusPassword}), 
                                    React.createElement("span", {className: cx({
                                        "glyphicon": true,
                                        "form-control-feedback": true,
                                        "glyphicon-ok": this.isPasswordValidated() && this.isPasswordValid(),
                                        "glyphicon-remove": this.isPasswordValidated() && !this.isPasswordValid()})}), 
                                     this.isPasswordValidated() && !this.isPasswordValid() ?
                                        (React.createElement("span", {className: "help-block"}, this.getPasswordError())) :
                                        (React.createElement("span", {className: "help-block"})) 
                                ), 
                                error, 
                                React.createElement("button", {className: "col-xs-12 btn btn-primary", type: "button", onClick: this.signup}, 
                                     user && user.isSyncing() ?
                                        (React.createElement("span", {className: "glyphicon glyphicon-refresh glyphicon-spin"})) :
                                        "Sign Up"
                                    
                                ), 
                                React.createElement("div", {className: "row col-xs-12 col-md-6 pull-right text-right"}, 
                                    React.createElement("h5", null, React.createElement("small", null, "By signing up, you are agreeing to the terms & conditions of Fabule."))
                                )
                            )
                        )
                    )
                )
            )
        );
    },

    // Email

    validateEmail: function(value) {
        var valid = validator.isEmail(value || this.state.email);

        this.setState({
            emailError: valid ? false : "Email is not valid"
        });
    },

    isEmailValidated: function() {
        return this.state.emailError !== undefined;
    },

    getEmailError: function() {
        return this.state.emailError;
    },

    isEmailValid: function(value) {
        return !this.state.emailError;
    },

    onFocusEmail: function(event) {
        this.setState({
            emailError: undefined
        });
    },

    onBlurEmail: function(event) {
        this.validateEmail(event.target.value);
    },

    onChangeEmail: function(event) {
        this.setState({
            email: event.target.value
        });
    },

    // Firstname

    validateFirstname: function(value) {
        var valid = validator.isLength(value || this.state.firstname, 0, 255);
        this.setState({
            firstnameError: valid ? false : "Firstname must be less than 255 characters"
        });
    },

    isFirstnameValidated: function() {
        return this.state.firstnameError !== undefined;
    },

    getFirstnameError: function() {
        return this.state.firstnameError;
    },

    isFirstnameValid: function(value) {
        // return validator.isLength(value || this.state.firstname, 0, 255)
        return !this.state.firstnameError;
    },

    onFocusFirstname: function(event) {
        this.setState({
            firstnameError: undefined
        });
    },

    onBlurFirstname: function(event) {
        this.validateFirstname(event.target.value);
    },

    onChangeFirstname: function(event) {
        this.setState({
            firstname: event.target.value
        });
    },

    // Lastname

    validateLastname: function(value) {
        var valid = validator.isLength(value || this.state.lastname, 0, 255);
        this.setState({
            lastnameError: valid ? false : "Lastname must be less than 255 characters"
        });
    },

    isLastnameValidated: function() {
        return this.state.lastnameError !== undefined;
    },

    getLastnameError: function() {
        return this.state.lastnameError;
    },

    isLastnameValid: function(value) {
        // return validator.isLength(value || this.state.lastname, 0, 255)
        return !this.state.lastnameError;
    },

    onFocusLastname: function(event) {
        this.setState({
            lastnameError: undefined
        });
    },

    onBlurLastname: function(event) {
        this.validateLastname(event.target.value);
    },

    onChangeLastname: function(event) {
        this.setState({
            lastname: event.target.value
        });
    },

    // Password

    validatePassword: function(value) {
        var valid = validator.isLength(value || this.state.password, 8);
        this.setState({
            passwordError: valid ? false : "Password must be at least 8 characters"
        });
    },

    isPasswordValidated: function() {
        return this.state.passwordError !== undefined;
    },

    getPasswordError: function() {
        return this.state.passwordError;
    },

    isPasswordValid: function(value) {
        // return validator.isLength(value || this.state.password, 8);
        return !this.state.passwordError;
    },

    onFocusPassword: function(event) {
        this.setState({
            passwordError: undefined
        });
    },

    onBlurPassword: function(event) {
        this.validatePassword(event.target.value);
    },

    onChangePassword: function(event) {
        this.setState({
            password: event.target.value
        });
    },

    // Form

    validateForm: function() {
        this.validateEmail();
        this.validateFirstname();
        this.validateLastname();
        this.validatePassword();
    },

    signup: function() {
        this.validateForm();

        if (!this.isEmailValid() ||
            !this.isFirstnameValid() ||
            !this.isLastnameValid() ||
            !this.isPasswordValid()) {
            return;
        }

        UserActions.create(
            this.state.email,
            this.state.password,
            this.state.firstname,
            this.state.lastname,
            this.props.params.token
        );
    }
});

module.exports = InviteAccept;
