var React = require("react");
var Link = require("react-router").Link;

var Table = require("react-bootstrap").Table;
var ButtonToolbar = require("react-bootstrap").ButtonToolbar;
var Glyphicon = require("react-bootstrap").Glyphicon;
var Button = require("react-bootstrap").Button;

var HistoryItem = require("../components/HistoryItem.react");
var ChangeConstants = require("../constants/ChangeConstants");
var ChangeActions = require("../actions/ChangeActions");

var BomHistory = React.createClass({displayName: "BomHistory",

    propTypes: {
        allProducts: React.PropTypes.object.isRequired,
        allBoms: React.PropTypes.object.isRequired,
        allChanges: React.PropTypes.object.isRequired
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
        var allChanges = this.props.allChanges;

        if (bom.hasLoadedChanges() || bom.isNew()) { return; }

        // load changes older than the new ones
        changes = allChanges.getVisibleForBom(bom.id || bom.cid);
        changes = _.filter(changes, function(change) {
            return change.isNew();
        });

        changes = _.sortBy(changes, function(change) {
            return change.get("number");
        });

        ChangeActions.fetchForBom(bom.id, undefined, changes.length ? changes[0].get("number") : undefined)
    },

    /**
    * @return {object}
    */
    render: function() {
        var allChanges = this.props.allChanges;
        var changes;
        var columns = this._getColumns();
        var spinner;

        var product = this._getProduct();
        if (!product) { return null; }

        var bom = this._getBom();
        if (!bom) { return null; }

        if (bom.isLoadingChanges()) {
            spinner = (
                React.createElement("tr", {key: "spinner"}, 
                    React.createElement("td", {colSpan: "6", className: "text-center"}, 
                        React.createElement(Glyphicon, {
                            className: "glyphicon-spin", 
                            bsSize: "small", 
                            bsStyle: "default", 
                            glyph: "repeat"})
                    )
                ));
        }
        else {
            changes = allChanges.getVisibleForBom(bom.id || bom.cid);
            changes = _.sortBy(changes, function(change) {
                return -change.get("number");
            });

            changes = changes.map(function(change) {
                var item = change.has("itemId") ? bom.getItem(change.get("itemId")) : undefined;

                return (
                    React.createElement(HistoryItem, {
                        key: change.id || change.cid, 
                        change: change, 
                        bom: bom, 
                        item: item, 
                        columns: columns}));
            }, this);
        }

        return (
            React.createElement("div", {className: "bom-history content scrollable"}, 
                React.createElement("div", {className: "wrapper"}, 
                    React.createElement("div", {className: "bom-history-header clearfix"}, 
                        React.createElement(ButtonToolbar, {className: "pull-left"}, 
                            React.createElement("div", {className: "btn-group"}, 
                                React.createElement("h1", null, React.createElement(Link, {to: "bom", params: {productId: product.id || product.cid, bomId: bom.id || bom.cid}}, bom.get("name")), " ", React.createElement(Glyphicon, {bsSize: "small", bsStyle: "default", glyph: "menu-right"}), " History")
                            )
                        ), 
                        React.createElement(ButtonToolbar, {className: "pull-right"}, 
                            React.createElement("div", {className: "btn-group"}, 
                                React.createElement(Link, {to: "bom", params: {productId: product.id || product.cid, bomId: bom.id || bom.cid}}, "Back to BoM")
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
                            changes, 
                            spinner
                        )
                    )
                )
            )
        );
    },

    _getColumns: function() {
        return [
            ChangeConstants.NUMBER,
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
        var before;
        var bom = this._getBom();
        var changes = this.props.allChanges.getVisibleForBom(bom.id || bom.cid);

        changes = _.sortBy(changes, function(change) {
            return -change.get("number");
        });

        before = changes.length ? _.last(changes).get("number") : undefined;

        // Fetch changes from server if never initialized
        ChangeActions.fetchForBom(bom.id, 10, before);
    }
});

module.exports = BomHistory;
