"use strict";

var _ = require("underscore");
var React = require("react");
var FieldConstants = require("constants/FieldConstants");
var numberFormat = require("underscore.string/numberFormat");
var backboneMixin = require("backbone-react-component");

var BomItemUsage = React.createClass({
    mixins: [backboneMixin],

    propTypes: {
        bom: React.PropTypes.object,
        item: React.PropTypes.object
    },

    render: function() {
        var bom = this.props.bom;
        var item = this.props.item;
        var cpb;

        var qtyValue = bom.getItemValueContentForField(item.id || item.cid, FieldConstants.QUANTITY);
        var priceValue = bom.getItemValueContentForField(item.id || item.cid, FieldConstants.PRICE);
        var desigValue = bom.getItemValueContentForField(item.id || item.cid, FieldConstants.DESIGNATORS);

        var qty = parseInt(qtyValue);
        var price = /^[-+]?[^0-9,\.]*((?:[0-9]{1,3}[,\s](?:[0-9]{3}[,\s])*[0-9]{3}|[0-9]+)(?:[\.,][0-9]+)?)[^0-9,\.]*$/.exec(priceValue);
        price = price ? parseFloat(price[1]) : NaN;

        if (qtyValue !== undefined && !_.isNaN(qty) &&
            priceValue !== undefined && !_.isNaN(price)) {
            cpb = numberFormat(price * qty, 2);
        }

        if (priceValue !== undefined && !_.isNaN(price)) {
            price = numberFormat(price, 2);
        }

        return (
            <div className="row">
                <div className="col-md-5">
                    <table className="table table-condensed">
                        <tbody>
                            <tr>
                                <td>Quantity per board</td>
                                <td>{qtyValue}</td>
                            </tr>
                            <tr>
                                <td>Designators</td>
                                <td>{desigValue}</td>
                            </tr>
                            <tr>
                                <td>Cost per piece</td>
                                <td>{!_.isNaN(price) ? price : undefined}</td>
                            </tr>
                            <tr>
                                <td>Cost per board</td>
                                <td>{cpb}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

});

module.exports = BomItemUsage;
