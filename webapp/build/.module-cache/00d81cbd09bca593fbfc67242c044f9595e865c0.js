"use strict";

var React = require("react");
var Link = require("react-router").Link;
var Button = require("react-bootstrap").Button;
var ButtonToolbar = require("react-bootstrap").ButtonToolbar;
var Glyphicon = require("react-bootstrap").Glyphicon;
var Navigation = require("react-router").Navigation;

var BomActions = require("../actions/BomActions");
var ProductActions = require("../actions/ProductActions");
var BomList = require("../components/BomList.react");
var TextInput = require("../components/TextInput.react");

var cx = require("react/lib/cx");

var ProductSublist = React.createClass({displayName: "ProductSublist",
    mixins: [Navigation],

    propTypes: {
        product: React.PropTypes.object.isRequired,
        allBoms: React.PropTypes.object.isRequired,
        active: React.PropTypes.bool,
        currentBomId: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number
        ])
    },

    /**
    * @return {object}
    */
    render: function() {
        var product = this.props.product;
        var allBoms = this.props.allBoms;
        var currentBomId = this.props.currentBomId;
        var childBoms;

        childBoms = product.get("bomIds").map(function(result) {
            return allBoms.get(result);
        });

        childBoms = childBoms.map(function(result) {
            return (React.createElement(BomList, {
                key: result.id || result.cid, 
                bom: result, 
                allBoms: allBoms, 
                currentBomId: currentBomId, 
                productId: product.id || product.cid}));
        });

        return (
            React.createElement("li", {
                className: cx({
                active: this.props.active })}, 
                React.createElement("div", null, 
                    React.createElement("span", null, 
                        React.createElement(Link, {to: "product", params: {productId: product.id || product.cid}}, product.get("name"))
                    )
                ), 
                childBoms
            )
        );
    }
});

module.exports = ProductSublist;
