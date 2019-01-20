"use strict";

var React = require("react");
var backboneMixin = require("backbone-react-component");

var Scroll = require("components/Scroll.jsx");
var FieldConstants = require("constants/FieldConstants");
var FieldStore = require("stores/FieldStore");

var BomItemDetails = React.createClass({
    mixins: [backboneMixin],

    propTypes: {
        item: React.PropTypes.object,
        bom: React.PropTypes.object
    },

    render: function() {
        var bom = this.props.bom;
        var item = this.props.item;
        var attributes;
        var element;

        var fieldIds = [
            FieldConstants.TYPE,
            FieldConstants.VALUE,
            FieldConstants.VOLT,
            FieldConstants.TOLERANCE,
            FieldConstants.TEMP_COEFF,
            FieldConstants.PACKAGE];

        var id = bom.getItemValueForField(item.id || item.cid, FieldConstants.ID);
        var sku = bom.getItemValueForField(item.id || item.cid, FieldConstants.SKU);
        var description = bom.getItemValueForField(item.id || item.cid, FieldConstants.DESCRIPTION);

        return (
            <div className="full-height">
                <Scroll>
                    <h1>Component {sku ? sku.get("content") : (id ? id.get("content") : undefined)}</h1>
                    <p><strong>{description ? description.get("content") : undefined}</strong></p>
                    <table className="table table-condensed">
                        <tbody>
                            {fieldIds.map(function(result) {
                                var value = bom.getItemValueContentForField(item.id || item.cid, result);
                                return (
                                    <tr key={result}>
                                        <td>{FieldStore.get(result).get("name")}</td>
                                        <td>{value}</td>
                                    </tr>);
                            }, this)}
                        </tbody>
                    </table>
                </Scroll>
            </div>
        );
    }
});

module.exports = BomItemDetails;
