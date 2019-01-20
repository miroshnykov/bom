"use strict";

// Generate stub data
var UserData = {
  // Load Mock Product Data Into localStorage
  init: function() {
    localStorage.setItem("user", JSON.stringify({
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

module.exports = UserData;
