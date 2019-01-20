var React = require("react");
var Link = require("react-router").Link;
var Button = require("react-bootstrap").Button;
var ButtonToolbar = require("react-bootstrap").ButtonToolbar;
var Glyphicon = require("react-bootstrap").Glyphicon;

var BomActions = require("../actions/BomActions");
var BomItem = require("../components/BomItem.react");
var TextInput = require("../components/TextInput.react");

var cx = require("react/lib/cx");

var BomList = React.createClass({displayName: "BomList",

  propTypes: {
    bom: React.PropTypes.object.isRequired,
    allBoms: React.PropTypes.object.isRequired,
    productId: React.PropTypes.oneOfType([
      React.PropTypes.string.isRequired,
      React.PropTypes.number.isRequired
    ]),
    currentBomId: React.PropTypes.oneOfType([
      React.PropTypes.string.isRequired,
      React.PropTypes.number.isRequired
    ])
  },

  getInitialState: function() {
    return {
      isEditing: false
    };
  },

  /**
   * @return {object}
   */
  render: function() {
    var bom = this.props.bom;
    var allBoms = this.props.allBoms;
    var currentBomId = this.props.currentBomId;
    var productId = this.props.productId;
    var active = currentBomId && !!(currentBomId == (bom.id || bom.cid));
    var childBoms;
    var childIds = bom.get("bomIds");
    var element;

    if (childIds.length) {
      childBoms = allBoms.filter(function(result) {
        return _.contains(childIds, result.id || result.cid);
      });

      childBoms = childBoms.map(function(result) {
        return (React.createElement(BomList, {
          key: result.id || result.cid, 
          bom: result, 
          allBoms: allBoms, 
          currentBomId: currentBomId, 
          productId: productId}));
      });
    }

    //create the static or input element
    if (this.state.isEditing) {
      element = (React.createElement(TextInput, {
        className: "edit", 
        onSave: this._onSaveName, 
        value: bom.get("name")}));
    }
    else {
      element = (React.createElement("div", null, 
            React.createElement("span", null, 
              React.createElement(Link, {to: "bom", params: { productId: productId, bomId: bom.id || bom.cid}}, bom.get("name"))
            ), 
            React.createElement(ButtonToolbar, null, 
              React.createElement(Button, {
                className: "btn-nobg", 
                bsStyle: "default", 
                bsSize: "small", 
                onClick: this._onEdit}, 
                React.createElement(Glyphicon, {
                  bsSize: "small", 
                  glyph: "pencil"})
              )
            )
        ));
    }

    return (
      React.createElement("ul", null, 
        React.createElement("li", {className: cx({
          active: active
        })}, 
          React.createElement("div", null, 
            element
          ), 
          childBoms
        )
      )
    );
  },

  _onEdit: function(event) {
    this.setState({isEditing: true});
  },

  _onSaveName: function(name) {
    if (name && this.props.bom.get("name") !== name) {
      BomActions.updateName(this.props.bom.id, name);
    }
    this.setState({isEditing: false});
  }

});

module.exports = BomList;
