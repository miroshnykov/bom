"use strict";

var UserStore = require("stores/UserStore");
var AcceptedInvite = require("components/AcceptedInvite.jsx");
var EmailInviteForm = require("components/forms/EmailInviteForm.jsx");
var List = require("components/List.jsx");
var PendingInvite = require("components/PendingInvite.jsx");
var React = require("react");
var UserInviteCollection = require("collections/UserInviteCollection");
var Scroll = require("components/Scroll.jsx");

var ZeroClipboard = require("zeroclipboard");
ZeroClipboard.config( { swfPath: "assets/flash/ZeroClipboard.swf" } );
require("bootstrap");

var InviteUser = React.createClass({
    mixins: [require("react-router").Navigation],

    clipboard: null,

    getInitialState: function() {
        return {
            collection: null
        };
    },

    componentWillMount: function() {
        var company = UserStore.current.getCurrentCompany();
        if (!company) { return; }

        var userInvites = new UserInviteCollection();
        userInvites.fetch();

        this.setState({
            collection: userInvites
        });
    },

    componentDidMount: function() {
        this.clipboard = new ZeroClipboard($("#clipboardButton"));
    },

    getUrl: function(token) {
        return window.location.protocol + "//" + window.location.hostname + "/invite/#/" + token;
    },

    render: function() {
        var company = UserStore.current.getCurrentCompany();
        if (!company || !company.id) {
            return this.renderError();
        }

        return this.renderPage(this.getUrl(company.id));
    },

    renderError: function() {
        return (
            <div className="alert alert-danger" role="alert">
                A problem occurred while attempting to generate the invite URL. Please try again.
            </div>);
    },

    renderPage: function(url) {
        return (
            <Scroll className="invite-user">
                <div className="col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3">
                    <h3>Invite Team Members</h3>
                    {this.renderInviteLinkSection(url)}
                    {this.renderEmailSection()}
                    {this.renderPendingSection()}
                    {this.renderCreatedSection()}
                </div>
            </Scroll>
        );
    },

    renderInviteLinkSection: function(url) {
        return (
            <div className="panel">
                <div className="panel-header">
                    <div className="col-md-12">
                        <h6 className="pull-right">
                            Invite multiple users at once with a url
                        </h6>
                        <h5 className="text-uppercase">Share an Invite Link</h5>
                    </div>
                </div>
                <div className="panel-body">
                    <div className="input-group">
                        <span className="input-group-addon">
                            <span className="fa fa-link" aria-hidden="true"></span>
                        </span>
                        <input type="text" className="form-control" value={url} onChange={function() {}}/>
                        <span className="input-group-btn">
                            <button
                                className="btn btn-primary"
                                type="button"
                                id="clipboardButton"
                                data-clipboard-text={url}
                                data-toggle="popover"
                                data-placement="top"
                                data-content="Link copied to clipboard"
                                data-trigger="manual"
                                onClick={this.onClick}>
                                Copy
                            </button>
                        </span>
                    </div>
                </div>
            </div>);
    },

    renderEmailSection: function() {
        return (
            <div className="panel">
                <div className="panel-header">
                    <div className="col-md-12">
                        <h6 className="pull-right">
                            Invite a single user via email
                        </h6>
                        <h5 className="text-uppercase">Invite a New Member</h5>
                    </div>
                </div>
                <div className="panel-body">
                    <EmailInviteForm model={this.state.collection.getNewInvite()} isEmailInvited={this.isEmailInvited} />
                </div>
            </div>);
    },

    renderPendingSection: function() {
        var filter = function(item) {
            return item.get("status") === item.INVITE_STATUS_PENDING;
        };

        return (
            <div className="panel">
                <div className="panel-header">
                    <div className="col-md-12">
                        <h5 className="text-uppercase">Pending Invitations</h5>
                    </div>
                </div>
                <div className="panel-body">
                    <List
                        collection={this.state.collection}
                        emptyText="There are no pending invitations"
                        filter={filter}
                        item={PendingInvite} />
                </div>
            </div>);
    },

    renderCreatedSection: function() {
        var filter = function(item) {
            return item.get("status") === item.INVITE_STATUS_ACCEPTED;
        };

        return (
            <div className="panel">
                <div className="panel-header">
                    <div className="col-md-12">
                        <h5 className="text-uppercase">Accepted Invitations</h5>
                    </div>
                </div>
                <div className="panel-body">
                    <List
                        collection={this.state.collection}
                        emptyText="There are no accepted invitations"
                        filter={filter}
                        item={AcceptedInvite} />
                </div>
            </div>);
    },

    isEmailInvited: function(email) {
        return this.state.collection.findWhere({email: email});
    },

    disablePopover: function() {
        return setTimeout(function (){
                $("#clipboardButton").popover("hide");
                this.setState({
                    timeout: null
                });
        }.bind(this), 1000);
    },

    onClick: function() {
        if(!!this.state.timeout) {
            clearTimeout(this.state.timeout);
        } else {
            $("#clipboardButton").popover("show");
        }

        this.setState({
            timeout: this.disablePopover()
        });
    }

});

module.exports = InviteUser;
