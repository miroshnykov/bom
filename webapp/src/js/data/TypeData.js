"use strict";

// Generate stub data
var TypeData = {

  init: function() {
    localStorage.setItem("fieldtype", JSON.stringify({
      "count": 3,
      "total": 3,
      "_embedded": {
        "fieldtype": [
          {
            id: 1,
            name: "Text"
          },
          {
            id: 2,
            name: "Number"
          },
          {
            id: 3,
            name: "Yes/No"
          }
        ]
      }
    }));
  }
};

module.exports = TypeData;
