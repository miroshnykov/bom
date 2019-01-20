"use strict";

var $ = require("jquery");
var React = require("react");
var Navigation = require("react-router").Navigation;
var Button = require("react-bootstrap").Button;
var ButtonToolbar = require("react-bootstrap").ButtonToolbar;
var Glyphicon = require("react-bootstrap").Glyphicon;

var BomPanel = require("../components/BomPanel.react");
var CommentPanel = require("../components/CommentPanel.react");
var HistoryPanel = require("../components/HistoryPanel.react");
var ProductActions = require("../actions/ProductActions");
var TextInput = require("../components/TextInput.react");

var Product = React.createClass({displayName: "Product",
    mixins: [Navigation],

    propTypes: {
        allBoms: React.PropTypes.object.isRequired,
        allSelectedBomItems: React.PropTypes.object.isRequired,
        allFields: React.PropTypes.object.isRequired,
        allTypes: React.PropTypes.object.isRequired,
        allChanges: React.PropTypes.object.isRequired,
    },

    getInitialState: function() {
        return {
            isEditing: false
        };
    },

    componentWillMount: function() {
        this._validateProduct( this.props );
    },

    componentDidMount: function() {
        this._addScroll();
    },

    componentWillReceiveProps: function(nextProps) {
        this._validateProduct( nextProps );
    },

    componentDidUpdate: function(nextProps) {
        $(this.getDOMNode()).getNiceScroll().resize();

        // Trigger a fake mouse enter
        // This solve a bug that seem to fail to update the width
        // of the horizontal scrollbar when the left panel opens
        $(this.getDOMNode()).trigger("mouseenter");
    },

    componentWillUnmount: function() {
        this._removeScroll();
    },

    _addScroll: function() {
        $(this.getDOMNode()).niceScroll({
            cursoropacitymax: 0.25,
            cursorwidth: "10px",
            railpadding: {
                top: 5,
                right: 1,
                left: 1,
                bottom: 5
            }
        });
    },

    _removeScroll: function() {
        $(this.getDOMNode()).getNiceScroll().remove();
    },

    /**
     * @return {object}
     */
    render: function() {
        var product = this.props.allProducts.get( this.props.params.productId );
        var nameElement;
        var changes;

        if (!product) { return null; }

        if (this.state.isEditing) {
            nameElement = (React.createElement("div", null, 
                React.createElement(TextInput, {
                    className: "edit", 
                    onSave: this._onSaveProductName, 
                    onCancel: this._onCancelProductName, 
                    value: product.get("name")})
            ));
        }
        else {
            nameElement = (React.createElement("div", null, 
                    React.createElement("h1", null, product.get("name")), 
                    React.createElement(Button, {
                        className: "btn-nobg", 
                        bsStyle: "default", 
                        bsSize: "small", 
                        onClick: this._onEditProductName}, 
                        React.createElement(Glyphicon, {
                            bsSize: "small", 
                            glyph: "pencil"})
                    )
                ));
        }

        changes = this.props.allChanges.getVisibleForProduct(product.id || product.cid);

        return (
            React.createElement("div", {id: "product", className: "content"}, 
                React.createElement("div", {className: "wrapper"}, 
                    React.createElement("div", {className: "product-header clearfix row"}, 
                        React.createElement("div", {className: "col-xs-12 col-sm-12 col-md-6 col-lg-6"}, 
                            nameElement
                        )
                    ), 
                    React.createElement("div", {className: "product-content row"}, 
                        React.createElement("div", {className: "col-xs-12 col-sm-12 col-md-6 col-lg-6"}, 
                            React.createElement(BomPanel, {
                                product: product, 
                                allBoms: this.props.allBoms, 
                                expanded: true})
                        ), 
                        React.createElement("div", {className: "col-xs-12 col-sm-12 col-md-6 col-lg-6"}, 
                            React.createElement(CommentPanel, {
                                product: product, 
                                expanded: true})
                        ), 
                        React.createElement("div", {className: "col-xs-12 col-sm-12 col-md-12 col-lg-12"}, 
                            React.createElement(HistoryPanel, {
                                product: product, 
                                changes: changes, 
                                allBoms: this.props.allBoms, 
                                expanded: true})
                        ), 
                        React.createElement("div", {className: "col-xs-12 col-sm-12 col-md-12 col-lg-12"}, 
                            React.createElement(Button, {
                                className: "pull-right", 
                                bsStyle: "danger", 
                                onClick: this._onDeleteProduct}, 
                                "DELETE THIS PRODUCT"
                            )
                        )
                    )
                )
            )
        );
    },

    _validateProduct: function(props) {
        var product = this._getProduct(props);

        if ( !product ) {
            this.replaceWith("dashboard");
        }
        // Redirect if productId is present as parameter but doesn't match
        // This is used to redirect a client id to its permanent id
        else if ( product.id && product.id !== +props.params.productId ) {
            this.replaceWith("product", {productId: product.id} );
        }
    },

    _getProduct: function(props) {
        var productId;
        props = props ? props : this.props;
        productId = props.params ? props.params.productId : undefined;
        return props.allProducts.get( productId );
    },

    _onEditProductName: function(event) {
        this.setState({
            isEditing: true
        });
    },

    _onCancelProductName: function() {
        this.setState({ isEditing: false });
    },

    _onSaveProductName: function(name) {
        var product = this._getProduct();

        name = name || "";
        name = name.trim();

        if (name && product.get("name") !== name) {
            ProductActions.updateName(product.id || product.cid, name);
        }

        this.setState({ isEditing: false });
    },

    _onDeleteProduct: function(event) {
         var product = this._getProduct();
         if (!product) { return; }

        if (confirm("Are you sure you want to permanently delete this product?")) {
            ProductActions.destroy(product.id || product.cid);
        }
   }
});

module.exports = Product;
