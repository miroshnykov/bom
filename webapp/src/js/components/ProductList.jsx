"use strict";

var _ = require("underscore");
var backboneMixin = require("backbone-react-component");
var cx = require("react/lib/cx");
var Navigation = require("react-router").Navigation;
var React = require("react");

var BomStore = require("stores/BomStore");
var ProductModel = require("models/ProductModel");
var ProductStore = require("stores/ProductStore");
var ProductSublist = require("components/ProductSublist.jsx");
var ValidatedInput = require("components/forms/ValidatedInput.jsx");

var ProductList = React.createClass({
    mixins: [Navigation, backboneMixin],

    propTypes: {
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
            isAdding: false,
            isSaving: false
        };
    },

    render: function() {
        var currentProductId = this.props.currentProductId;
        var currentBomId = this.props.currentBomId;
        var newProduct;

        if (this.state.isAdding) {
            newProduct =
                <form onSubmit={this.onSubmitNewProduct}>
                    <ValidatedInput
                        ref="name"
                        name="name"
                        placeholder="Product Name"
                        onBlur={this.onSubmitNewProduct}
                        type="text"
                        autoFocus={true}
                        autoComplete={false}
                        disabled={this.state.isSaving}
                        shortcuts={{
                            "enter": this.onSubmitNewProduct,
                            "esc": this.onToggleAddNewProduct
                        }}
                    />
                </form>
        }

        return (
            <div className="product-list">
                <h4 className="title">
                    <div className="pull-right btn-toolbar" role="toolbar">
                        <button className="btn btn-nobg btn-lg btn-default" title="Add a Product" type="button" onClick={this.onToggleAddNewProduct}>
                            <span className="fa fa-plus-square-o"></span>
                        </button>
                    </div>
                    <span>Products</span>
                </h4>
                <ul>
                {
                    this.getCollection().map(function(result) {
                        return (
                            <ProductSublist
                                key={result.id || result.cid}
                                model={result}
                                active={currentProductId && (+currentProductId === result.id || currentProductId === result.cid)}
                                currentBomId={currentBomId}
                                currentProductId={currentProductId} />
                        );
                    })
                }
                </ul>
                {newProduct}
            </div>
        );
    },

    onToggleAddNewProduct: function(event) {
        this.setState({
            isAdding: !this.state.isAdding
        });
    },

    onSubmitNewProduct: function(event) {
        if (event) {
            event.preventDefault();
        }

        if (this.state.isSaving) { return; }

        var name;
        var product;
        var bom;

        name = this.refs.name.state.value;
        name = name ? name.trim() : name;

        if (!name) {
            this.setState({
                isAdding: false
            });
            return;
        }

        this.setState({
            isSaving: true
        });

        product = new ProductModel();
        product.set("name", name);

        product.save(undefined, {
            createBom: true
        }).then(function(product) {
            var bom = BomStore.collection.add({
                id: _.first(product.getBoms()),
                name: "BoM"
            });

            product.attachBom(bom);
            ProductStore.collection.add(product);
            return product;
        }).then(function(product) {
            this.transitionTo("product", { productId: product.id });

            this.setState({
                isAdding: false,
                isSaving: false
            });
        }.bind(this)).then(undefined, function(error) {
            this.setState({
                isSaving: false
            });
        });
    }

});

module.exports = ProductList;
