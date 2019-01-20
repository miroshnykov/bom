"use strict";

var React = require("react");
var Link = require("react-router").Link;

var Table = require("react-bootstrap").Table;
var ButtonToolbar = require("react-bootstrap").ButtonToolbar;
var Glyphicon = require("react-bootstrap").Glyphicon;
var Button = require("react-bootstrap").Button;

var CommentItem = require("../components/CommentItem.react");
var ChangeConstants = require("../constants/ChangeConstants");
var BomActions = require("../actions/BomActions");
var TextInput = require("../components/TextInput.react");

var BomComments = React.createClass({displayName: "BomComments",

    propTypes: {
        allProducts: React.PropTypes.object.isRequired,
        allBoms: React.PropTypes.object.isRequired
    },

    getInitialState: function() {
        return {
            isAdding: false
        };
    },

    componentWillMount: function() {
        this._validateBom(this.props);
    },

    componentDidMount: function() {
        this._addScroll();
        this._init();
    },

    componentWillUnmount: function() {
        this._removeScroll();
    },

    componentDidUpdate: function(nextProps) {
        $(this.getDOMNode()).getNiceScroll().resize();

        // Trigger a fake mouse enter
        // This solve a bug that seem to fail to update the width
        // of the horizontal scrollbar when the left panel opens
        $(this.getDOMNode()).trigger("mouseenter");

        this._init();
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

    _validateBom: function(props) {
        var bom = this._getBom( props );
        var product = this._getProduct( props );

        //TODO check this because of update order
        //if ( !bom || props.product.isAncestorOfBom(bom.id || bom.cid)) {
        if ( !product ) {
            this.replaceWith("dashboard");
            return false;
        }
        // If the bom does not exists, try to redirect to the product
        else if ( !bom ) {
            this.replaceWith("product", {productId: product.id || product.cid});
            return false;
        }
        // Redirect if bomId is present as parameter but doesn't match
        // This is used to redirect a client id to its permanent id
        else if ( bom.id && bom.id !== +props.params.bomId ) {
            this.replaceWith("bom", {
                productId: product.id || product.cid,
                bomId: bom.id});
            return false;
        }

        return true;
    },

    _getProduct: function(props) {
        var productId;
        props = props ? props : this.props;
        productId = props.params ? props.params.productId : undefined;
        return props.allProducts.get( productId );
    },

    _getBom: function(props) {
        var product;
        props = props ? props : this.props;

        if (props.params && props.params.bomId) {
            return props.allBoms.get( props.params.bomId );
        }
        else if ((product = this._getProduct(props))) {
            return props.allBoms.get( product.get("bomId") );
        }
    },

    _init: function() {
        var bom = this._getBom();

        if (bom.getComments().hasFetched() ||
            bom.getComments().isLoaded()) {
            return;
        }

        BomActions.fetchComments(bom.id, 10);
    },

    /**
    * @return {object}
    */
    render: function() {
        var product = this._getProduct();
        if (!product) { return null; }

        var bom = this._getBom();
        if (!bom) { return null; }

        var newComment;
        var spinner;
        var more;

        // Create the new BoM item if + was clicked
        if (this.state.isAdding) {
            newComment = (React.createElement("tr", null, 
                    React.createElement("td", null, 
                        React.createElement(TextInput, {
                            type: "textarea", 
                            className: "edit", 
                            onSave: this._onSaveNew, 
                            onCancel: this._onCancelNew, 
                            value: "", 
                            placeholder: "Enter your comment"})
                    ), 
                    React.createElement("td", {className: "compact"}, 
                        React.createElement(Button, {
                            className: "btn-nobg", 
                            bsStyle: "danger", 
                            bsSize: "small", 
                            onClick: this._onCancelNew}, 
                            React.createElement(Glyphicon, {glyph: "remove"})
                        )
                    )
                ));
        }
        else {
            newComment = (React.createElement("tr", null, 
                    React.createElement("td", {colSpan: "2", onClick: this._onAdd}, 
                        React.createElement(ButtonToolbar, {className: "pull-right btn-toolbar-right"}, 
                            React.createElement(Button, {
                                className: "btn-nobg", 
                                bsStyle: "default", 
                                bsSize: "small", 
                                onClick: this._onAdd}, 
                                React.createElement(Glyphicon, {glyph: "plus"})
                            )
                        )
                    )
                ));
        }

        if (bom.getComments().isFetching()) {
            spinner = (
                React.createElement("tr", {key: "spinner"}, 
                    React.createElement("td", {colSpan: "2", className: "text-center"}, 
                        React.createElement(Glyphicon, {
                            className: "glyphicon-spin", 
                            bsSize: "small", 
                            bsStyle: "default", 
                            glyph: "repeat"})
                    )
                ));
        }
        else if (!bom.getComments().isLoaded()) {
            more = (
                React.createElement("tr", {key: "more"}, 
                    React.createElement("td", {colSpan: "2", className: "text-center"}, 
                        React.createElement(Button, {bsStyle: "link", onClick: this._loadPrevious}, "load previous")
                    )
                ));
        }

        return (
            React.createElement("div", {className: "bom-comments content scrollable"}, 
                React.createElement("div", {className: "wrapper"}, 
                    React.createElement("div", {className: "bom-comments-header clearfix"}, 
                        React.createElement(ButtonToolbar, {className: "pull-left"}, 
                            React.createElement("div", {className: "btn-group"}, 
                                React.createElement("h1", null, React.createElement(Link, {to: "bom", params: {productId: product.id || product.cid, bomId: bom.id || bom.cid}}, bom.get("name")), " ", React.createElement(Glyphicon, {bsSize: "small", bsStyle: "default", glyph: "menu-right"}), " Comments")
                            )
                        ), 
                        React.createElement(ButtonToolbar, {className: "pull-right"}, 
                            React.createElement("div", {className: "btn-group"}, 
                                React.createElement(Link, {to: "bom", params: {productId: product.id || product.cid, bomId: bom.id || bom.cid}}, "Back to BoM")
                            )
                        )
                    ), 
                    React.createElement("div", {className: "row col-xs-12 col-sm-12 col-md-6 col-lg-6"}, 
                        React.createElement(Table, {className: "comment-table", striped: true, bordered: true, condensed: true, hover: true, fill: true}, 
                            React.createElement("tbody", null, 
                                newComment, 
                                bom.getComments().map(function(comment, index) {
                                    return (React.createElement(CommentItem, {
                                        key: comment.id || comment.cid, 
                                        comment: comment, 
                                        onSave: this._onSaveEdit, 
                                        onRemove: this._onRemove}));
                                }, this), 
                                spinner, 
                                more
                            )
                        )
                    )
                )
            )
        );
    },

    _onAdd: function(event) {
        this.setState({
            isAdding: true
        });

        event.stopPropagation();
        event.preventDefault();
    },

    _onCancelNew: function(event) {
        this.setState({
            isAdding: false,
        });
    },

    _onSaveNew: function(body) {
        var bom = this._getBom();
        if (!bom) { return null; }

        body = body || "";
        body = body.trim();

        if (body) {
            BomActions.createComment(bom.id || bom.cid, body);
        }

        this.setState({
            isAdding: false,
        });
    },

    _onSaveEdit: function(commentId, body) {
        var bom = this._getBom();
        if (!bom) { return null; }

        BomActions.updateComment(bom.id || bom.cid, commentId, body);
    },

    _onRemove: function(commentId) {
        var bom = this._getBom();
        if (!bom) { return null; }

        BomActions.destroyComment(bom.id || bom.cid, commentId);
    },

    _loadPrevious: function() {
        var bom = this._getBom();
        if (!bom) { return null; }

        BomActions.fetchComments(bom.id, 10);
    }
});

module.exports = BomComments;
