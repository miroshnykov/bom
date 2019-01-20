/*global jest:false, expect: false*/
"use strict";

jest.dontMock("utils/BaseUrl");

describe("BaseUrl", function() {
	it("can build a URL", function() {
		var baseUrl = require("utils/BaseUrl");
		expect(baseUrl.buildUrl()).toEqual("/api");
		expect(baseUrl.buildUrl("test")).toEqual("/api/test");
		expect(baseUrl.buildUrl("test/dummy")).toEqual("/api/test/dummy");
		expect(baseUrl.buildUrl("test", 1, "dummy")).toEqual("/api/test/1/dummy");
	});
});
