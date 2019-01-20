/*global jest:false, expect: false, Backbone:true, $:true, _:true*/
"use strict";

jest.dontMock("models/UserModel");

require("es6-promise").polyfill();
$ = require("jquery");

Backbone = require("backbone");
Backbone.$ = $;

_ = require("underscore");

xdescribe("UserModel", function() {
  var AppDispatcher = require("dispatcher/AppDispatcher");
  AppDispatcher.register = jest.genMockFunction();
  var ExtendedModel;
  var UserModel;

  beforeEach(function() {
    AppDispatcher.register.mockClear();
    ExtendedModel = require("utils/ExtendedModel");
    UserModel = require("models/UserModel");

    $.ajax = jest.genMockFunction();
  });

  it("initializes the parent ExtendedModel class", function() {
    var user;
    var initialize;
    var callback;

    initialize = jest.genMockFunction();
    ExtendedModel.prototype.initialize = initialize;

    user = new UserModel();
    callback = AppDispatcher.register.mock.calls[0][0];
    expect(initialize).toBeCalled();
  });

  it("registers a callback with the dispatcher", function() {
    var user = new UserModel();
    expect(user).toNotBe(null);
    expect(AppDispatcher.register.mock.calls.length).toBe(1);
  });
});
