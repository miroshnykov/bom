"use strict";

var React = require("react");
var Navigation = require("react-router").Navigation;
var Link = require("react-router").Link;
var moment = require("moment");

var FieldConstants = require("constants/FieldConstants");
var ChangeConstants = require("constants/ChangeConstants");
var BomStore = require("stores/BomStore");

var HistoryItem = React.createClass({
    mixins: [Navigation],

    propTypes: {
        change: React.PropTypes.object.isRequired,
        columns: React.PropTypes.array.isRequired
    },

    render: function() {
        var change = this.props.change;
        var columns = this.props.columns;

        return (
            <tr>
                {columns.map(function(columnId) {
                    return this.renderCell(columnId, change);
                }, this)}
            </tr>
        );
    },

    renderCell: function(columnId, change) {
        var bom;
        var bomName;
        var sku;

        switch(columnId) {
            case ChangeConstants.NUMBER:
                return (<td className="text-center" key={columnId}>{change.get("number")}</td>);
                break;
            case ChangeConstants.BOM_NAME:
                bom = change.get("bomId") ? BomStore.collection.get(change.get("bomId")) : undefined;
                bomName = change.get("bomId") && bom ?
                    <Link to="bom" params={{productId: change.get("productId"), bomId: bom.id}}>{change.get("bomName")}</Link> :
                    change.get("bomName");
                return (<td key={columnId} className="nowrap">{bomName}</td>);
                break;
            case ChangeConstants.ITEM_SKU:
                return (<td key={columnId}>{change.get("sku")}</td>);
                break;
            case ChangeConstants.CHANGED_BY:
                return (<td key={columnId} className="nowrap">{change.changedByName()}</td>);
                break;
            case ChangeConstants.DETAILS:
                return (<td key={columnId}>{change.get("description")}</td>);
                break;
            case ChangeConstants.DATE:
                return (<td key={columnId} className="nowrap">{moment.unix(change.get("createdAt")).calendar()}</td>);
                break;
            default:
                return (<td key={columnId}></td>);
                break;
        }
    }
});

module.exports = HistoryItem;
