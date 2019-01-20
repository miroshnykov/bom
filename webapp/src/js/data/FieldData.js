"use strict";

var FieldConstants = require("constants/FieldConstants");
var TypeConstants = require("constants/TypeConstants");

// Generate stub data
var FieldData = {
  // Load Mock Product Data Into localStorage
  init: function() {
    localStorage.setItem("fields", JSON.stringify({
      "total_items": 10,
      "_embedded": {
        "field": [
          {
            id: FieldConstants.SKU,
            name: "SKU",
            alt: [],
            typeId: TypeConstants.TEXT
          },{
            id: FieldConstants.ID,
            name: "ID",
            typeId: TypeConstants.TEXT
          },{
            id: FieldConstants.QUANTITY,
            name: "Quantity",
            typeId: TypeConstants.NUMBER
          },{
            id: FieldConstants.DESCRIPTION,
            name: "Description",
            typeId: TypeConstants.TEXT
          },{
            id: FieldConstants.TYPE,
            name: "Type",
            typeId: TypeConstants.TEXT
          },{
            id: FieldConstants.VALUE,
            name: "Value",
            typeId: TypeConstants.TEXT
          },{
            id: FieldConstants.VOLT,
            name: "Volt",
            typeId: TypeConstants.TEXT
          },{
            id: FieldConstants.TOLERANCE,
            name: "Tolerance",
            typeId: TypeConstants.TEXT
          },{
            id: FieldConstants.TEMP_COEFF,
            name: "Temp. Coeff.",
            typeId: TypeConstants.TEXT
          },{
            id: FieldConstants.PACKAGE,
            name: "Package",
            typeId: TypeConstants.TEXT
          },{
            id: FieldConstants.DESIGNATORS,
            name: "Designators",
            typeId: TypeConstants.TEXT
          },{
            id: FieldConstants.MFG,
            name: "Manufacturer",
            typeId: TypeConstants.TEXT
          },{
            id: FieldConstants.MPN,
            name: "Manufacturer Part #",
            typeId: TypeConstants.TEXT
          },{
            id: FieldConstants.SUPPLIER,
            name: "Supplier",
            typeId: TypeConstants.TEXT
          },{
            id: FieldConstants.SPN,
            name: "Suplier Part #",
            typeId: TypeConstants.TEXT
          },{
            id: FieldConstants.PRICE,
            name: "Price",
            typeId: TypeConstants.TEXT
          },{
            id: FieldConstants.MOQ,
            name: "MOQ",
            typeId: TypeConstants.NUMBER
          },{
            id: FieldConstants.LEAD_TIME,
            name: "Lead Time",
            typeId: TypeConstants.TEXT
          },{
            id: FieldConstants.LINK,
            name: "Link",
            typeId: TypeConstants.TEXT
          },{
            id: FieldConstants.ROHS,
            name: "RoHS",
            typeId: TypeConstants.BOOLEAN
          },{
            id: FieldConstants.SMT,
            name: "SMT",
            typeId: TypeConstants.BOOLEAN
          },{
            id: FieldConstants.DNI,
            name: "DNI",
            typeId: TypeConstants.BOOLEAN
          },{
            id: FieldConstants.BUILD_OPTION,
            name: "Build Option",
            typeId: TypeConstants.TEXT
          },{
            id: FieldConstants.ROHS,
            name: "RoHS",
            typeId: TypeConstants.BOOLEAN
          },{
            id: FieldConstants.SIDE,
            name: "Side",
            typeId: TypeConstants.BOOLEAN
          },{
            id: FieldConstants.CATEGORY,
            name: "Category",
            typeId: TypeConstants.TEXT
          },{
            id: FieldConstants.COMMENT,
            name: "Comment",
            typeId: TypeConstants.TEXT
          },{
            id: FieldConstants.AVL_NOTES,
            name: "AVL Notes",
            typeId: TypeConstants.TEXT
          },{
            id: FieldConstants.TOTAL_PRICE,
            name: "Total Price",
            typeId: TypeConstants.TEXT
          }
        ]
      }
    }));
  }
};

module.exports = FieldData;
