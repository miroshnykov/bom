/*global jest:false, expect: false*/
"use strict";

jest.dontMock("events/Intercom");
jest.dontMock("events/UserEvent");
jest.dontMock("events/BomEvent");
jest.dontMock("config");

var Backbone = require("backbone");

var UserEvent = require("events/UserEvent");
var BomEvent = require("events/BomEvent");

describe("Intercom", function() {
	window.localStorage = {
		get: function() {

		},

		set: function() {

		}
	};

    window.appConfig = {
    	intercomToken: "dummy-value",
    };

	var intercom = require("events/Intercom");

	it("can be started via start()", function() {
		expect(intercom.start).toBeDefined();
	});

	it("can be stopped via stop()", function() {
		expect(intercom.stop).toBeDefined();
	});

	describe("Manage the events that need to be sent to Intercom", function() {
		window.Intercom = jest.genMockFunction();

		beforeEach(function() {
			intercom.start();
		});

		afterEach(function() {
			intercom.stop();
			window.Intercom.mockClear();
		});

		it("sends a boot event on user login", function() {
			expect(window.Intercom).not.toBeCalled();

			var userEvent = new UserEvent({
				fullName: "Bob Kelso",
				email: "bob.kelso@sacredheart.com",
				companyName: "Sacred Heart Hospital",
				companyToken: "12345"
			});

			Backbone.trigger(UserEvent.EVENT_LOG_IN, userEvent);

			expect(window.Intercom.mock.calls.length).toEqual(1);
			expect(window.Intercom).toBeCalledWith("boot", {
				app_id: "dummy-value",
      			name: "Bob Kelso",
      			email: "bob.kelso@sacredheart.com",
      			company: {
					name: "Sacred Heart Hospital",
					id: "12345"
				}
			});
  		});

		it("sends a shutdown event on user logout", function() {
			expect(window.Intercom).not.toBeCalled();

			Backbone.trigger(UserEvent.EVENT_LOG_OUT);

			expect(window.Intercom.mock.calls.length).toEqual(1);
			expect(window.Intercom).toBeCalledWith("shutdown");
	  	});

	  	it("sends an update event on user modifications", function() {
			expect(window.Intercom).not.toBeCalled();

			var userEvent = new UserEvent({
				fullName: "Bob Kelso",
				email: "bob.kelso@sacredheart.com"
			});

			Backbone.trigger(UserEvent.EVENT_CHANGE, userEvent);

			expect(window.Intercom.mock.calls.length).toEqual(1);
			expect(window.Intercom).toBeCalledWith("update", {
      			name: "Bob Kelso",
      			email: "bob.kelso@sacredheart.com"});
	  	});

	  	it("sends an update event on company modification", function() {
			expect(window.Intercom).not.toBeCalled();

			var userEvent = new UserEvent({
				companyName: "Fake Inc.",
				companyToken: "12346",
				companyId: "3"
			});

			Backbone.trigger(UserEvent.EVENT_CHANGE, userEvent);

			expect(window.Intercom.mock.calls.length).toEqual(1);
			expect(window.Intercom).toBeCalledWith("update", {
      			company: {
      				name: "Fake Inc.",
      				id: "12346"
      			}});
	  	});

	  	it("doesn't send an update event on user modifications of untracked properies", function() {
			expect(window.Intercom).not.toBeCalled();

			Backbone.trigger(UserEvent.EVENT_CHANGE, new UserEvent({dummy: "dummy"}));

			expect(window.Intercom).not.toBeCalled();
	  	});

	  	describe("Track custom events", function(){
			it("sends a track event event on bom created", function() {
				expect(window.Intercom).not.toBeCalled();

				Backbone.trigger(BomEvent.EVENT_CREATE);

				expect(window.Intercom.mock.calls.length).toEqual(1);
				expect(window.Intercom).toBeCalledWith("trackEvent", "bom-create");
		  	});

		  	it("sends a track event event on bom deleted", function() {
				expect(window.Intercom).not.toBeCalled();

				Backbone.trigger(BomEvent.EVENT_DELETE);

				expect(window.Intercom.mock.calls.length).toEqual(1);
				expect(window.Intercom).toBeCalledWith("trackEvent", "bom-delete");
		  	});

		  	it("sends a track event event on bom exported", function() {
				expect(window.Intercom).not.toBeCalled();

				Backbone.trigger(BomEvent.EVENT_EXPORT);

				expect(window.Intercom.mock.calls.length).toEqual(1);
				expect(window.Intercom).toBeCalledWith("trackEvent", "bom-export");
		  	});

		  	it("sends a track event event on bom imported", function() {
				expect(window.Intercom).not.toBeCalled();

				Backbone.trigger(BomEvent.EVENT_IMPORT);

				expect(window.Intercom.mock.calls.length).toEqual(1);
				expect(window.Intercom).toBeCalledWith("trackEvent", "bom-import");
		  	});

	  	  	it("doesn't send a track event event on remote triggered events", function() {
	  			expect(window.Intercom).not.toBeCalled();

	  			Backbone.trigger(BomEvent.EVENT_IMPORT, new BomEvent({eventIsLocal: false}));
	  			Backbone.trigger(BomEvent.EVENT_EXPORT, new BomEvent({eventIsLocal: false}));
	  			Backbone.trigger(BomEvent.EVENT_CREATE, new BomEvent({eventIsLocal: false}));
	  			Backbone.trigger(BomEvent.EVENT_DELETE, new BomEvent({eventIsLocal: false}));

	  			expect(window.Intercom).not.toBeCalled();
	  	  	});
	  	});
	});

});
