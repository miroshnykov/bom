"use strict";

(function (window) {
    require("es5-shim/es5-shim");
    require("es5-shim/es5-sham");
    require("es6-promise").polyfill();

    var Backbone = require("backbone");
    Backbone.$ = require("jquery");

    var React = require("react");
    var Router = require("./routers/InviteRouter");
    var Handler = Router.Handler;

    Router.run(function (Handler, state) {
        var params = state.params;
        React.render(React.createElement(Handler, {params: params}), document.getElementById("app"));
    });
}(window));
