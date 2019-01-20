"use strict";

var React = require("react");
var Navigation = require("react-router").Navigation;
var ButtonToolbar = require("react-bootstrap").ButtonToolbar;
var Glyphicon = require("react-bootstrap").Glyphicon;

var AppDispatcher = require("dispatcher/AppDispatcher");
var BomPanel = require("components/BomPanel.jsx");
var FilePanel = require("components/FilePanel.jsx");
var CommentPanel = require("components/CommentPanel.jsx");
var EditableLabel = require("components/EditableLabel.jsx");
var HistoryPanel = require("components/HistoryPanel.jsx");
var Modal = require("components/modals/Modal.jsx");
var ProductStore = require("stores/ProductStore");
var Scroll = require("components/Scroll.jsx");
var TutorialStore = require("stores/TutorialStore");

var ProductDashboard = React.createClass({
    mixins: [Navigation],

    propTypes: {
        product: React.PropTypes.object.isRequired
    },

    getInitialState: function(props) {
        props = props || this.props;
        var product = props.product;
        return {
            name: product.get("name")
        };
    },

    componentDidMount: function() {
        this.subscribe(this.props);
    },

    componentWillUnmount: function() {
        this.unsubscribe(this.props);
    },

    componentWillReceiveProps: function(nextProps) {
        if (this.props.product !== nextProps.product) {
            this.unsubscribe(this.props);
            this.subscribe(nextProps);
            this.setState( this.getInitialState(nextProps) );
        }
    },

    subscribe: function(props) {
        props.product.on("change:name", this.onChangeName);
    },

    unsubscribe: function(props) {
        props.product.off("change:name", this.onChangeName);
    },

    onChangeName: function() {
        this.setState({
            name: this.props.product.get("name")
        });
    },

    render: function() {
        var product = this.props.product;
        var nameElement;

        return (
            <Scroll className="product-dashboard">
                <div className="row no-gutter">
                    <div className="col-xs-12">
                        <EditableLabel
                            className="product-name h4"
                            value={this.state.name}
                            onSave={this.onSaveProductName} />
                    </div>
                </div>
                <div className="product-content">
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <BomPanel model={product} />
                        <FilePanel model={product}/>
                        <HistoryPanel product={product}/>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <CommentPanel comments={product.getComments()} />
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <button
                            className="pull-right btn btn-outline-danger"
                            onClick={this.onDeleteProduct} >
                            Delete this product
                        </button>
                    </div>
                </div>
            </Scroll>
        );
    },

    onSaveProductName: function(name) {
        var product = this.props.product;

        name = name || "";
        name = name.trim();

        if (name && product.get("name") !== name) {
            product.save({name: name});
        }
    },

    onDeleteProduct: function(event) {
        AppDispatcher.dispatch({
            action: {
                type: "show-modal"
            },
            modal: (
                <Modal
                    title="Delete Product"
                    saveLabel="Confirm"
                    dismissLabel="Cancel"
                    onConfirm={this.onConfirmProductDelete}>
                    Are you sure you want to permanently delete this product?
                </Modal>)
        });
   },

   onConfirmProductDelete: function() {
        this.props.product.destroy();
   }
});

module.exports = ProductDashboard;
