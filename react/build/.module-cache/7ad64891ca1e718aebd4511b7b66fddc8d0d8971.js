var React = require("react");
var Table = require("react-bootstrap").Table;

var FieldConstants = require("../constants/FieldConstants");

var BomItemDetails = React.createClass({displayName: "BomItemDetails",

  propTypes: {
    allFields: React.PropTypes.object.isRequired,
    allTypes: React.PropTypes.object.isRequired,
    item: React.PropTypes.object,
    bom: React.PropTypes.object
  },

  /**
   * @return {object}
   */
  render: function() {
    var bom = this.props.bom;
    var item = this.props.item;
    var fieldIds;
    var attributes;
    var element;
    var description;

    if (!item) {
      element = (
        React.createElement("div", {className: "wrapper"}, 
          React.createElement("h3", null, "Component"), 
          React.createElement("div", null, "No selected component.")
        )
      );
    }
    else {
      fieldIds = [
        FieldConstants.TYPE,
        FieldConstants.VALUE,
        FieldConstants.VOLT,
        FieldConstants.TOLERANCE,
        FieldConstants.TEMP_COEFF,
        FieldConstants.PACKAGE];

      element = (
        React.createElement("div", {className: "wrapper"}, 
          React.createElement("h3", null, "Component ", item.id || item.cid), 
          React.createElement("h4", null, bom.getItemFieldValueForField(item.id || item.cid, FieldConstants.DESCRIPTION)), 
          React.createElement(Table, {condensed: true}, 
            React.createElement("tbody", null, 
              fieldIds.map(function(result) {
                var value = bom.getItemFieldValueForField(item.id || item.cid, result);
                return (
                  React.createElement("tr", {key: result}, 
                    React.createElement("td", null, this.props.allFields.get(result).get("name")), 
                    React.createElement("td", null, value)
                  ));
              }, this)
            )
          )
        )
        );
    }

    return (
      React.createElement("div", {id: "component-details", className: "col-md-3"}, 
        element
      )
    );
  },

  //TODO move this into a BomItemModel maybe
  _getItemFieldValue: function(item, fieldId) {
    var field = _.find(item.values, function(result) {
      return result.id === fieldId;
    });

    if (field) {
      return field.value;
    }
  }

});

module.exports = BomItemDetails;
