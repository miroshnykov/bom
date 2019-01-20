var React = require("react");
var Glyphicon = require("react-bootstrap").Glyphicon;

var FieldConstants = require("../constants/FieldConstants");
var ChangeConstants = require("../constants/ChangeConstants");

var HistoryItem = React.createClass({displayName: "HistoryItem",
    propTypes: {
        change: React.PropTypes.object.isRequired,
        bom: React.PropTypes.object,
        item: React.PropTypes.object,
        columns: React.PropTypes.array
    },

    /**
     * @return {object}
     */
    render: function() {
        var change = this.props.change;
        var bom = this.props.bom;
        var item = this.props.item;
        var columns = this.props.columns || this._getDefaultColumns();

        return (
            React.createElement("tr", {key: change.id || change.cid}, 
                columns.map(function(columnId) {
                    return this._getCell(columnId, change, bom, item);
                }, this)
            )
        );
    },

    _getDefaultColumns: function() {
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

    _getCell: function(columnId, change, bom, item) {
        switch(columnId) {
            case ChangeConstants.NUMBER:
                return (React.createElement("td", {key: columnId}, change.get("number")));
                break;
            case ChangeConstants.BOM_ID:
                return (React.createElement("td", {key: columnId}, change.get("bomId")));
                break;
            case ChangeConstants.BOM_NAME:
                return (React.createElement("td", {key: columnId, className: "nowrap"}, change.get("bomId") ? (bom ? bom.get("name") : "Deleted") : ""));
                break;
            case ChangeConstants.ITEM_ID:
                return (React.createElement("td", {key: columnId}, bom && item ? bom.getItemValueContentForField(item.id || item.cid, FieldConstants.ID) : ""));
                break;
            case ChangeConstants.ITEM_SKU:
                return (React.createElement("td", {key: columnId}, bom && item ? bom.getItemValueContentForField(item.id || item.cid, FieldConstants.SKU) : ""));
                break;
            case ChangeConstants.DETAILS:
                return (React.createElement("td", {key: columnId}, change.get("description")));
                break;
            case ChangeConstants.DATE:
                return (React.createElement("td", {key: columnId, className: "nowrap"}, change.getLocalCreatedAt()));
                break;
            case ChangeConstants.STATUS:
                return (React.createElement("td", {key: columnId}, this._getStatus(change)));
                break;
        }
    },

    _getStatus: function(change) {
        if (change.isSaved()) {
            return (React.createElement(Glyphicon, {bsSize: "small", bsStyle: "success", glyph: "ok-circle"}));
        }
        else if (change.isSaving()) {
            return (React.createElement(Glyphicon, {className: "glyphicon-spin", bsSize: "small", bsStyle: "primary", glyph: "repeat"}));
        }
        else if (change.triedSaving()) {
            return (React.createElement(Glyphicon, {bsSize: "small", bsStyle: "danger", glyph: "ban-circle"}));
        }
        else {
            return (React.createElement(Glyphicon, {bsSize: "small", bsStyle: "default", glyph: "record"}));
        }
    }
});

module.exports = HistoryItem;
