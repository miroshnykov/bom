"use strict";

(function (window) {
	require("es5-shim/es5-shim");
	require("es5-shim/es5-sham");
	require("es6-promise").polyfill();

	// Needs to be set globally, as jQuery-ui plugins assume it is global.
	global.jQuery = global.$ = require("jquery");

	require("jquery-mousewheel");
	require("jquery-nicescroll");


	var Backbone = require("backbone");
	Backbone.$ = global.jQuery;

	var React = require("react");
	var Router = require("./routers/BomRouter");
	var Handler = Router.Handler;

	Router.run(function (Handler, state) {
	  var params = state.params;
	  React.render(React.createElement(Handler, {params: params}), document.getElementById("app"));
	});
}(window));



