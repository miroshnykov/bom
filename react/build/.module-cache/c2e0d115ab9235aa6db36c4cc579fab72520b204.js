var React = require("react");
var Router = require("react-router");
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

var BomManager = require("../components/BomManager.react");
var Dashboard = require("../components/Dashboard.react");
var Product = require("../components/Product.react");
var Bom = require("../components/Bom.react");
var Profile = require("../components/Profile.react");
var BomImport = require("../components/BomImport.react");
var BomImportMatch = require("../components/BomImportMatch.react");
var Welcome = require("../components/Welcome.react");

var routes = (
    React.createElement(Route, {name: "app", path: "/", handler: BomManager}, 

        React.createElement(DefaultRoute, {name: "dashboard", handler: Dashboard}), 

        React.createElement(Route, {name: "welcome", path: "welcome", handler: Welcome}), 

        React.createElement(Route, {name: "newProductImport", path: "product/import", handler: BomImport}), 
        React.createElement(Route, {name: "newProductImportMatch", path: "product/import/match", handler: BomImportMatch}), 
        React.createElement(Route, {name: "bom", path: "product/:productId/bom/:bomId", handler: Bom}), 
        React.createElement(Route, {name: "bomImport", path: "product/:productId/bom/:bomId/import", handler: BomImport}), 
        React.createElement(Route, {name: "bomImportMatch", path: "product/:productId/bom/:bomId/import/match", handler: BomImportMatch}), 
        React.createElement(Route, {name: "productImport", path: "product/:productId/import", handler: BomImport}), 
        React.createElement(Route, {name: "productImportMatch", path: "product/:productId/import/match", handler: BomImportMatch}), 
        React.createElement(Route, {name: "product", path: "product/:productId", handler: Product}), 

        React.createElement(Route, {name: "profile", handler: Profile})

  )
);

var BomRouter = Router.create({
  routes: routes,
  //location: Router.HistoryLocation
});

module.exports = BomRouter;
