/*global jest:false, expect: false*/
"use strict";

jest.dontMock("../AppDispatcher.js");

describe("AppDispatcher", function() {
  it("dispatches view action with correct params", function() {
    var AppDispatcher = require("../AppDispatcher");

    var callback = jest.genMockFunction();
    AppDispatcher.register(callback);

    //dispatch a view action
    AppDispatcher.handleViewAction({
      type: "test-action"
    });

    //expect the first call's first argument to match
    expect(callback.mock.calls[0][0]).toEqual({
      source: "VIEW_ACTION",
      action: {
        type: "test-action"
      }
    });
  });

  // it("dispatches server action with correct params", function() {
  //   var AppDispatcher = require("../AppDispatcher");

  //   var callback = jest.genMockFunction();
  //   AppDispatcher.register(callback);

  //   //dispatch a view action
  //   AppDispatcher.handleServerAction({
  //     type: "test-action"
  //   });

  //   //expect the first call's first argument to match
  //   expect(callback.mock.calls[0][0]).toEqual({
  //     source: "SERVER_ACTION",
  //     action: {
  //       type: "test-action"
  //     }
  //   });
  // });
});
