"use strict";

var React = require("react");
var Navigation = require("react-router").Navigation;
var Button = require("react-bootstrap").Button;
var ButtonToolbar = require("react-bootstrap").ButtonToolbar;
var Glyphicon = require("react-bootstrap").Glyphicon;
var Link = require("react-router").Link;
var backboneMixin = require("backbone-react-component");

var BomActions = require("actions/BomActions");

var AppDispatcher = require("dispatcher/AppDispatcher");
var Modal = require("components/modals/Modal.jsx");

var BomItemPanelEdit = React.createClass({
    mixins: [Navigation, backboneMixin],

    propTypes: {
        name: React.PropTypes.string,
        itemCount: React.PropTypes.number.isRequired,
        bomId: React.PropTypes.number.isRequired,
        productId: React.PropTypes.number.isRequired,
        onDelete: React.PropTypes.func.isRequired
    },

    render: function() {
        var itemCount = this.props.itemCount || 0;

        return (
            <tr>
                <td>
                    <div>
                        <Link to="bom" params={{ productId: this.props.productId, bomId: this.props.bomId }}>
                            {this.props.name}
                        </Link>
                    </div>
                </td>
                <td className="compact">
                    {itemCount}&nbsp;item{itemCount>1?"s":""}
                </td>
                <td className="compact">
                    <Button
                        className="btn-nobg"
                        bsStyle="danger"
                        bsSize="small"
                        onClick={this.props.onDelete} >
                        <span className="fa fa-remove"></span>
                    </Button>
                </td>
            </tr>
        );
    }
});

module.exports = BomItemPanelEdit;
