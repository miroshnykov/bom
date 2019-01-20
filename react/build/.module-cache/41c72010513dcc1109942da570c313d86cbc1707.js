var React = require("react");
var Input = require("react-bootstrap").Input;
var Button = require("react-bootstrap").Button;
var ButtonToolbar = require("react-bootstrap").ButtonToolbar;
var Alert = require("react-bootstrap").Alert;
var Glyphicon = require("react-bootstrap").Glyphicon;

var InputConstants = require("../constants/InputConstants");
var UserActions = require("../actions/UserActions");
var TextInput = require("../components/TextInput.react");

var Profile = React.createClass({displayName: "Profile",

    propTypes: {
        user: React.PropTypes.object.isRequired,
        company: React.PropTypes.object.isRequired
    },

    getCurrentProfile: function(props) {
        props = props || this.props;

        return {
            firstname: props.user.get("firstname") || "",
            lastname: props.user.get("lastname") || "",
            displayname: props.user.get("displayname") || "",
            company: props.company.get("name") || "",
        };
    },

    getCurrentEmail: function(props) {
        props = props || this.props;
        return props.user.get("email");
    },

    getInitialState: function() {
        return _.extend({
            isEditingProfile: false,
            isEditingEmail: false,
            isEditingPassword: false,
            lastSaved: undefined,
            emailPassword: undefined,
            newPassword: undefined,
            confirmPassword: undefined,
            oldPassword: undefined,
            email: this.getCurrentEmail(),
        }, this.getCurrentProfile());
    },

    componentDidMount: function() {
        this._addScroll();
    },

    componentWillReceiveProps: function(nextProps) {
        if (!this.state.isEditingProfile) {
            this.setState( this.getCurrentProfile(nextProps) );
        }

        if (!this.state.isEditingEmail) {
            this.setState( {email: this.getCurrentEmail(nextProps)} );
        }
    },

    componentDidUpdate: function(prevProps, prevState) {
        $(this.getDOMNode()).getNiceScroll().resize();

        // Trigger a fake mouse enter
        // This solve a bug that seem to fail to update the width
        // of the horizontal scrollbar when the left panel opens
        $(this.getDOMNode()).trigger("mouseenter");

        if (this.state.isEditingProfile && !prevState.isEditingProfile) {
            this._focus("firstname");
        }

        // TODO focus on first invalid field
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
        var company = this.props.company;

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
                            React.createElement(TextInput, {
                                ref: "firstname", 
                                label: "First Name", 
                                value: this.state.firstname, 
                                placeholder: firstnamePlaceholder, 
                                error: this.props.user.hasValidationErrors('firstname') ? this.props.user.getValidationErrors('firstname')[0] : undefined, 
                                hasFeedback: true, 
                                onSave: this._onSaveFirstname, 
                                onCancel: this._onCancelFirstname})
                        )
                    ), 
                    React.createElement("div", {className: "form-group"}, 
                        React.createElement("label", {className: "control-label col-xs-4"}, 
                            React.createElement("span", null, "Last Name")
                        ), 
                        React.createElement("div", {className: "col-xs-8"}, 
                            React.createElement(TextInput, {
                                ref: "lastname", 
                                label: "Last Name", 
                                value: this.state.lastname, 
                                error: user.hasValidationErrors('lastname') ? user.getValidationErrors('lastname')[0] : undefined, 
                                hasFeedback: true, 
                                onSave: this._onSaveLastname, 
                                onCancel: this._onCancelLastname})
                        )
                    ), 
                    React.createElement("div", {className: "form-group"}, 
                        React.createElement("label", {className: "control-label col-xs-4"}, 
                            React.createElement("span", null, "Display Name")
                        ), 
                        React.createElement("div", {className: "col-xs-8"}, 
                            React.createElement(TextInput, {
                                ref: "displayname", 
                                label: "Display Name", 
                                value: this.state.displayname, 
                                placeholder: displaynamePlaceholder, 
                                error: user.hasValidationErrors('displayname') ? user.getValidationErrors('displayname')[0] : undefined, 
                                hasFeedback: true, 
                                onSave: this._onSaveDisplayName, 
                                onCancel: this._onCancelDisplayName})
                        )
                    ), 
                    React.createElement("div", {className: "form-group"}, 
                        React.createElement("label", {className: "control-label col-xs-4"}, 
                            React.createElement("span", null, "Company Name")
                        ), 
                        React.createElement("div", {className: "col-xs-8"}, 
                            React.createElement(TextInput, {
                                ref: "company", 
                                label: "Company Name", 
                                value: this.state.company, 
                                error: company.hasValidationErrors('company') ? company.getValidationErrors('company')[0] : undefined, 
                                hasFeedback: true, 
                                onSave: this._onSaveCompany, 
                                onCancel: this._onCancelCompany})
                        )
                    ), 
                    React.createElement("div", null, 
                        React.createElement(ButtonToolbar, {className: "pull-right"}, 
                            !user.hasValidationErrors() && user.hasServerError() && this.state.lastSaved === "profile" ?
                                (React.createElement(Alert, {bsStyle: "danger"}, user.getServerError())) :
                                undefined, 
                            React.createElement(Button, {
                                bsStyle: "default", 
                                onClick: this._onCancelProfile}, 
                                "Cancel"
                            ), 
                            React.createElement(Button, {
                                bsStyle: "primary", 
                                onClick: this._onSaveProfile, 
                                disabled: user.isSyncing()}, 
                                 user.isSyncing() && this.state.lastSaved === "profile" ?
                                    (React.createElement(Glyphicon, {className: "glyphicon-spin", glyph: "refresh"})) :
                                    "Save"
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
                            React.createElement(TextInput, {
                                ref: "email", 
                                type: "email", 
                                label: "Email", 
                                value: this.state.email, 
                                error: this.props.user.hasValidationErrors('email') ? this.props.user.getValidationErrors('email')[0] : undefined, 
                                hasFeedback: true, 
                                onSave: this._onSaveEmailAddress, 
                                onCancel: this._onCancelEmailAddress})
                        )
                    ), 
                    React.createElement("div", {className: "form-group"}, 
                        React.createElement("label", {className: "control-label col-xs-4"}, 
                            React.createElement("span", null, "Current Password")
                        ), 
                        React.createElement("div", {className: "col-xs-8"}, 
                            React.createElement(TextInput, {
                                ref: "emailPassword", 
                                type: "password", 
                                label: "Current Password", 
                                value: this.state.emailPassword, 
                                placeholder: oldPasswordPlaceholder, 
                                error: this.state.lastSaved === "email" && this.props.user.hasValidationErrors('oldPassword') ? this.props.user.getValidationErrors('oldPassword')[0] : undefined, 
                                hasFeedback: true, 
                                onSave: this._onSaveEmailPassword, 
                                onCancel: this._onCancelEmailPassword})
                        )
                    ), 
                    React.createElement("div", null, 
                        React.createElement(ButtonToolbar, {className: "pull-right"}, 
                            !user.hasValidationErrors() && user.hasServerError() && this.state.lastSaved === "email" ?
                                    (React.createElement(Alert, {bsStyle: "danger"}, user.getServerError())) :
                                    undefined, 
                            React.createElement(Button, {
                                bsStyle: "default", 
                                onClick: this._onCancelEmail}, 
                                "Cancel"
                            ), 
                            React.createElement(Button, {
                                bsStyle: "primary", 
                                onClick: this._onSaveEmail, 
                                disabled: user.isSyncing()}, 
                                 user.isSyncing() && this.state.lastSaved === "email" ?
                                    (React.createElement(Glyphicon, {className: "glyphicon-spin", glyph: "refresh"})) :
                                    "Save"
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
                            React.createElement(TextInput, {
                                ref: "newPassword", 
                                type: "password", 
                                label: "New Password", 
                                value: this.state.newPassword, 
                                placeholder: newPasswordPlaceholder, 
                                error: this.props.user.hasValidationErrors('newPassword') ? this.props.user.getValidationErrors('newPassword')[0] : undefined, 
                                hasFeedback: true, 
                                onSave: this._onSaveNewPassword, 
                                onCancel: this._onCancelNewPassword})
                        )
                    ), 
                    React.createElement("div", {className: "form-group"}, 
                        React.createElement("label", {className: "control-label col-xs-4"}, 
                            React.createElement("span", null, "Confirm Password")
                        ), 
                        React.createElement("div", {className: "col-xs-8"}, 
                            React.createElement(TextInput, {
                                ref: "confirmPassword", 
                                type: "password", 
                                label: "Confirm Password", 
                                value: this.state.confirmPassword, 
                                error: this.props.user.hasValidationErrors('confirmPassword') ? this.props.user.getValidationErrors('confirmPassword')[0] : undefined, 
                                hasFeedback: true, 
                                onSave: this._onSaveConfirmPassword, 
                                onCancel: this._onCancelConfirmPassword})
                        )
                    ), 
                    React.createElement("div", {className: "form-group"}, 
                        React.createElement("label", {className: "control-label col-xs-4"}, 
                            React.createElement("span", null, "Current Password")
                        ), 
                        React.createElement("div", {className: "col-xs-8"}, 
                            React.createElement(TextInput, {
                                ref: "oldPassword", 
                                type: "password", 
                                label: "Current Password", 
                                value: this.state.oldPassword, 
                                placeholder: oldPasswordPlaceholder, 
                                error: this.state.lastSaved === "password" && this.props.user.hasValidationErrors('oldPassword') ? this.props.user.getValidationErrors('oldPassword')[0] : undefined, 
                                hasFeedback: true, 
                                onSave: this._onSaveOldPassword, 
                                onCancel: this._onCancelOldPassword})
                        )
                    ), 
                    React.createElement("div", null, 
                        React.createElement(ButtonToolbar, {className: "pull-right"}, 
                            !user.hasValidationErrors() && user.hasServerError() && this.state.lastSaved === "password" ?
                                    (React.createElement(Alert, {bsStyle: "danger"}, user.getServerError())) :
                                    undefined, 
                            React.createElement(Button, {
                                bsStyle: "default", 
                                onClick: this._onCancelPassword}, 
                                "Cancel"
                            ), 
                            React.createElement(Button, {
                                bsStyle: "primary", 
                                onClick: this._onSavePassword, 
                                disabled: user.isSyncing()}, 
                                 user.isSyncing() && this.state.lastSaved === "password" ?
                                    (React.createElement(Glyphicon, {className: "glyphicon-spin", glyph: "refresh"})) :
                                    "Save"
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
        UserActions.validate();

        this.setState( _.extend({
            isEditingProfile: false
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

        this._unfocus(["firstname", "lastname", "displayname", "company"]);
        this.setState({ lastSaved: "profile" });

        UserActions.update({
            firstname: this.state.firstname !== profile.firstname ? this.state.firstname : undefined,
            lastname: this.state.lastname !== profile.lastname ? this.state.lastname : undefined,
            displayname: this.state.displayname !== profile.displayname ? this.state.displayname : undefined,
            company: this.state.company !== profile.company ? this.state.company : undefined
        }).then(function(user) {
            this.setState({ isEditingProfile: false });
        }.bind(this), function(error) {});
    },

    // Email

    _onEditEmail: function(event) {
        this.setState( {isEditingEmail: true} );
    },

    _onCancelEmail: function(event) {
        this.setState({
            isEditingEmail: false,
            emailPassword: undefined,
            email: this.getCurrentEmail()
        });
    },

    _onSaveEmail: function(event) {
        // Check if anything changed, if not cancel
        if (this.state.email === this.getCurrentEmail()) {
            this._onCancelEmail();
            return;
        }

        this.setState({
            lastSaved: "email",
        });

        UserActions.update({
            email: this.state.email,
            oldPassword: this.state.emailPassword
        }).then(function(user) {
            this.setState({
                isEditingEmail: false,
                emailPassword: undefined
            });
        }.bind(this), function(error) {});
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
            oldPassword: undefined
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

        this.setState({
            lastSaved: "password"
        });

        UserActions.update({
            newPassword: this.state.newPassword,
            confirmPassword: this.state.confirmPassword,
            oldPassword: this.state.oldPassword
        }).then(function(user) {
            this.setState({
                isEditingPassword: false,
                newPassword: undefined,
                confirmPassword: undefined,
                oldPassword: undefined
            });
        }.bind(this), function(error) {});
    },

    // Input Fields

    _focus: function(ref) {
        var input = this.refs[ref].getInputDOMNode();
        if (!input) { return; }

        input.focus();
        input.select();
    },

    _unfocus: function(refs) {
        if (!refs) { return; }
        refs = _.isArray(refs) ? refs : [refs];

        _.each(refs, function(ref) {
            var input = this.refs[ref].getInputDOMNode();
            if (!input) { return; }

            input.blur();
        }, this);
    },

    // First Name

    _onCancelFirstname: function() {
        this.setState( {isEditingProfile: false} );
    },

    _onSaveFirstname: function(firstname) {
        this.setState( {firstname: firstname});
    },

    // Last Name

    _onCancelLastname: function() {
        this.setState( {isEditingProfile: false} );
    },

    _onSaveLastname: function(lastname) {
        this.setState( {lastname: lastname});
    },

    // Display Name

    _onCancelDisplayName: function() {
        this.setState( {isEditingProfile: false} );
    },

    _onSaveDisplayName: function(displayname) {
        this.setState( {displayname: displayname});
    },

    // Company

    _onCancelCompany: function() {
        this.setState( {isEditingProfile: false} );
    },

    _onSaveCompany: function(company) {
        this.setState( {company: company});
    },

    // Email

    _onCancelEmailAddress: function() {
        this.setState( {isEditingEmail: false} );
    },

    _onSaveEmailAddress: function(email) {
        this.setState( {email: email});
    },

    // Old Password (for email)

    _onCancelEmailPassword: function() {
        this.setState( {isEditingEmail: false} );
    },

    _onSaveEmailPassword: function(password) {
        this.setState( {emailPassword: password});
    },

    // New Password

    _onCancelNewPassword: function() {
        this.setState( {isEditingPassword: false} );
    },

    _onSaveNewPassword: function(password) {
        this.setState( {newPassword: password});
    },

    // Confirm Password

    _onCancelConfirmPassword: function() {
        this.setState( {isEditingPassword: false} );
    },

    _onSaveConfirmPassword: function(password) {
        this.setState( {confirmPassword: password});
    },

    // Old Password (to change password)

    _onCancelOldPassword: function() {
        this.setState( {isEditingPassword: false} );
    },

    _onSaveOldPassword: function(password) {
        this.setState( {oldPassword: password});
    },
});

module.exports = Profile;
