"use strict";

var React = require("react");
var Table = require("react-bootstrap").Table;
var FieldConstants = require("../constants/FieldConstants");

var BomItemPurchasing = React.createClass({displayName: "BomItemPurchasing",

  propTypes: {
    bom: React.PropTypes.object,
    item: React.PropTypes.object
  },

  /**
   * @return {object}
   */
  render: function() {
    var bom = this.props.bom;
    var item = this.props.item;
    var mfgField;
    var mpnField;
    var supField;
    var spnField;
    var priceField;
    var leadTimeField;
    var moqField;
    var mfgs;
    var suppliers;

    if (!item) {
      return (React.createElement("div", null));
    }

    //get manufacturer fields and matching part numbers
    mfgs = [];
    mfgField = bom.getItemValueContentForField(item.id || item.cid, FieldConstants.MFG);
    mpnField = bom.getItemValueContentForField(item.id || item.cid, FieldConstants.MPN);

    if (mfgField || mpnField) {
      mfgs.push({
        "key": 1,
        "mfg": mfgField,
        "mpn": mpnField
      });
    }

    //TODO add others fields that contain something like "mfg" or "manufacturer" in their name
    // instead of above
    // get list of BomFields with name that match the pattern

    //get supplier fields and matching part numbers, price, lead time, moq
    suppliers = [];
    supField = bom.getItemValueContentForField(item.id || item.cid, FieldConstants.SUPPLIER);
    spnField = bom.getItemValueContentForField(item.id || item.cid, FieldConstants.SPN);
    priceField = bom.getItemValueContentForField(item.id || item.cid, FieldConstants.PRICE);
    leadTimeField = bom.getItemValueContentForField(item.id || item.cid, FieldConstants.LEAD_TIME);
    moqField = bom.getItemValueContentForField(item.id || item.cid, FieldConstants.MOQ);

    if (supField || spnField || priceField || leadTimeField || moqField) {
      suppliers.push({
        "key": 1,
        "supplier": supField,
        "spn": spnField,
        "price": priceField,
        "leadtime": leadTimeField,
        "moq": moqField
      });
    }

    //TODO add others fields that contain something like "supplier" in the name

    return (
      React.createElement("div", {className: "row"}, 
        React.createElement("div", {className: "col-md-5"}, 
          React.createElement(Table, {condensed: true}, 
            React.createElement("thead", null, 
              React.createElement("tr", null, 
                React.createElement("th", null, "Manufacturer"), 
                React.createElement("th", null, "MFG Part Number")
              )
            ), 
            React.createElement("tbody", null, 
              mfgs.map(function(result) {
                return (
                  React.createElement("tr", {key: result.key}, 
                    React.createElement("td", null, result.mfg), 
                    React.createElement("td", null, result.mpn)
                  )
                  );
              })
            )
          )
        ), 

        React.createElement("div", {className: "col-md-7"}, 
          React.createElement(Table, {condensed: true}, 
            React.createElement("thead", null, 
              React.createElement("tr", null, 
                React.createElement("th", null, "Supplier"), 
                React.createElement("th", null, "Supplier PN"), 
                React.createElement("th", null, "Price"), 
                React.createElement("th", null, "Lead Time"), 
                React.createElement("th", null, "MOQ")
              )
            ), 
            React.createElement("tbody", null, 
              suppliers.map(function(result) {
                return (
                  React.createElement("tr", {key: result.key}, 
                    React.createElement("td", null, result.supplier), 
                    React.createElement("td", null, result.spn), 
                    React.createElement("td", null, result.price), 
                    React.createElement("td", null, result.leadtime), 
                    React.createElement("td", null, result.moq)
                  )
                  );
              })
            )
          )
        )
      )
    );
  }

});

module.exports = BomItemPurchasing;
