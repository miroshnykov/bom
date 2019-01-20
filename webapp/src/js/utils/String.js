"use strict";

/* jshint ignore:start */
String.prototype.trunc = function(n, useWordBoundary) {
	var tooLong = this.length > n,
		s_ = tooLong ? this.substr(0,n - 1) : this;
	s_ = useWordBoundary && tooLong ? s_.substr(0,s_.lastIndexOf(" ")) : s_;
	return  tooLong ? s_ + "\u2026" : s_;
};
/* jshint ignore:end */

module.exports = {};
