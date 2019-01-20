require("es5-shim/es5-shim");
require("es5-shim/es5-sham");
require("es6-promise").polyfill();

jQuery = $ = require("jquery");
require("jquery-mousewheel");
require("jquery-nicescroll");

//TODO check NODE_ENV on Heroku
if (process.env.NODE_ENV !== "production") {
  require("jquery-mockjax");
}

Backbone = require("backbone");
Backbone.$ = $;

_ = require("underscore");

var React = require("react");
var Router = require("./router/BomRouter");
var Handler = Router.Handler;

Router.run(function (Handler, state) {
  var params = state.params;
  React.render(React.createElement(Handler, {params: params}), document.getElementById("app"));
});
