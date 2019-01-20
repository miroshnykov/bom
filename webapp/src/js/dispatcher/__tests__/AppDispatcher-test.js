/*global jest:false, expect: false, jasmine: false*/
"use strict";

require("es6-promise").polyfill();

jest.dontMock("dispatcher/AppDispatcher");

describe("AppDispatcher", function() {
    it("dispatches actions", function() {
        var dispatcher = require("dispatcher/AppDispatcher");

        var callback = jest.genMockFunction();
        dispatcher.register(callback);

        var action = dispatcher.partial("test-action");
        action();

        //expect the first call's first argument to match
        expect(callback.mock.calls[0][0]).toEqual({
            source: "VIEW_ACTION",
            action: {
                type: "test-action",
                attributes: undefined,
                resolve: jasmine.any(Function),
                reject: jasmine.any(Function)
            }
        });
    });


    it("dispatches actions with params", function() {
        var dispatcher = require("dispatcher/AppDispatcher");

        var callback = jest.genMockFunction();
        dispatcher.register(callback);

        var action = dispatcher.partial("test-action");
        action({id: 3, name: "bob"});

        //expect the first call's first argument to match
        expect(callback.mock.calls[0][0]).toEqual({
            source: "VIEW_ACTION",
            action: {
                type: "test-action",
                attributes: {
                    id: 3,
                    name: "bob"
                },
                resolve: jasmine.any(Function),
                reject: jasmine.any(Function)
            }
        });
    });
});

