"use strict";

var React  = require("react");
var Router = require("react-router");

var Route         = Router.Route;
var DefaultRoute  = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;
var RouteHandler  = Router.RouteHandler;

var App              = require("screens/App.jsx");
var Bom              = require("screens/Bom.jsx");
var BomComments      = require("screens/BomComments.jsx");
var BomDashboard     = require("screens/BomDashboard.jsx");
var BomHistory       = require("screens/BomHistory.jsx");
var BomSpreadsheet   = require("screens/BomSpreadsheet.jsx");
var CreateProduct    = require("screens/CreateProduct.jsx");
var GettingStarted   = require("screens/GettingStarted.jsx");
var InviteUser       = require("screens/InviteUser.jsx");
var NavigationError  = require("screens/NavigationError.jsx");
var NewBom           = require("screens/NewBom.jsx");
var Product          = require("screens/Product.jsx");
var ProductDashboard = require("screens/ProductDashboard.jsx");
var ProductHistory   = require("screens/ProductHistory.jsx");
var SidebarApp       = require("screens/SidebarApp.jsx");
var UserAccount      = require("screens/UserAccount.jsx");
var Welcome          = require("screens/Welcome.jsx");

var DefaultRouteHandler = require("routers/DefaultRouteHandler.jsx");

var routes = (
    <Route name="app" path="/" handler={App}>
        <Route name="welcome" path="welcome" handler={Welcome} />
        <Route name="gettingStarted" path="getting-started" handler={GettingStarted} />

        <Route name="sidebarApp" path="/" handler={SidebarApp}>
            <DefaultRoute name="default" handler={DefaultRouteHandler} />

            <Route name="inviteUser" path="/company/invite" handler={InviteUser} />
            <Route name="userAccount" path="account" handler={UserAccount} />
            <Route name="emptyState" path="create-product" handler={CreateProduct} />
            <Route name="product" path="product/:productId" handler={Product}>
                <DefaultRoute name="productDashboard" handler={ProductDashboard} />

                <Route name="productHistory" path="history" handler={ProductHistory} />
                <Route name="addBom" path="add" handler={NewBom} />
                <Route name="bom" path="bom/:bomId" handler={Bom}>
                    <DefaultRoute name="bomDashboard" handler={BomDashboard} />

                    <Route name="bomEdit" path="edit" handler={BomSpreadsheet} />
                    <Route name="bomComments" path="comments" handler={BomComments} />
                    <Route name="bomHistory" path="history" handler={BomHistory} />
                </Route>
            </Route>
        </Route>

        <NotFoundRoute handler={NavigationError} />
  </Route>
);

var BomRouter = Router.create({
    routes: routes
});

module.exports = BomRouter;
