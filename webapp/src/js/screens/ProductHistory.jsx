"use strict";

var _ = require("underscore");
var React = require("react");
var Link = require("react-router").Link;
var Navigation = require("react-router").Navigation;

var HistoryTable = require("components/HistoryTable.jsx");
var ChangeConstants = require("constants/ChangeConstants");
var Scroll = require("components/Scroll.jsx");
var Breadcrumbs = require("components/Breadcrumbs.jsx");

var ProductHistory = React.createClass({
    mixins: [Navigation],

    propTypes: {
        product: React.PropTypes.object.isRequired
    },

    render: function() {
        var product = this.props.product;

        return (
            <Scroll className="bom-history">
                <div className="col-md-12">
                    <div className="btn-toolbar">
                        <Breadcrumbs>
                            <Link to="product" params={{productId: product.id || product.cid}}>{product.get("name")}</Link>
                            <span>History</span>
                        </Breadcrumbs>
                    </div>
                </div>
                <div className="col-md-12">
                    <HistoryTable collection={product.getChanges()} columns={this.getColumns()} />
                </div>
            </Scroll>
        );
    },

    getColumns: function() {
        return [
            ChangeConstants.NUMBER,
            ChangeConstants.BOM_NAME,
            ChangeConstants.ITEM_SKU,
            ChangeConstants.CHANGED_BY,
            ChangeConstants.DETAILS,
            ChangeConstants.DATE
        ];
    }
});

module.exports = ProductHistory;
