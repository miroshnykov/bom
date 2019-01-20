"use strict";

var _ = require("underscore");
var React = require("react");
var cx = require("react/lib/cx");

var UserStore = require("stores/UserStore");
var Scroll = require("components/Scroll.jsx");
var UserProfileForm = require("components/forms/UserProfileForm.jsx");
var UserPasswordForm = require("components/forms/UserPasswordForm.jsx");
var UserNotificationsForm = require("components/forms/UserNotificationsForm.jsx");
var CompanyProfileForm = require("components/forms/CompanyProfileForm.jsx");

var UserAccount = React.createClass({

    getInitialState: function() {
        return {
            tab: "profile"
        };
    },

    render: function() {
        var user = UserStore.current;
        var tabs = [
            { name: "Profile", panel: this.state.tab === "profile" ? <UserProfileForm model={user} /> : null },
            { name: "Password", panel: this.state.tab === "password" ? <UserPasswordForm model={user} /> : null },
            { name: "Notifications", panel: this.state.tab === "notifications" ? <UserNotificationsForm model={user} /> : null },
            { name: "Company", panel: this.state.tab === "company" ? <CompanyProfileForm model={user} /> : null }
        ];

        return (
            <Scroll className="user-account">
                <div className="col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3">
                    <h3>Your Account</h3>
                    <div className="panel">
                        <div className="panel-header">
                            <div className="pull-right">
                                <a href="https://en.gravatar.com/emails/" target="_blank">
                                    <img className="img-thumbnail" src={user.getAvatarUrl()} />
                                </a>
                            </div>
                            <nav>
                                <ul role="tablist" className="nav nav-tabs">
                                    {tabs.map(function(tab) {
                                        return this.renderTab(tab.name);
                                    }, this)}
                                </ul>
                            </nav>
                        </div>
                        <div className="panel-body">
                            <div className="tab-content">
                                {tabs.map(function(tab) {
                                    return this.renderPanel(tab.name, tab.panel);
                                }, this)}
                            </div>
                        </div>
                    </div>
                </div>
            </Scroll>
        );
    },

    renderTab: function(name) {
        var id = name.toLowerCase();
        return (
            <li key={id} className={this.state.tab === id ? "active" : false} role="presentation">
                <a name={id} role="tab" href="" aria-selected={this.state.tab === id ? "true" : "false"} onClick={this.showTab}>
                    {name}
                </a>
            </li>
        );
    },

    renderPanel: function(name, panel) {
        var id = name.toLowerCase();

        return (
            <div role="tabpanel"
                key={id}
                aria-hidden={this.state.tab === id ? "false" : "true"}
                className={cx({
                    "tab-pane": true,
                    "fade": true,
                    "active": this.state.tab === id,
                    "in": this.state.tab === id})}>
                {panel}
            </div>
        );
    },

    showTab: function(event) {
        event.preventDefault();
        this.setState({
            tab: event.target.name
        });
    }
});

module.exports = UserAccount;
