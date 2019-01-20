"use strict";

var React = require("react");
var RouteHandler = require("react-router").RouteHandler;
var _ = require("underscore");

var Header = require("../components/Header.react");
var CompanyStore = require("../stores/CompanyStore");
var UserStore = require("../stores/UserStore");
var CompanyActions = require("../actions/CompanyActions");

function getState() {
    return {
        user: UserStore,
        allCompanies: CompanyStore
    };
}

var InviteManager = React.createClass({displayName: "InviteManager",

    getInitialState: function() {
        return getState();
    },

    componentDidMount: function() {
        UserStore.on("all", this.update);
        CompanyStore.on("all", this.update);

        CompanyActions.fetch(this.props.params.token).then(undefined, function(error) {
            // TODO redirect to error page
            console.log("TODO redirect to 404");
            console.log(error);
        }.bind(this));
    },

    componentWillUnmount: function() {
        UserStore.off("all", this.update);
        CompanyStore.off("all", this.update);
    },

    render: function() {
        var user = this.state.user;
        var company = this.state.allCompanies.findWhere({token: this.props.params.token});
        if (!company) { return null; }

        return (
            React.createElement("div", {className: "container-fluid invite-manager"}, 
                React.createElement("div", {className: "text-center"}, 
                    React.createElement("div", {className: "logo"})
                ), 
                React.createElement(RouteHandler, {
                    params: this.props.params, 
                    user: user, 
                    company: company})
            ));
    },

    update: function() {
        this.setState(getState());
    },
});

module.exports = InviteManager;
