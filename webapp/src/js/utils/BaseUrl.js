"use strict";

var _ = require("underscore");
var ApiConstants = require("constants/ApiConstants");
var urljoin = require("url-join");

module.exports = {
	buildUrl: _.partial(urljoin, ApiConstants.PATH_PREFIX)
};
