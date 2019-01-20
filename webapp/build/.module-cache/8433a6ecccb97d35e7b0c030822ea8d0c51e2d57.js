"use strict";

var React = require("react");
var ZeroClipboard = require("zeroclipboard");
ZeroClipboard.config( { swfPath: "assets/flash/ZeroClipboard.swf" } );
require('bootstrap');

var InviteUser = React.createClass({displayName: "InviteUser",
    mixins: [require("react-router").Navigation],

    propTypes: {
        company: React.PropTypes.object.isRequired
    },

    clipboard: null,

    getInitialState: function() {
        return {
            timeout: null
        };
      },

    componentDidMount: function() {
        this.clipboard = new ZeroClipboard($("#clipboardButton"));
    },

    getUrl: function(token) {
        return "https://bomsquad.io/invite/" + token;
    },

    render: function() {
        var company = this.props.company;
        if (!company) {
            return this.renderError();
        }

        var token = company.get("token");
        if (!token) {
            return this.renderError();
        }

        return this.renderPage(this.getUrl(token));
    },

    renderError: function(){
        return React.createElement("div", {className: "alert alert-danger", role: "alert"}, "A problem occurred while attempting to generate the invite URL. Please try again.")
    },

    renderPage: function(url){
        var link =
            React.createElement("div", {className: "row no-gutter"}, 
                React.createElement("div", {className: "input-group col-md-12"}, 
                    React.createElement("span", {className: "input-group-addon"}, 
                        React.createElement("span", {className: "glyphicon glyphicon-link", "aria-hidden": "true"})
                    ), 
                    React.createElement("input", {type: "text", className: "form-control input-pre-addon-no-border", value: url, onChange: function() {}}), 
                    React.createElement("span", {className: "input-group-btn"}, 
                        React.createElement("button", {
                            className: "btn btn-default", 
                            type: "button", 
                            id: "clipboardButton", 
                            "data-clipboard-text": url, 
                            "data-toggle": "popover", 
                            "data-placement": "top", 
                            "data-content": "Link copied to clipboard", 
                            "data-trigger": "manual", 
                            onClick: this.onClick}, "Copy")
                    )
                )
            );

        var inviteLinkPanel =
            React.createElement("div", {className: "col-md-6 col-md-offset-3 no-gutter"}, 
                React.createElement("div", {className: "panel panelDefault"}, 
                    React.createElement("div", {className: "panel-body"}, 
                        React.createElement("div", {className: "row no-gutter"}, 
                            React.createElement("div", {className: "col-md-6"}, 
                                React.createElement("h4", null, "Create an Invite Link")
                            ), 
                            React.createElement("div", {className: "col-md-6"}, 
                                React.createElement("span", {className: "pull-right"}, "Invite multiple users at once with one link")
                            )
                        ), 
                        link
                    )
                )
            );

        return (
            React.createElement("div", {id: "inviteUser", className: "content"}, 
                React.createElement("div", {className: "page-header"}, 
                    React.createElement("h1", null, "BoM Squad Invite Manager")
                ), 
                React.createElement("div", {className: "row no-gutter"}, 
                    inviteLinkPanel
                )
            )
        );
    },

    disablePopover: function() {
        return setTimeout(function (){
                console.log("clear");
                $("#clipboardButton").popover("hide");
                this.setState({
                    timeout: null
                });
        }.bind(this), 1000);
    },

    onClick: function() {
        if(!!this.state.timeout) {
            clearTimeout(this.state.timeout);
            console.log("cleared timeout");
        } else {
            console.log("show");
            $("#clipboardButton").popover("show");
        }

        this.setState({
            timeout: this.disablePopover()
        });
    }

});

module.exports = InviteUser;
