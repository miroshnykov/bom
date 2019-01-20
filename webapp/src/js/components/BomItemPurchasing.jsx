"use strict";

var React = require("react");
var backboneMixin = require("backbone-react-component");

var FieldConstants = require("constants/FieldConstants");

var BomItemPurchasing = React.createClass({
    mixins: [backboneMixin],

    propTypes: {
        bom: React.PropTypes.object,
        item: React.PropTypes.object
    },

    render: function() {
        var bom = this.props.bom;
        var item = this.props.item;
        var mfgField;
        var mpnField;
        var supField;
        var spnField;
        var priceField;
        var leadTimeField;
        var moqField;
        var mfgs;
        var suppliers;

        //get manufacturer fields and matching part numbers
        mfgs = [];
        mfgField = bom.getItemValueContentForField(item.id || item.cid, FieldConstants.MFG);
        mpnField = bom.getItemValueContentForField(item.id || item.cid, FieldConstants.MPN);

        if (mfgField || mpnField) {
            mfgs.push({
                "key": 1,
                "mfg": mfgField,
                "mpn": mpnField
            });
        }

        //TODO add others fields that contain something like "mfg" or "manufacturer" in their name
        // instead of above
        // get list of BomFields with name that match the pattern

        //get supplier fields and matching part numbers, price, lead time, moq
        suppliers = [];
        supField = bom.getItemValueContentForField(item.id || item.cid, FieldConstants.SUPPLIER);
        spnField = bom.getItemValueContentForField(item.id || item.cid, FieldConstants.SPN);
        priceField = bom.getItemValueContentForField(item.id || item.cid, FieldConstants.PRICE);
        leadTimeField = bom.getItemValueContentForField(item.id || item.cid, FieldConstants.LEAD_TIME);
        moqField = bom.getItemValueContentForField(item.id || item.cid, FieldConstants.MOQ);

        if (supField || spnField || priceField || leadTimeField || moqField) {
            suppliers.push({
                "key": 1,
                "supplier": supField,
                "spn": spnField,
                "price": priceField,
                "leadtime": leadTimeField,
                "moq": moqField
            });
        }

        //TODO add others fields that contain something like "supplier" in the name

        return (
            <div className="row">
                <div className="col-md-5">
                    <table className="table table-condensed">
                        <thead>
                            <tr>
                                <th>Manufacturer</th>
                                <th>MFG Part Number</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mfgs.map(function(result) {
                                return (
                                    <tr key={result.key}>
                                        <td>{result.mfg}</td>
                                        <td>{result.mpn}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="col-md-7">
                    <table className="table table-condensed">
                        <thead>
                            <tr>
                                <th>Supplier</th>
                                <th>Supplier PN</th>
                                <th>Price</th>
                                <th>Lead Time</th>
                                <th>MOQ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {suppliers.map(function(result) {
                                return (
                                    <tr key={result.key}>
                                        <td>{result.supplier}</td>
                                        <td>{result.spn}</td>
                                        <td>{result.price}</td>
                                        <td>{result.leadtime}</td>
                                        <td>{result.moq}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

});

module.exports = BomItemPurchasing;
