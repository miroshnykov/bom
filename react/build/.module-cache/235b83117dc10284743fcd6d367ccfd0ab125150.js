var React = require("react");
var Table = require("react-bootstrap").Table;
var FieldConstants = require("../constants/FieldConstants");

var BomItemUsage = React.createClass({displayName: "BomItemUsage",

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
    var qtyField;
    var priceField;
    var desigField;

    if (!item) {
      return (
        React.createElement("div", null)
        );
    }

    qtyField = bom.getItemValueContentForField(item.id || item.cid, FieldConstants.QUANTITY);
    priceField = bom.getItemValueContentForField(item.id || item.cid, FieldConstants.PRICE);
    desigField = bom.getItemValueContentForField(item.id || item.cid, FieldConstants.DESIGNATORS);

    return (
      React.createElement("div", {className: "row"}, 
        React.createElement("div", {className: "col-md-5"}, 
          React.createElement(Table, {condensed: true}, 
            React.createElement("tbody", null, 
              React.createElement("tr", null, 
                React.createElement("td", null, "Quantity per board"), 
                React.createElement("td", null, qtyField)
              ), 
              React.createElement("tr", null, 
                React.createElement("td", null, "Designators"), 
                React.createElement("td", null, desigField)
              ), 
              React.createElement("tr", null, 
                React.createElement("td", null, "Cost per piece"), 
                React.createElement("td", null, qtyField)
              ), 
              React.createElement("tr", null, 
                React.createElement("td", null, "Cost per board"), 
                React.createElement("td", null, priceField * qtyField)
              )
            )
          )
        )
      )
    );
  }

});

module.exports = BomItemUsage;
