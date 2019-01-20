var React = require("react");
var Table = require("react-bootstrap").Table;

var FieldConstants = require("../constants/FieldConstants");
var HistoryItem = require("../components/HistoryItem.react");
var ChangeConstants = require("../constants/ChangeConstants");

var BomItemHistory = React.createClass({displayName: "BomItemHistory",

    propTypes: {
        bom: React.PropTypes.object,
        item: React.PropTypes.object,
        changes: React.PropTypes.array,
    },

    componentDidMount: function() {
        this._addScroll();
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
        var bom = this.props.bom;
        var item = this.props.item;
        var columns = this._getColumns();
        var changes = this.props.changes;

        if (!bom || !item) { return ( React.createElement("div", null) ); }

        changes = _.sortBy(changes, function(change) {
            return -change.get("number");
        });

        return (
            React.createElement("div", {className: "row content scrollable"}, 
                React.createElement("div", {className: "wrapper col-md-12"}, 
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
                                return (
                                    React.createElement(HistoryItem, {
                                        key: change.id || change.cid, 
                                        change: change, 
                                        bom: bom, 
                                        item: item, 
                                        columns: columns}));
                            }, this)
                        )
                    )
                )
            )
        );
    },

    _getColumns: function() {
        return [
            ChangeConstants.NUMBER,
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
    }
});

module.exports = BomItemHistory;
