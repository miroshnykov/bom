var React = require("react");

var BomItemField = require("../components/BomItemField.react");
var BomActions = require("../actions/BomActions");

var cx = require("react/lib/cx");

var BomItem = React.createClass({displayName: "BomItem",

  propTypes: {
    bom: React.PropTypes.object.isRequired,
    item: React.PropTypes.object.isRequired,
    fields: React.PropTypes.array.isRequired,
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
    var fields = this.props.fields;
    var allFields = this.props.allFields;

    return (
      React.createElement("tr", {className: cx( {"active": this.props.selected}), onClick: this._onSelect}, 
        fields.map(function(result, index) {

          var bomField = bom.getColumnForField(result.fieldId);
          if (!bomField) {
            bomField = {
              fieldId: result.fieldId,
              name: result.name
            };
          }

          if (result) {
            return React.createElement(BomItemField, {
              key: result.fieldId, 
              bomId: bom.id || bom.cid, 
              itemId: item.id || item.cid, 
              content: bom.getItemFieldValueForField(item.id || item.cid, result.fieldId), 
              bomField: bomField, 
              field: allFields.get(result.fieldId), 
              readonly: this.props.readonly});
          }
          else {
            return React.createElement("td", {key: index});
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
