"use strict";

var _ = require("underscore");
var React = require("react");
var Link = require("react-router").Link;
var Button = require("react-bootstrap").Button;
var ButtonToolbar = require("react-bootstrap").ButtonToolbar;
var Glyphicon = require("react-bootstrap").Glyphicon;
var Navigation = require("react-router").Navigation;
var backboneMixin = require("backbone-react-component");

var BomList = require("components/BomList.jsx");
var TextInput = require("components/TextInput.jsx");
var BomStore = require("stores/BomStore");

var cx = require("react/lib/cx");

var ProductSublist = React.createClass({
    mixins: [Navigation, backboneMixin],

    propTypes: {
        active: React.PropTypes.bool,
        currentProductId: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number
        ]),
        currentBomId: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number
        ])
    },

    render: function() {
        var product = this.getModel();
        var currentBomId = this.props.currentBomId;
        var currentProductId = this.props.currentProductId;
        var childBoms;

        childBoms = product.get("bomIds").map(function(result) {
            return BomStore.collection.get(result);
        });

        childBoms = _.filter(childBoms, function(bom) {
            return !!bom;
        });

        childBoms = _.sortBy(childBoms, function(bom) {
            return bom.get("name").toLowerCase();
        });

        childBoms = childBoms.map(function(result) {
            // TODO null check because of out of sync client ids
            if (!result) { return null; }

            return (<BomList
                key={result.id || result.cid}
                model={result}
                active={currentBomId && (+currentBomId === result.id) || (currentBomId === result.cid)}
                currentBomId={currentBomId}
                productId={product.id || product.cid} />);
        });

        return (
            <li
                className={cx({
                product: true,
                active: this.props.active && !this.props.currentBomId })} >
                <div>
                    <Link to="product" params={{productId: product.id || product.cid}}>{product.get("name")}</Link>
                </div>
                {childBoms}
            </li>
        );
    }
});

module.exports = ProductSublist;
