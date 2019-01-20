var ApiConstants = require("../constants/ApiConstants");

// Generate stub data
var UserData = {
  // Load Mock Product Data Into localStorage
  init: function() {
    localStorage.setItem('user', JSON.stringify({
      id: 1,
      email: "bruno@fabule.com",
      firstname: "Bruno",
      lastname: "Nadeau",
      _embedded: {
        companies: [{
          id: 1,
          name: "Fabule"
        }]
      }
    }));
  }
};

// Mock jQuery requests
$.mockjax({
  url: ApiConstants.PATH_PREFIX + "/user",
  type: "GET",
  responseText: JSON.parse(localStorage.getItem("user"))
});

module.exports = UserData;
