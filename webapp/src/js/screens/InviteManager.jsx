"use strict";

var _ = require("underscore");
var React = require("react");
var RouteHandler = require("react-router").RouteHandler;
var Navigation = require("react-router").Navigation;

var Footer = require("components/Footer.jsx");
var SimpleHeader = require("components/SimpleHeader.jsx");
var UserStore = require("stores/UserStore");
var UserInviteModel = require("models/UserInviteModel");
var CompanyModel = require("models/CompanyModel");

var InviteManager = React.createClass({
    mixins: [Navigation],

    getInitialState: function() {
        return {
            user: null,
            company: null,
            invite: null
        };
    },

    componentWillMount: function() {
        if (this.props.params.inviteToken) {
            this.fetchInvite(this.props.params.inviteToken)
        }
        else {
            this.transitionTo("error", {"code": 404});
        }
    },

    fetchCompany: function(token) {
        var company = new CompanyModel();

        company.fetchByToken(token).then(function(company) {

            this.setState({
                user: UserStore.current,
                invite: null,
                company: company
            });

        }.bind(this), function(error) {
            this.transitionTo("error", {"code": 404});
        }.bind(this));
    },

    fetchInvite: function(token) {
        var invite = new UserInviteModel();
        invite.fetchByToken(token).then(function() {

            this.setState({
                user: UserStore.current,
                invite: invite
            });

        }.bind(this), function(error) {
            this.fetchCompany(token);
        }.bind(this));
    },

    render: function() {
        if (!this.state.user) {
            return null;
        }

        return (
            <div className="container container-valign">
                <div className="container-wrapper">
                    <div className="col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4">
                        <SimpleHeader />
                        <RouteHandler
                            params={this.props.params}
                            model={this.state.user}
                            company={this.state.company}
                            invite={this.state.invite} />
                        <Footer />
                    </div>
                </div>
            </div>);
    }
});

module.exports = InviteManager;
