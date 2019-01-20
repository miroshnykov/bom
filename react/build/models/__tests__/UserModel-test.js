jest.dontMock("../UserModel.js");
jest.dontMock("../../constants/ApiConstants.js");
jest.dontMock("../../constants/ActionConstants.js");
jest.mock("../../dispatcher/AppDispatcher.js");
jest.mock("../../stores/CompanyStore.js");

require("es6-promise").polyfill();
jQuery = $ = require("jquery");

Backbone = require("backbone");
Backbone.$ = $;

_ = require("underscore");

describe("UserModel", function() {

  var ApiConstants = require('../../constants/ApiConstants');
  var ActionConstants = require('../../constants/ActionConstants');

  var AppDispatcher;
  var ExtendedModel;
  var UserModel;

  var defaultUser = {
    id: 1,
    email: "test@fabule.com",
    firstname: "Test",
    lastname: "User"
  };

  beforeEach(function() {
    AppDispatcher = require('../../dispatcher/AppDispatcher');
    ExtendedModel = require('../../utils/ExtendedModel');
    UserModel = require('../UserModel');

    $.ajax = jest.genMockFunction();
  });

  it('initializes the parent ExtendedModel class', function() {
    var user;
    var initialize;
    var callback;

    initialize = jest.genMockFunction();
    ExtendedModel.prototype.initialize = initialize;

    user = new UserModel();
    callback = AppDispatcher.register.mock.calls[0][0];
    expect(initialize).toBeCalled();
  });

  it('registers a callback with the dispatcher', function() {
    var user = new UserModel();
    var callback = AppDispatcher.register.mock.calls[0][0];

    expect(AppDispatcher.register.mock.calls.length).toBe(1);
  });

  // pit.only('fetches a user', function() {
  //   var user = new UserModel();
  //   var callback = AppDispatcher.register.mock.calls[0][0];

  //   return new Promise(function(resolve, reject) {
  //     var payload = {
  //       source: "VIEW_ACTION",
  //       action: {
  //         type: ActionConstants.FETCH_USER,
  //         resolve: resolve,
  //         reject: reject
  //       }
  //     };
  //     callback(payload);

  //     //make sure $.ajax is called with expected values
  //     expect($.ajax).toBeCalledWith({
  //       dataType: "json",
  //       emulateHTTP: false,
  //       emulateJSON: false,
  //       error: jasmine.any(Function),
  //       parse: true,
  //       success: jasmine.any(Function),
  //       type: "GET",
  //       url: ApiConstants.PATH_PREFIX + "/me"
  //     });

  //     //emulate success callback
  //     $.ajax.mock.calls[0][0].success( defaultUser );

  //   }).then(function(result) {

  //     expect( user.toJSON() ).toEqual( defaultUser );

  //   }, function(error) {

  //     expect(error).not.toBeDefined();

  //   });
  // });

  // pit('fails to fetch a user', function() {
  //   var user = new UserModel();
  //   var callback = AppDispatcher.register.mock.calls[0][0];

  //   return new Promise(function(resolve, reject) {
  //     var payload = {
  //       source: "VIEW_ACTION",
  //       action: {
  //         type: ActionConstants.FETCH_USER,
  //         resolve: resolve,
  //         reject: reject
  //       }
  //     };
  //     callback(payload);

  //     //make sure $.ajax is called with expected values
  //     expect($.ajax).toBeCalledWith({
  //       dataType: "json",
  //       emulateHTTP: false,
  //       emulateJSON: false,
  //       error: jasmine.any(Function),
  //       parse: true,
  //       success: jasmine.any(Function),
  //       type: "GET",
  //       url: ApiConstants.PATH_PREFIX + "/me"
  //     });

  //     //emulate success callback
  //     $.ajax.mock.calls[0][0].error({}, "Test Error", new Error("Test Error"));

  //   }).then(function(result) {

  //     expect(result).not.toBeDefined();

  //   }, function(error) {

  //     expect(error.errorThrown.message).toBe("Test Error");

  //   });
  // });

});
