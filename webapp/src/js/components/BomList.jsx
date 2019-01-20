"use strict";

var _ = require("underscore");
var React = require("react");
var Link = require("react-router").Link;
var Button = require("react-bootstrap").Button;
var ButtonToolbar = require("react-bootstrap").ButtonToolbar;
var Glyphicon = require("react-bootstrap").Glyphicon;
var Navigation = require("react-router").Navigation;
var backboneMixin = require("backbone-react-component");

var BomItem = require("components/BomItem.jsx");
var TextInput = require("components/TextInput.jsx");
var BomStore = require("stores/BomStore");

var cx = require("react/lib/cx");

var BomList = React.createClass({
    mixins: [Navigation, backboneMixin],

    propTypes: {
        active: React.PropTypes.bool,
        productId: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number
        ]),
        currentBomId: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number
        ])
    },

    render: function() {
        var bom = this.getModel();
        var currentBomId = this.props.currentBomId;
        var childBoms;
        var childIds = bom.get("bomIds");

        if (childIds.length) {
            childBoms = BomStore.collection.filter(function(result) {
                return _.contains(childIds, result.id || result.cid);
            });

            childBoms = childBoms.map(function(result) {
                return (<BomList
                    key={result.id || result.cid}
                    model={result}
                    active={currentBomId && (+currentBomId === result.id) || (currentBomId === result.cid)} />);
            });
        }

        return (
            <ul>
                <li className={cx({
                        bom: true,
                        active: this.props.active
                    })}>
                    <div>
                        <span>
                            <Link to="bom" params={{ productId: this.props.productId, bomId: bom.id || bom.cid }}>{bom.get("name")}</Link>
                        </span>
                    </div>
                    {childBoms}
                </li>
            </ul>
        );
    }
});

module.exports = BomList;
