"use strict";

var React = require("react");
var Router = require("react-router");
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

var InviteManager = require("../screens/InviteManager.react");
var InviteAccept = require("../screens/InviteAccept.react");

var routes = (
    React.createElement(Route, {name: "app", path: "/", handler: InviteManager}, 
        React.createElement(Route, {name: "accept", path: ":token", handler: InviteAccept})
    )
);

var InviteRouter = Router.create({
  routes: routes,
});

module.exports = InviteRouter;
