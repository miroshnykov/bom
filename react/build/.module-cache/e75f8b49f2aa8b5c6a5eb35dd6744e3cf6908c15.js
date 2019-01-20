var ApiConstants = require("../constants/ApiConstants");

// Generate stub data
var TypeData = {

  init: function() {
    localStorage.setItem('fieldtype', JSON.stringify({
      "count": 3,
      "total": 3,
      "_embedded": {
        "fieldtype": [
          {
            id: 1,
            name: 'Text'
          },
          {
            id: 2,
            name: 'Number'
          },
          {
            id: 3,
            name: 'Yes/No'
          }
        ]
      }
    }));
  }
};

// Mock jQuery requests
// $.mockjax({
//   url: ApiConstants.PATH_PREFIX + "/fieldtype",
//   type: "GET",
//   responseTime: 0,
//   responseText: JSON.parse(localStorage.getItem("fieldtype"))
// });

module.exports = TypeData;
