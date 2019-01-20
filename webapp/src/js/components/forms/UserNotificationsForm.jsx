"use strict";

var _ = require("underscore");
var backboneMixin = require("backbone-react-component");
var cx = require("react/lib/cx");
var React = require("react");

var config = require("config");
var Toggle = require("react-toggle");
var Spinner = require("components/Spinner.jsx");

var UserNotificationsForm = React.createClass({
    mixins: [backboneMixin],

    getInitialState: function() {
        return {
            desktopNotifications: config.showNotifications,
            emailNotifications: this.getModel().get("receiveEmails")
        };
    },

    render: function() {
        return (
            <form>
                <div className="row form-group">
                    <div className="col-md-6">
                        <div>Desktop notifications</div>
                        <div>
                            <span className={cx({
                                "small": true,
                                "text-danger": !config.capabilities.notifications || config.deniedNotifications})}>
                                {config.capabilities.notifications ?
                                    (config.deniedNotifications ?
                                        "You have blocked notifications for this site. Change permissions in your browser to enable notifications." :
                                        "Receive desktop notifications about changes made by your team members.") :
                                    "Desktop notifications are not supported by your browser."}
                            </span>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <Toggle
                            checked={this.state.desktopNotifications}
                            hasFeedback={true}
                            onChange={this.onChangeDesktop}
                            disabled={!config.capabilities.notifications || config.deniedNotifications} />
                    </div>
                </div>
                <div className="row form-group">
                    <div className="col-md-6">
                        <div>Email notifications</div>
                        <div className="small">Receive email notifications when your team members post new comments.</div>
                    </div>
                    <div className="col-md-6">
                        <Toggle
                            checked={this.state.emailNotifications}
                            hasFeedback={true}
                            onChange={this.onChangeEmail} />
                    </div>
                </div>
            </form>
        );
    },

    onChangeDesktop: function(event) {
        config.setNotifications(event.target.checked).then(function(enabled) {
            this.setState({
                desktopNotifications: enabled
            });
        }.bind(this), function() {
            this.setState({
                desktopNotifications: false
            });
        });
    },

    onChangeEmail: function(event) {
        var attrs = {
            receiveEmails: event.target.checked
        };

        this.setState({
            emailNotifications: event.target.checked
        });

        this.getModel().save(attrs, {wait: true}).then(undefined, function(error) {
            this.setState({
                emailNotifications: !event.target.checked
            });
        }.bind(this));
    }
});

module.exports = UserNotificationsForm;
