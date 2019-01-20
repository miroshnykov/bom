"use strict";

var React = require("react");
var func = React.PropTypes.func;
var _ = require("underscore");

/**
 * A wrapper to stub the router context during tests.
 */
var StubRouterContext = function(Component, props, stubs) {
  return React.createClass({
    childContextTypes: {
      makePath: func,
      makeHref: func,
      transitionTo: func,
      replaceWith: func,
      goBack: func,
      getCurrentPath: func,
      getCurrentRoutes: func,
      getCurrentPathname: func,
      getCurrentParams: func,
      getCurrentQuery: func,
      isActive: func,
    },

    getChildContext: function() {
      return _.extend({}, {
        makePath: function() {},
        makeHref: function() {},
        transitionTo: function() {},
        replaceWith: function() {},
        goBack: function() {},
        getCurrentPath: function() {},
        getCurrentRoutes: function() {},
        getCurrentPathname: function() {},
        getCurrentParams: function() {},
        getCurrentQuery: function() {},
        isActive: function() {},
      }, stubs);
    },

    render: function() {
      return (
        <Component ref="component" {...props} />
      );
    }
  });
};

module.exports = StubRouterContext;
