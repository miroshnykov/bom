var React = require("react");

var Button = require("react-bootstrap").Button;
var ButtonToolbar = require("react-bootstrap").ButtonToolbar;
var Input = require("react-bootstrap").Input;
var Glyphicon = require("react-bootstrap").Glyphicon;
var Navigation = require("react-router").Navigation;

var TextInput = require("../components/TextInput.react");
var ProductSublist = require("../components/ProductSublist.react");
var ProductActions = require("../actions/ProductActions");

var ProductList = React.createClass({displayName: "ProductList",
  mixins: [Navigation],

  propTypes: {
    allProducts: React.PropTypes.object.isRequired,
    allBoms: React.PropTypes.object.isRequired,
    currentProductId: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ]),
    currentBomId: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ])
  },

  getInitialState: function() {
    return {
      isAdding: false
    };
  },

  /**
   * @return {object}
   */
  render: function() {
    var currentProductId = this.props.currentProductId;
    var currentBomId = this.props.currentBomId;
    var allBoms = this.props.allBoms;
    var newProduct;
    // var newImport;

    if (this.state.isAdding) {
      newProduct = React.createElement(TextInput, {
        className: "new-product", 
        wrapperClassName: "new-product-wrapper", 
        label: "Product", 
        onSave: this._onCreate, 
        placeholder: "New Product"})
    }

    return (
      React.createElement("div", {id: "product-list"}, 
        React.createElement("h3", null, React.createElement("span", null, "Products"), 
            React.createElement(ButtonToolbar, null, 
                React.createElement(Button, {
                    className: "btn-new-product btn-nobg", 
                    bsStyle: "default", 
                    bsSize: "small", 
                    onClick: this._onAdd}, 
                    React.createElement(Glyphicon, {
                        bsSize: "small", 
                        glyph: "plus"})
                ), 
                React.createElement(Button, {
                    className: "btn-nobg", 
                    bsStyle: "default", 
                    bsSize: "small", 
                    onClick: this._onImport}, 
                    React.createElement(Glyphicon, {
                        bsSize: "small", 
                        glyph: "save"})
                )
            )
        ), 
        React.createElement("ul", null, 
        
          this.props.allProducts.map(function(result) {
            return (
              React.createElement(ProductSublist, {
                key: result.id || result.cid, 
                product: result, 
                allBoms: allBoms, 
                active: !currentBomId && !!currentProductId && !!(currentProductId == (result.id || result.cid)), 
                currentBomId: currentBomId})
            );
          })
        
        ), 
        newProduct
      )
    );
  },

  _onAdd: function(event) {
    this.setState({isAdding:true});
   },

  _onCreate: function(name) {
    var product;

    name = name.trim();
    if (name) {
      ProductActions.create(name);
      product = this.props.allProducts.last();
      this.transitionTo("product", {productId: product.id || product.cid});
    }

    this.setState({isAdding:false});
  },

  _onImport: function(event) {
    this.transitionTo("newProductImport");
  }

});

module.exports = ProductList;
