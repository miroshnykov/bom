/*global jest:false, expect: false, Backbone:true, $:true*/
"use strict";

jest.dontMock("stores/UserStore");

$ = require("jquery");

Backbone = require("backbone");
Backbone.$ = $;

describe("UserStore", function() {

  var UserStore = require("stores/UserStore");
  var UserModel = require("models/UserModel");

  it("initializes the store as a UserModel", function() {
    expect(UserStore.current instanceof UserModel).toBe(true);
  });

});
