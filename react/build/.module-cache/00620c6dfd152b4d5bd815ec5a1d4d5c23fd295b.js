var React = require("react");
var Link = require("react-router").Link;
var Button = require("react-bootstrap").Button;
var ButtonToolbar = require("react-bootstrap").ButtonToolbar;
var Glyphicon = require("react-bootstrap").Glyphicon;
var Navigation = require("react-router").Navigation;

var BomActions = require("../actions/BomActions");
var ProductActions = require("../actions/ProductActions");
var BomList = require("../components/BomList.react");
var TextInput = require("../components/TextInput.react");

var cx = require("react/lib/cx");

var ProductSublist = React.createClass({displayName: "ProductSublist",
  mixins: [Navigation],

  propTypes: {
    product: React.PropTypes.object.isRequired,
    allBoms: React.PropTypes.object.isRequired,
    active: React.PropTypes.bool,
    currentBomId: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ])
  },

  getInitialState: function() {
    return {
      isEditing: false,
      isAdding: false
    };
  },

  /**
   * @return {object}
   */
  render: function() {
    var product = this.props.product;
    var allBoms = this.props.allBoms;
    var currentBomId = this.props.currentBomId;
    //var rootBom;
    //var childIds;
    var childBoms;
    var iconClass;
    var element;
    var newBom;

    childBoms = allBoms.getChildrenBomsOfBom( product.get("bomId") );

    childBoms = childBoms.map(function(result) {
    return (React.createElement(BomList, {
      key: result.id || result.cid, 
      bom: result, 
      allBoms: allBoms, 
      currentBomId: currentBomId, 
      productId: product.id || product.cid}));
    });

    //create the static or input element
    if (this.state.isEditing) {
      element = (React.createElement(TextInput, {
        className: "edit", 
        onSave: this._onSaveName, 
        value: product.get("name")}));
    }
    else {
      element = (React.createElement("div", null, 
            React.createElement("span", null, 
                React.createElement(Link, {to: "product", params: {productId: product.id || product.cid}}, product.get("name"))
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
                ), 
                React.createElement(Button, {
                    className: "btn-nobg", 
                    bsStyle: "default", 
                    bsSize: "small", 
                    onClick: this._onAdd}, 
                    React.createElement(Glyphicon, {
                        bsSize: "small", 
                        glyph: "plus"})
                )
            )
        ));
    }

    if (this.state.isAdding) {
      newBom = React.createElement("span", {className: "new"}, React.createElement(TextInput, {
        className: "new-bom", 
        wrapperClassName: "new-bom-wrapper", 
        label: "BoM", 
        onSave: this._onSaveBom, 
        placeholder: "New BoM"}))
    }

    return (
      React.createElement("li", {
        className: cx({
          active: this.props.active })}, 
        React.createElement("div", null, 
          element
        ), 
        childBoms, 
        newBom
      )
    );
  },

  _onEdit: function(event) {
    this.setState({isEditing: true});
  },

  _onAdd: function(event) {
    this.setState({isAdding: true});
  },

  _onSaveName: function(name) {
    if (name && this.props.product.get("name") !== name) {
      ProductActions.updateName(this.props.product.id, name);
    }
    this.setState({isEditing: false});
  },

  _onSaveBom: function(name) {
    var bom;
    if (name) {
      BomActions.create(name, this.props.product.get("bomId"));
      bom = this.props.allBoms.last();
      this.transitionTo("bom", {
        productId: this.props.product.id || this.props.product.cid,
        bomId: bom.id || bom.cid });
    }

    this.setState({isAdding: false});
  }

});

module.exports = ProductSublist;
