var React = require("react");
var Link = require("react-router").Link;
var Navigation = require("react-router").Navigation;

var Table = require("react-bootstrap").Table;
var ButtonToolbar = require("react-bootstrap").ButtonToolbar;
var Glyphicon = require("react-bootstrap").Glyphicon;
var Button = require("react-bootstrap").Button;

var HistoryItem = require("../components/HistoryItem.react");
var ChangeConstants = require("../constants/ChangeConstants");
var ChangeActions = require("../actions/ChangeActions");

var ProductHistory = React.createClass({displayName: "ProductHistory",
    mixins: [Navigation],

    propTypes: {
        allProducts: React.PropTypes.object.isRequired,
        allChanges: React.PropTypes.object.isRequired
    },

    componentWillMount: function() {
        this._validateProduct(this.props);
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

    _init: function() {
        var product = this._getProduct();
        var changes = this.props.allChanges.getVisibleForProduct(product.id || product.cid);

        changes = _.sortBy(changes, function(change) {
            return change.get("number");
        });

        if (product.isLoadingChanges() ||
            product.isNew() ||
            (changes.length && changes[0].get("number") === 1) ||
            changes.length >= 10) { return; }

        // load changes older than the new ones
        changes = _.filter(changes, function(change) {
            return change.isNew();
        });

        ChangeActions.fetchForProduct(product.id, 10, changes.length ? changes[0].get("number") : undefined);
    },

    /**
    * @return {object}
    */
    render: function() {
        var changes;
        var allBoms = this.props.allBoms;
        var columns = this._getColumns();
        var more;
        var spinner;
        var last;

        var product = this._getProduct();
        if (!product) { return null; }

        changes = this.props.allChanges.getVisibleForProduct(product.id || product.cid);
        changes = _.sortBy(changes, function(change) {
            return -change.get("number");
        });

        last = this.props.allChanges.getLastConsecutiveForProduct(product.id || product.cid);

        if (last) {
            changes = _.filter(changes, function(change) {
                return change.get("number") >= last.get("number");
            });
        }

        if (product.isLoadingChanges()) {
            spinner = (
                React.createElement("tr", {key: "spinner"}, 
                    React.createElement("td", {colSpan: "8", className: "text-center"}, 
                        React.createElement(Glyphicon, {
                            className: "glyphicon-spin", 
                            bsSize: "small", 
                            bsStyle: "default", 
                            glyph: "repeat"})
                    )
                ));
        }
        else if (!last || last.get("number") !== 1) {
            more = (
                React.createElement("tr", {key: "more"}, 
                    React.createElement("td", {colSpan: "8", className: "text-center"}, 
                        React.createElement(Button, {bsStyle: "link", onClick: this._loadPrevious}, "load previous")
                    )
                ));
        }

        return (
            React.createElement("div", {className: "bom-history content"}, 
                React.createElement("div", {className: "wrapper"}, 
                    React.createElement("div", {className: "bom-history-header clearfix"}, 
                        React.createElement(ButtonToolbar, {className: "pull-left"}, 
                            React.createElement("div", {className: "btn-group"}, 
                                React.createElement("h1", null, React.createElement(Link, {to: "product", params: {productId: product.id || product.cid}}, product.get("name")), " ", React.createElement(Glyphicon, {bsSize: "small", bsStyle: "default", glyph: "menu-right"}), " History")
                            )
                        ), 
                        React.createElement(ButtonToolbar, {className: "pull-right"}, 
                            React.createElement("div", {className: "btn-group"}, 
                                React.createElement(Link, {to: "product", params: {productId: product.id || product.cid}}, "Back to Product Dashboard")
                            )
                        )
                    ), 
                    React.createElement(Table, {striped: true, bordered: true, condensed: true, hover: true, fill: true}, 
                        React.createElement("thead", null, 
                            React.createElement("tr", null, 
                                columns.map(function(columnId) {
                                    return this._getHeader(columnId);
                                }, this)
                            )
                        ), 
                        React.createElement("tbody", null, 
                            changes.map(function(change) {
                                var bom = change.has("bomId") ? allBoms.get( change.get("bomId") ) : undefined;
                                var item = bom && change.has("itemId") ? bom.getItem(change.get("itemId")) : undefined;

                                return (
                                    React.createElement(HistoryItem, {
                                        key: change.id || change.cid, 
                                        change: change, 
                                        bom: bom, 
                                        item: item, 
                                        columns: columns}));
                            }, this), 
                            spinner, 
                            more
                        )
                    )
                )
            )
        );
    },

    _getColumns: function() {
        return [
            ChangeConstants.NUMBER,
            ChangeConstants.BOM_ID,
            ChangeConstants.BOM_NAME,
            ChangeConstants.ITEM_ID,
            ChangeConstants.ITEM_SKU,
            ChangeConstants.DETAILS,
            ChangeConstants.DATE,
            ChangeConstants.STATUS
        ];
    },

    // TODO move the history table into a component
    _getHeader: function(columnId) {
        switch(columnId) {
            case ChangeConstants.NUMBER:
                return (React.createElement("th", {className: "compact", key: columnId}, "Change #"));
                break;
            case ChangeConstants.BOM_ID:
                return (React.createElement("th", {className: "compact", key: columnId}, "BoM ID"));
                break;
            case ChangeConstants.BOM_NAME:
                return (React.createElement("th", {className: "compact", key: columnId}, "BoM Name"));
                break;
            case ChangeConstants.ITEM_ID:
                return (React.createElement("th", {className: "compact", key: columnId}, "Item ID"));
                break;
            case ChangeConstants.ITEM_SKU:
                return (React.createElement("th", {className: "compact", key: columnId}, "Item SKU"));
                break;
            case ChangeConstants.DETAILS:
                return (React.createElement("th", {key: columnId}, "Details"));
                break;
            case ChangeConstants.DATE:
                return (React.createElement("th", {className: "compact", key: columnId}, "Date"));
                break;
            case ChangeConstants.STATUS:
                return (React.createElement("th", {className: "compact", key: columnId}, "Saved"));
                break;
        }
    },

    _loadPrevious: function() {
        var product = this._getProduct();
        var last = this.props.allChanges.getLastConsecutiveForProduct(product.id || product.cid);
        ChangeActions.fetchForProduct(product.id, 10, last ? last.get("number") : undefined);
    }
});

module.exports = ProductHistory;
