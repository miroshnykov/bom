var React = require("react");
var RouteHandler = require("react-router").RouteHandler;
var Navigation = require("react-router").Navigation;

var ComponentActions = require("../actions/ComponentActions");

var Product = React.createClass({displayName: "Product",
  mixins: [Navigation],

  propTypes: {
    allBoms: React.PropTypes.object.isRequired,
    allSelectedBomItems: React.PropTypes.object.isRequired,
    //allComponents: React.PropTypes.object.isRequired,
    allFields: React.PropTypes.object.isRequired,
    allTypes: React.PropTypes.object.isRequired
  },

  componentWillReceiveProps: function(nextProps) {
    this._validateProduct( nextProps );
  },

  componentWillMount: function() {
    this._validateProduct( this.props );
  },

  /**
   * @return {object}
   */
  render: function() {
    var product = this.props.allProducts.get( this.props.params.productId );
    if (!product) { return null; }

    return (
      React.createElement("div", {id: "product", className: "content"}, 
        React.createElement(RouteHandler, {
            params: this.props.params, 
            allProducts: this.props.allProducts, 
            allBoms: this.props.allBoms, 
            allSelectedBomItems: this.props.allSelectedBomItems, 
            allFields: this.props.allFields, 
            allTypes: this.props.allTypes})
      )
    );
  },

  _validateProduct: function(props) {
    var product = this._getProduct(props);

    if ( !product ) {
      this.replaceWith("dashboard");
    }
    else if ( product.id && product.id !== +props.params.productId ) {
      this.replaceWith("product", {productId: product.id} );
    }
  },

  _isProductValid: function(props) {
    return !!this._getProduct(props);
  },

  _getProduct: function(props) {
      return props.allProducts.get( props.params.productId );
  }

});

module.exports = Product;
