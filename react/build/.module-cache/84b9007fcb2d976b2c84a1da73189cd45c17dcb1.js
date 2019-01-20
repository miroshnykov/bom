var React = require("react");

var BomItemField = require("../components/BomItemField.react");
var BomActions = require("../actions/BomActions");
var BomAttributeModel = require("../models/BomAttributeModel");

var cx = require("react/lib/cx");

var BomItem = React.createClass({displayName: "BomItem",

  propTypes: {
    bom: React.PropTypes.object.isRequired,
    item: React.PropTypes.object.isRequired,
    headers: React.PropTypes.array.isRequired,
    allFields: React.PropTypes.object.isRequired,
    selected: React.PropTypes.bool.isRequired,
    readonly: React.PropTypes.bool
  },

  /**
   * @return {object}
   */
  render: function() {
    var bom = this.props.bom;
    var item = this.props.item;
    var headers = this.props.headers;
    var allFields = this.props.allFields;

    return (
      React.createElement("tr", {className: cx( {"active": this.props.selected}), onClick: this._onSelect}, 
        headers.map(function(result, index) {

          //var attribute =
          // if (!attribute) {
          //     attribute = new BomAttributeModel({
          //       fieldId: result.get("fieldId"),
          //       name: result.get("name")
          //     });
          // }

          if (result) {
            return React.createElement(BomItemField, {
              key: result.fieldId, 
              bomId: bom.id || bom.cid, 
              itemId: item.id || item.cid, 
              content: bom.getItemValueContentForField(item.id || item.cid, result.fieldId), 
              attribute: bom.getAttributeForField(result.fieldId), 
              field: allFields.get(result.fieldId), 
              headerName: result.name, 
              readonly: this.props.readonly});
          }
        }, this)
      )
    );
  },

  _onSelect: function() {
    BomActions.selectItem(
      this.props.bom.id || this.props.bom.cid,
      this.props.item.id || this.props.item.cid,
      !this.props.selected);
  }

});

module.exports = BomItem;
