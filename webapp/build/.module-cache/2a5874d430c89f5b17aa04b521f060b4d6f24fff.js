"use strict";

// Generate stub data
var ProductData = {
  lastId: 0,

  // Load Mock Product Data Into localStorage
  init: function() {
    localStorage.setItem("products", JSON.stringify({
      "count": 3,
      "total": 3,
      "_embedded": {
        "products": [
          {
            id: ++this.lastId,
            name: "Product #1",
            bomId: 1,
          },
          {
            id: ++this.lastId,
            name: "Product #2",
            bomId: 3
          },
          {
            id: ++this.lastId,
            name: "Product #3",
            bomId: 6
          }
        ]
      }
    }));
  }
};

module.exports = ProductData;
