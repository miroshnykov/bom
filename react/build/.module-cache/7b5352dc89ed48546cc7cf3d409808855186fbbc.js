var React = require("react");
var ButtonToolbar = require("react-bootstrap").ButtonToolbar;
var Button = require("react-bootstrap").Button;
var Alert = require("react-bootstrap").Alert;
var Input = require("react-bootstrap").Input;
var Panel = require("react-bootstrap").Panel;
var Navigation = require("react-router").Navigation;

var ProductActions = require("../actions/ProductActions");

var WelcomeWizard = React.createClass({displayName: "WelcomeWizard",
    mixins: [Navigation],

    propTypes: {
        allImportBoms: React.PropTypes.object.isRequired,
        allFields: React.PropTypes.object.isRequired,
        allTypes: React.PropTypes.object.isRequired,
        allProducts: React.PropTypes.object.isRequired
    },

    componentWillMount: function() {
        //this.validate(this.props);
    },

    componentWillReceiveProps: function(nextProps) {
        //this.validate(nextProps);
    },

    validate: function(props) {
        // props = props || {};

        // var product = this.props.allProducts.last();
        // if (product) {
        //     this.transitionTo("product", {productId: product.id || product.cid});
        // }
    },

    /**
     * @return {object}
     */
    render: function() {
        return (
            React.createElement("div", {id: "welcome", className: "content scrollable"}, 
                React.createElement("div", {className: "wrapper"}, 
                    React.createElement("div", null, 
                        React.createElement("h1", null, "Welcome to BoM Squad!"), 
                        React.createElement("p", null, "To get started, you can create a fresh new Product from the panel on the left, or you can import a Bill of Materials from a CSV file that you already have, and we'll make a Product for it."), 
                        React.createElement("p", null, "A Product can contain more than on BoM, since it might have several parts to it."), 
                        React.createElement("p", null, "If you have any questions, don't hesitate to shoot them our way at ", React.createElement("a", {href: "mailto:bom@fabule.com"}, "bom@fabule.com"), ".")
                    ), 
                    React.createElement(ButtonToolbar, null, 
                        React.createElement(Button, {
                            bsStyle: "primary", 
                            bsSize: "large", 
                            onClick: this._onNewProduct}, 
                            "CREATE A NEW PRODUCT"
                        ), 
                        React.createElement(Button, {
                            bsStyle: "primary", 
                            bsSize: "large", 
                            onClick: this._transitionToImport}, 
                            "IMPORT BoM FROM CSV FILE"
                        )
                    )
                )
            )
        );
    },

    _onNewProduct: function() {
        var product;

        ProductActions.create("My Product");

        product = this.props.allProducts.last();
        if(product) {
            this.transitionTo("product", { productId: product.id || product.cid });
        }
    },

    _transitionToImport: function() {
        this.transitionTo("newProductImport");
    }
});

module.exports = WelcomeWizard;
