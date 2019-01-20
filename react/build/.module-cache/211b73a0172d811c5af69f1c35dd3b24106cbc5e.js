var React = require("react");
var Link = require("react-router").Link;
var Navigation = require("react-router").Navigation;

var Panel = require("react-bootstrap").Panel;
var Table = require("react-bootstrap").Table;
var ButtonToolbar = require("react-bootstrap").ButtonToolbar;
var Button = require("react-bootstrap").Button;
var Glyphicon = require("react-bootstrap").Glyphicon;

var HistoryItem = require("../components/HistoryItem.react");
var ChangeConstants = require("../constants/ChangeConstants");
var ChangeActions = require("../actions/ChangeActions");

var HistoryPanel = React.createClass({displayName: "HistoryPanel",
    mixins: [Navigation],

    propTypes: {
        product: React.PropTypes.object.isRequired,
        changes: React.PropTypes.array.isRequired,
        allBoms: React.PropTypes.object.isRequired,
        expanded: React.PropTypes.bool
    },

    getInitialState: function() {
        return {
            isExpanded: this.props.expanded
        };
    },

    componentDidMount: function() {
        this._init();
    },

    componentDidUpdate: function(prevProps, prevState) {
        this._init();
    },

    _init: function() {
        var product = this.props.product;
        var changes = this.props.changes;

        // load changes older than the new ones
        changes = _.filter(changes, function(change) {
            return change.isNew();
        });

        changes = _.sortBy(changes, function(change) {
            return change.get("number");
        });

        if (!this.state.isExpanded ||
            product.isNew() ||
            product.hasLoadedChanges()) { return; }

        ChangeActions.fetchForProduct(product.id, 10, changes.length ? changes[0].get("number") : undefined);
    },

    /**
     * @return {object}
     */
    render: function() {
        var product = this.props.product;
        var allBoms = this.props.allBoms;
        var columns = this._getColumns();
        var changes = this.props.changes;
        var count;
        var total;
        var spinner;

        changes = _.sortBy(changes, function(change) {
            return -change.get("number");
        });

        total = changes.length ? _.first(changes).get("number") : 0;

        changes = _.first(changes, 10);

        if (product.hasLoadedChanges() && !product.isLoadingChanges()) {
            count = changes.length ? (React.createElement("span", null, " (", changes.length, "/", total, " change", total>1?"s":"", ")")) : undefined;
        }

        header = (
            React.createElement("div", {onClick: this._onToggle}, 
                React.createElement(ButtonToolbar, {className: "pull-right btn-toolbar-right"}, 
                    React.createElement(Button, {
                        className: "btn-nobg", 
                        bsStyle: "default", 
                        bsSize: "small", 
                        onClick: this._onViewAll}, 
                        React.createElement(Glyphicon, {glyph: "list"})
                    )
                ), 
                React.createElement(ButtonToolbar, {className: "pull-left"}, 
                    React.createElement(Glyphicon, {glyph: this.state.isExpanded ? "triangle-bottom" : "triangle-right"})
                ), 
                React.createElement("h2", null, "Recent History", count)
            ));

        if (product.isLoadingChanges()) {
            spinner = (
                React.createElement("tr", null, 
                    React.createElement("td", {colSpan: "8", className: "text-center"}, 
                        React.createElement(Glyphicon, {
                            className: "glyphicon-spin", 
                            bsSize: "small", 
                            bsStyle: "default", 
                            glyph: "repeat"})
                    )
                ));
            changes = undefined;
        }
        else {
            changes = changes.map(function(change) {
                var bom = change.has("bomId") ? allBoms.get(change.get("bomId")) : undefined;
                var item = bom && change.has("itemId") ? bom.getItem(change.get("itemId")) : undefined;

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
            React.createElement(Panel, {className: "history-panel", header: header, expanded: this.state.isExpanded, collapsable: true}, 
                React.createElement(Table, {striped: true, bordered: true, condensed: true, hover: true, fill: true}, 
                    React.createElement("thead", null, 
                        React.createElement("tr", null, 
                            columns.map(function(columnId) {
                                return this._getHeader(columnId);
                            }, this)
                        )
                    ), 
                    React.createElement("tbody", null, 
                        spinner, 
                        changes
                    )
                )
            )
        );
    },

    _onViewAll: function(event) {
        var product = this.props.product;
        this.transitionTo("productHistory", {productId: product.id || product.cid});
    },

    _onToggle: function(event) {
        this.setState({ isExpanded: !this.state.isExpanded });
        this._init();
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
});

module.exports = HistoryPanel;
