/*global jest:false, expect: false, Backbone:true, $:true*/
"use strict";

jest.dontMock("../UserStore.js");

$ = require("jquery");

Backbone = require("backbone");
Backbone.$ = $;

describe("UserStore", function() {
  var UserStore = require("../UserStore");
  var UserModel = require("../../models/UserModel");

  it("initializes the store as a UserModel", function() {
    expect(UserStore instanceof UserModel).toBe(true);
  });

});
