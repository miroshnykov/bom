var ApiConstants = require("../constants/ApiConstants");
var BomData = require("../data/BomData");

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

// Mock jQuery requests

// $.mockjax({
//   url: ApiConstants.PATH_PREFIX + "/product",
//   type: "POST",
//   //status: 500,
//   responseTime: 2000,
//   response: function(settings) {
//     var data = JSON.parse(settings.data);

//     this.responseText = {
//       id: ++ProductData.lastId,
//       name: data.name,
//       bomId: ++BomData.lastId
//     };
//   }
// });

// $.mockjax({
//   url: ApiConstants.PATH_PREFIX + "/product/*",
//   type: "DELETE",
//   responseText: {}
// });


// $.mockjax({
//   url: ApiConstants.PATH_PREFIX + "/1/product/*",
//   type: "PUT",
//   responseTime: 0,
//   status: 404,
//   responseText: "Not found"
  // response: function(settings) {
  //   var data = JSON.parse(settings.data);

  //   this.responseText = {
  //     id: data.id,
  //     name: data.name
  //   };
  // }
// });

// $.mockjax({
//   url: ApiConstants.PATH_PREFIX + "/product",
//   type: "GET",
//   responseTime: 0,
//   responseText: JSON.parse(localStorage.getItem("products"))
// });

module.exports = ProductData;
