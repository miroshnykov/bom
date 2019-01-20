"use strict";

var React = require("react");
var Router = require("react-router");
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;
var RouteHandler = Router.RouteHandler;

var InviteManager = require("screens/InviteManager.jsx");
var InviteAccept = require("screens/InviteAccept.jsx");
var InviteConfirm = require("screens/InviteConfirm.jsx");
var NavigationError = require("screens/NavigationError.jsx");

var App = React.createClass({
    render: function() {
        return (
            <RouteHandler />
        );
    }
});

var routes = (
	<Route name="app" path="/" handler={App}>
        <Route name="error" path="error/:code" handler={NavigationError} />
	    <Route handler={InviteManager}>
	        <Route name="confirm" path=":inviteToken/confirm" handler={InviteConfirm} />
	        <Route name="accept" path=":inviteToken" handler={InviteAccept} />
	    </Route>
	    <NotFoundRoute handler={NavigationError} />
	</Route>
);

var InviteRouter = Router.create({
    routes: routes,
});

module.exports = InviteRouter;
