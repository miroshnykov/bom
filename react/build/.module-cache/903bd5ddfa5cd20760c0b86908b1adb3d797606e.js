var React = require("react");
var Input = require("react-bootstrap").Input;
var Button = require("react-bootstrap").Button;
var ButtonToolbar = require("react-bootstrap").ButtonToolbar;
var Alert = require("react-bootstrap").Alert;
var Glyphicon = require("react-bootstrap").Glyphicon;

var InputConstants = require("../constants/InputConstants");
var UserActions = require("../actions/UserActions");

var Profile = React.createClass({displayName: "Profile",

    propTypes: {
        user: React.PropTypes.object.isRequired,
        company: React.PropTypes.object.isRequired
    },

    getCurrentProfile: function() {
        return {
            firstname: this.props.user.get("firstname") || "",
            lastname: this.props.user.get("lastname") || "",
            displayname: this.props.user.get("displayname") || "",
            company: this.props.company.get("name") || ""
        };
    },

    getCurrentEmail: function() {
        return this.props.user.get("email");
    },

    getInitialState: function() {
        return _.extend({
            isEditingProfile: false,
            isEditingEmail: false,
            isEditingPassword: false,
            profileAlert: undefined,
            emailAlert: undefined,
            passwordAlert: undefined,
            emailPassword: undefined,
            newPassword: undefined,
            confirmPassword: undefined,
            oldPassword: undefined,
            email: this.getCurrentEmail()
        }, this.getCurrentProfile());
    },

    componentDidMount: function() {
        this._addScroll();
    },

    componentDidUpdate: function(prevProps, prevState) {
        $(this.getDOMNode()).getNiceScroll().resize();

        // Trigger a fake mouse enter
        // This solve a bug that seem to fail to update the width
        // of the horizontal scrollbar when the left panel opens
        $(this.getDOMNode()).trigger("mouseenter");

        if (this.state.isEditing && !prevState.isEditing) {
            this.refs.firstnameInput.getDOMNode().focus();
            this.refs.firstnameInput.getDOMNode().select();
        }
    },

    _addScroll: function() {
        $(this.getDOMNode()).niceScroll({
            cursoropacitymax: 0.25,
            cursorwidth: "10px",
            railpadding: {
                top: 5,
                right: 1,
                left: 1,
                bottom: 5
            }
        });
    },

    _removeScroll: function() {
        $(this.getDOMNode()).getNiceScroll().remove();
    },

    /**
    * @return {object}
    */
    render: function() {
        var user = this.props.user;

        var firstnameElement;
        var firstnamePlaceholder = "It's a shame that we don't know your name";

        var lastnameElement;

        var displaynameElement;
        var displaynamePlaceholder = "How should we display your name to others?";

        var companyElement;

        var profileGroup;
        var emailGroup;
        var passwordGroup;

        var newPasswordPlaceholder = "Minimum 8 characters. We like it hard."
        var oldPasswordPlaceholder = "Safety first! Please confirm your current password.";

        if (this.state.isEditingProfile) {
            profileGroup = (
                React.createElement("div", null, 
                    React.createElement("div", {className: "form-group"}, 
                        React.createElement("label", {className: "control-label col-xs-4"}, 
                            React.createElement("span", null, "First Name")
                        ), 
                        React.createElement("div", {className: "col-xs-8"}, 
                            React.createElement("input", {ref: "firstnameInput", type: "text", label: "First Name", className: "form-control", value: this.state.firstname, placeholder: firstnamePlaceholder, onBlur: this._onBlurFirstname, onChange: this._onChangeFirstname, onKeyDown: this._onKeyDownFirstname})
                        )
                    ), 
                    React.createElement("div", {className: "form-group"}, 
                        React.createElement("label", {className: "control-label col-xs-4"}, 
                            React.createElement("span", null, "Last Name")
                        ), 
                        React.createElement("div", {className: "col-xs-8"}, 
                            React.createElement("input", {ref: "lastnameInput", type: "text", label: "Last Name", className: "form-control", value: this.state.lastname, placeholder: "", onBlur: this._onBlurLastname, onChange: this._onChangeLastname, onKeyDown: this._onKeyDownLastname})
                        )
                    ), 
                    React.createElement("div", {className: "form-group"}, 
                        React.createElement("label", {className: "control-label col-xs-4"}, 
                            React.createElement("span", null, "Display Name")
                        ), 
                        React.createElement("div", {className: "col-xs-8"}, 
                            React.createElement("input", {ref: "displaynameInput", type: "text", label: "Display Name", className: "form-control", value: this.state.displayname, placeholder: displaynamePlaceholder, onBlur: this._onBlurDisplayName, onChange: this._onChangeDisplayName, onKeyDown: this._onKeyDownDisplayName})
                        )
                    ), 
                    React.createElement("div", {className: "form-group"}, 
                        React.createElement("label", {className: "control-label col-xs-4"}, 
                            React.createElement("span", null, "Company Name")
                        ), 
                        React.createElement("div", {className: "col-xs-8"}, 
                            React.createElement("input", {ref: "companyInput", type: "text", label: "Company Name", className: "form-control", value: this.state.company, placeholder: "", onBlur: this._onBlurCompany, onChange: this._onChangeCompany, onKeyDown: this._onKeyDownCompany})
                        )
                    ), 
                    React.createElement("div", null, 
                        React.createElement(ButtonToolbar, {className: "pull-right"}, 
                            this.state.profileAlert ? (React.createElement(Alert, {bsStyle: "danger"}, this.state.profileAlert)) : undefined, 
                            React.createElement(Button, {
                                bsStyle: "default", 
                                onClick: this._onCancelProfile}, 
                                "Cancel"
                            ), 
                            React.createElement(Button, {
                                bsStyle: "primary", 
                                onClick: this._onSaveProfile, 
                                disabled: user.isSyncing()}, 
                                 user.isSyncing() ? (React.createElement(Glyphicon, {className: "glyphicon-spin", glyph: "refresh"})) : "Save"
                            )
                        )
                    )
                ));
        }
        else {
            profileGroup = (
                React.createElement("div", null, 
                    React.createElement("div", {className: "form-group"}, 
                        React.createElement("label", {className: "control-label col-xs-4"}, 
                            React.createElement("span", null, "First Name")
                        ), 
                        React.createElement("div", {className: "col-xs-7"}, 
                            this.state.firstname ?
                                (React.createElement("div", {className: "control-content"}, this.state.firstname)) :
                                (React.createElement("div", {className: "control-content placeholder"}, firstnamePlaceholder))
                        ), 
                        React.createElement("div", {className: "col-xs-1"}, 
                            React.createElement(Button, {
                                bsStyle: "default", 
                                onClick: this._onEditProfile}, 
                                "Edit"
                            )
                        )
                    ), 
                    React.createElement("div", {className: "form-group"}, 
                        React.createElement("label", {className: "control-label col-xs-4"}, 
                            React.createElement("span", null, "Last Name")
                        ), 
                        React.createElement("div", {className: "col-xs-8"}, 
                            React.createElement("div", {className: "control-content"}, this.state.lastname)
                        )
                    ), 
                    React.createElement("div", {className: "form-group"}, 
                        React.createElement("label", {className: "control-label col-xs-4"}, 
                            React.createElement("span", null, "Display Name")
                        ), 
                        React.createElement("div", {className: "col-xs-8"}, 
                            this.state.displayname ?
                                (React.createElement("div", {className: "control-content"}, this.state.displayname)) :
                                (React.createElement("div", {className: "control-content placeholder"}, displaynamePlaceholder))
                        )
                    ), 
                    React.createElement("div", {className: "form-group"}, 
                        React.createElement("label", {className: "control-label col-xs-4"}, 
                            React.createElement("span", null, "Company Name")
                        ), 
                        React.createElement("div", {className: "col-xs-8"}, 
                            React.createElement("div", {className: "control-content"}, this.state.company)
                        )
                    )
                ));
        }

        if (this.state.isEditingEmail) {
            emailGroup = (
                React.createElement("div", null, 
                    React.createElement("div", {className: "form-group"}, 
                        React.createElement("label", {className: "control-label col-xs-4"}, 
                            React.createElement("span", null, "Email")
                        ), 
                        React.createElement("div", {className: "col-xs-8"}, 
                            React.createElement("input", {ref: "emailInput", type: "email", label: "Email", className: "form-control", value: this.state.email, placeholder: "", onBlur: this._onBlurEmail, onChange: this._onChangeEmail, onKeyDown: this._onKeyDownEmail})
                        )
                    ), 
                    React.createElement("div", {className: "form-group"}, 
                        React.createElement("label", {className: "control-label col-xs-4"}, 
                            React.createElement("span", null, "Current Password")
                        ), 
                        React.createElement("div", {className: "col-xs-8"}, 
                            React.createElement("input", {ref: "emailPasswordInput", type: "password", label: "Current Password", className: "form-control", value: this.state.emailPassword, placeholder: oldPasswordPlaceholder, onBlur: this._onBlurEmailPassword, onChange: this._onChangeEmailPassword, onKeyDown: this._onKeyDownEmailPassword})
                        )
                    ), 
                    React.createElement("div", null, 
                        React.createElement(ButtonToolbar, {className: "pull-right"}, 
                            this.state.emailAlert ? (React.createElement(Alert, {bsStyle: "danger"}, this.state.emailAlert)) : undefined, 
                            React.createElement(Button, {
                                bsStyle: "default", 
                                onClick: this._onCancelEmail}, 
                                "Cancel"
                            ), 
                            React.createElement(Button, {
                                bsStyle: "primary", 
                                onClick: this._onSaveEmail, 
                                disabled: user.isSyncing()}, 
                                 user.isSyncing() ? (React.createElement(Glyphicon, {className: "glyphicon-spin", glyph: "refresh"})) : "Save"
                            )
                        )
                    )
                ));
        }
        else {
            emailGroup = (
                React.createElement("div", {className: "form-group"}, 
                    React.createElement("label", {className: "control-label col-xs-4"}, 
                        React.createElement("span", null, "Email")
                    ), 
                    React.createElement("div", {className: "col-xs-7"}, 
                        React.createElement("div", {className: "control-content"}, this.state.email)
                    ), 
                    React.createElement("div", {className: "col-xs-1"}, 
                        React.createElement(Button, {
                            bsStyle: "default", 
                            onClick: this._onEditEmail}, 
                            "Edit"
                        )
                    )
                ));
        }

        if (this.state.isEditingPassword) {
            passwordGroup = (
                React.createElement("div", null, 
                    React.createElement("div", {className: "form-group"}, 
                        React.createElement("label", {className: "control-label col-xs-4"}, 
                            React.createElement("span", null, "New Password")
                        ), 
                        React.createElement("div", {className: "col-xs-8"}, 
                            React.createElement("input", {ref: "newPasswordInput", type: "password", label: "New Password", className: "form-control", value: this.state.newPassword, placeholder: newPasswordPlaceholder, onBlur: this._onBlurNewPassword, onChange: this._onChangeNewPassword, onKeyDown: this._onKeyDownNewPassword})
                        )
                    ), 
                    React.createElement("div", {className: "form-group"}, 
                        React.createElement("label", {className: "control-label col-xs-4"}, 
                            React.createElement("span", null, "Confirm Password")
                        ), 
                        React.createElement("div", {className: "col-xs-8"}, 
                            React.createElement("input", {ref: "confirmPasswordInput", type: "password", label: "Confirm Password", className: "form-control", value: this.state.confirmPassword, placeholder: "", onBlur: this._onBlurConfirmPassword, onChange: this._onChangeConfirmPassword, onKeyDown: this._onKeyDownConfirmPassword})
                        )
                    ), 
                    React.createElement("div", {className: "form-group"}, 
                        React.createElement("label", {className: "control-label col-xs-4"}, 
                            React.createElement("span", null, "Current Password")
                        ), 
                        React.createElement("div", {className: "col-xs-8"}, 
                            React.createElement("input", {ref: "oldPasswordInput", type: "password", label: "Current Password", className: "form-control", value: this.state.oldPassword, placeholder: oldPasswordPlaceholder, onBlur: this._onBlurOldPassword, onChange: this._onChangeOldPassword, onKeyDown: this._onKeyDownOldPassword})
                        )
                    ), 
                    React.createElement("div", null, 
                        React.createElement(ButtonToolbar, {className: "pull-right"}, 
                            this.state.passwordAlert ? (React.createElement(Alert, {bsStyle: "danger"}, this.state.passwordAlert)) : undefined, 
                            React.createElement(Button, {
                                bsStyle: "default", 
                                onClick: this._onCancelPassword}, 
                                "Cancel"
                            ), 
                            React.createElement(Button, {
                                bsStyle: "primary", 
                                onClick: this._onSavePassword, 
                                disabled: user.isSyncing()}, 
                                 user.isSyncing() ? (React.createElement(Glyphicon, {className: "glyphicon-spin", glyph: "refresh"})) : "Save"
                            )
                        )
                    )
                ));
        }
        else {
            passwordGroup = (
                React.createElement("div", {className: "form-group"}, 
                    React.createElement("label", {className: "control-label col-xs-4"}, 
                        React.createElement("span", null, "Password")
                    ), 
                    React.createElement("div", {className: "col-xs-8"}, 
                        React.createElement(Button, {
                            bsStyle: "default", 
                            onClick: this._onEditPassword}, 
                            "Change Password"
                        )
                    )
                ));
        }

        return (
            React.createElement("div", {id: "profile", className: "content"}, 
                React.createElement("div", {className: "wrapper"}, 
                    React.createElement("div", {className: "profile-header col-lg-6 col-md-8 col-sm-12 col-xs-12"}, 
                        React.createElement("h1", null, "Your Profile")
                    ), 
                    React.createElement("div", {className: "clearfix"}), 
                    React.createElement("div", {className: "profile-content col-lg-6 col-md-8 col-sm-12 col-xs-12 row"}, 
                        React.createElement("form", {className: "form-horizontal"}, 
                            profileGroup, 
                            React.createElement("div", {className: "col-xs-offset-4 col-xs-8"}, React.createElement("hr", null)), 
                            emailGroup, 
                            React.createElement("div", {className: "col-xs-offset-4 col-xs-8"}, React.createElement("hr", null)), 
                            passwordGroup
                        )
                    )
                )
            )
        );
    },

    // Profile

    _onEditProfile: function(event) {
        this.setState( {isEditingProfile: true} );
    },

    _onCancelProfile: function(event) {
        this.setState( _.extend({
            isEditingProfile: false,
            profileAlert: undefined
        }, this.getCurrentProfile()) );
    },

    _onSaveProfile: function(event) {
        var profile = this.getCurrentProfile();

        // Check if anything change, cancel if not
        if (this.state.firstname === profile.firstname &&
            this.state.lastname === profile.lastname &&
            this.state.displayname === profile.displayname &&
            this.state.company === profile.company) {
            this._onCancelProfile();
            return;
        }

        this.setState({ profileAlert: undefined });

        UserActions.update({
            firstname: this.state.firstname !== profile.firstname ? this.state.firstname : undefined,
            lastname: this.state.lastname !== profile.lastname ? this.state.lastname : undefined,
            displayname: this.state.displayname !== profile.displayname ? this.state.displayname : undefined,
            company: this.state.company !== profile.company ? this.state.company : undefined
        }).then(function(user) {
            //TODO should that be in willReceiveNewProps?
            this.setState( _.extend({isEditingProfile: false}, this.getCurrentProfile()) );
        }.bind(this), function(error) {
            this.setState({ profileAlert: error.message });
        }.bind(this));
    },

    // Email

    _onEditEmail: function(event) {
        this.setState( {isEditingEmail: true} );
    },

    _onCancelEmail: function(event) {
        this.setState({
            isEditingEmail: false,
            emailPassword: undefined,
            emailAlert: undefined,
            email: this.getCurrentEmail()
        });
    },

    _onSaveEmail: function(event) {
        // Check if anything changed, if not cancel
        if (this.state.email === this.getCurrentEmail()) {
            this._onCancelEmail();
            return;
        }

        // Validate
        // TODO better validation
        if (_.isEmpty(this.state.email)) {
            this.setState({ emailAlert: "Sorry, but we need your email" });
            return;
        }
        else if (_.isEmpty(this.state.emailPassword)) {
            this.setState({ emailAlert: "Please enter your current password for verification" });
            return;
        }

        this.setState({ emailAlert: undefined });

        UserActions.update({
            email: this.state.email,
            oldPassword: this.state.emailPassword
        }).then(function(user) {
            //TODO should that be in willReceiveNewProps?
            this.setState(_.extend({
                isEditingEmail: false,
                emailPassword: undefined
            }, this.getCurrentEmail()));
        }.bind(this), function(error) {
            this.setState({ emailAlert: error.message });
        }.bind(this));
    },

    // Password

    _onEditPassword: function(event) {
        this.setState( {isEditingPassword: true} );
    },

    _onCancelPassword: function(event) {
        this.setState({
            isEditingPassword: false,
            newPassword: undefined,
            confirmPassword: undefined,
            oldPassword: undefined,
            passwordAlert: undefined
        });
    },

    _onSavePassword: function(event) {
        // Check if anything change, cancel if not
        if (_.isEmpty(this.state.newPassword) &&
            _.isEmpty(this.state.confirmPassword) &&
            _.isEmpty(this.state.oldPassword)) {
            this._onCancelPassword();
            return;
        }

        // Validate
        // TODO better validation
        if (_.isEmpty(this.state.newPassword)) {
            this.setState({ passwordAlert: "Your new password can't be empty" });
            return;
        }
        else if (this.state.newPassword !== this.state.confirmPassword) {
            this.setState({ passwordAlert: "Your confirm password does not match" });
            return;
        }
        else if (_.isEmpty(this.state.oldPassword)) {
            this.setState({ passwordAlert: "We need your current password for verification" });
            return;
        }

        this.setState({ passwordAlert: undefined });

        UserActions.update({
            newPassword: this.state.newPassword,
            oldPassword: this.state.oldPassword
        }).then(function(user) {
            //TODO should that be in willReceiveNewProps?
            this.setState({
                isEditingPassword: false,
                newPassword: undefined,
                confirmPassword: undefined,
                oldPassword: undefined
            });
        }.bind(this), function(error) {
            this.setState({ passwordAlert: error.message });
        }.bind(this));
    },

    // Input Fields

    // First Name

    _onBlurFirstname: function(event) {
        this.setState( {firstname: event.target.value});
    },

    _onChangeFirstname: function(event) {
        this.setState( {firstname: event.target.value});
    },

    _onKeyDownFirstname: function(event) {
        if (event.keyCode === InputConstants.ENTER_KEY_CODE) {
            this.refs.lastnameInput.getDOMNode().focus();
            this.refs.lastnameInput.getDOMNode().select();
        }
    },

    // Last Name

    _onBlurLastname: function(event) {
        this.setState( {lastname: event.target.value});
    },

    _onChangeLastname: function(event) {
        this.setState( {lastname: event.target.value});
    },

    _onKeyDownLastname: function(event) {
        if (event.keyCode === InputConstants.ENTER_KEY_CODE) {
            this.refs.displaynameInput.getDOMNode().focus();
            this.refs.displaynameInput.getDOMNode().select();
        }
    },

    // Display Name

    _onBlurDisplayName: function(event) {
        this.setState( {displayname: event.target.value});
    },

    _onChangeDisplayName: function(event) {
        this.setState( {displayname: event.target.value});
    },

    _onKeyDownDisplayName: function(event) {
        if (event.keyCode === InputConstants.ENTER_KEY_CODE) {
            this.refs.companyInput.getDOMNode().focus();
            this.refs.companyInput.getDOMNode().select();
        }
    },

    // Company

    _onBlurCompany: function(event) {
        this.setState( {company: event.target.value});
    },

    _onChangeCompany: function(event) {
        this.setState( {company: event.target.value});
    },

    _onKeyDownCompany: function(event) {
        if (event.keyCode === InputConstants.ENTER_KEY_CODE) {
            this._onSaveProfile();
        }
    },

    // Email

    _onBlurEmail: function(event) {
        this.setState( {email: event.target.value});
    },

    _onChangeEmail: function(event) {
        this.setState( {email: event.target.value});
    },

    _onKeyDownEmail: function(event) {
        if (event.keyCode === InputConstants.ENTER_KEY_CODE) {
            this.refs.emailPasswordInput.getDOMNode().focus();
            this.refs.emailPasswordInput.getDOMNode().select();
        }
    },

    // Old Password (for email)

    _onBlurEmailPassword: function(event) {
        this.setState( {emailPassword: event.target.value});
    },

    _onChangeEmailPassword: function(event) {
        this.setState( {emailPassword: event.target.value});
    },

    _onKeyDownEmailPassword: function(event) {
        if (event.keyCode === InputConstants.ENTER_KEY_CODE) {
            this._onSaveEmail();
        }
    },

    // New Password

    _onBlurNewPassword: function(event) {
        this.setState( {newPassword: event.target.value});
    },

    _onChangeNewPassword: function(event) {
        this.setState( {newPassword: event.target.value});
    },

    _onKeyDownNewPassword: function(event) {
        if (event.keyCode === InputConstants.ENTER_KEY_CODE) {
            this.refs.confirmPasswordInput.getDOMNode().focus();
            this.refs.confirmPasswordInput.getDOMNode().select();
        }
    },

    // Confirm Password

    _onBlurConfirmPassword: function(event) {
        this.setState( {confirmPassword: event.target.value});
    },

    _onChangeConfirmPassword: function(event) {
        this.setState( {confirmPassword: event.target.value});
    },

    _onKeyDownConfirmPassword: function(event) {
        if (event.keyCode === InputConstants.ENTER_KEY_CODE) {
            this.refs.oldPasswordInput.getDOMNode().focus();
            this.refs.oldPasswordInput.getDOMNode().select();
        }
    },

    // Old Password (to change password)

    _onBlurOldPassword: function(event) {
        this.setState( {oldPassword: event.target.value});
    },

    _onChangeOldPassword: function(event) {
        this.setState( {oldPassword: event.target.value});
    },

    _onKeyDownOldPassword: function(event) {
        if (event.keyCode === InputConstants.ENTER_KEY_CODE) {
            this._onSavePassword();
        }
    }
});

module.exports = Profile;
