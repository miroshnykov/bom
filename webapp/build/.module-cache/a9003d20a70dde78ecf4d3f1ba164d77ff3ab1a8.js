"use strict";

var React = require("react");
var Router = require("react-router");
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

var BomManager = require("../screens/BomManager.react");
var Dashboard = require("../screens/Dashboard.react");
var Product = require("../screens/Product.react");
var ProductHistory = require("../screens/ProductHistory.react");
var Bom = require("../screens/Bom.react");
var Profile = require("../screens/Profile.react");
var BomHistory = require("../screens/BomHistory.react");
var BomComments = require("../screens/BomComments.react");
var BomImport = require("../screens/BomImport.react");
var BomImportMatch = require("../screens/BomImportMatch.react");
var Welcome = require("../screens/Welcome.react");
var InviteUser = require("../screens/InviteUser.react");

var routes = (
    React.createElement(Route, {name: "app", path: "/", handler: BomManager}, 

        React.createElement(DefaultRoute, {name: "dashboard", handler: Dashboard}), 

        React.createElement(Route, {name: "bom", path: "product/:productId/bom/:bomId", handler: Bom}), 
        React.createElement(Route, {name: "bomComments", path: "product/:productId/bom/:bomId/comments", handler: BomComments}), 
        React.createElement(Route, {name: "bomHistory", path: "product/:productId/bom/:bomId/history", handler: BomHistory}), 
        React.createElement(Route, {name: "bomImport", path: "product/:productId/bom/:bomId/import", handler: BomImport}), 
        React.createElement(Route, {name: "bomImportMatch", path: "product/:productId/bom/:bomId/import/match", handler: BomImportMatch}), 
        React.createElement(Route, {name: "newProductImport", path: "product/import", handler: BomImport}), 
        React.createElement(Route, {name: "newProductImportMatch", path: "product/import/match", handler: BomImportMatch}), 
        React.createElement(Route, {name: "product", path: "product/:productId", handler: Product}), 
        React.createElement(Route, {name: "productHistory", path: "product/:productId/history", handler: ProductHistory}), 
        React.createElement(Route, {name: "productImport", path: "product/:productId/import", handler: BomImport}), 
        React.createElement(Route, {name: "productImportMatch", path: "product/:productId/import/match", handler: BomImportMatch}), 
        React.createElement(Route, {name: "profile", handler: Profile}), 
        React.createElement(Route, {name: "welcome", path: "welcome", handler: Welcome}), 
        React.createElement(Route, {name: "inviteUser", path: "/company/invite", handler: InviteUser})
  )
);

var BomRouter = Router.create({
  routes: routes,
});

module.exports = BomRouter;
