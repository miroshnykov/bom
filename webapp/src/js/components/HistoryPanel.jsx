"use strict";

var _ = require("underscore");
var React = require("react");
var Link = require("react-router").Link;
var Navigation = require("react-router").Navigation;
var ButtonToolbar = require("react-bootstrap").ButtonToolbar;
var Button = require("react-bootstrap").Button;

var HistoryTable = require("components/HistoryTable.jsx");
var ChangeConstants = require("constants/ChangeConstants");

var HistoryPanel = React.createClass({
    mixins: [Navigation],

    propTypes: {
        product: React.PropTypes.object.isRequired
    },

    render: function() {
        return (
            <div className="history-panel panel panel-default">
                <div className="panel-heading">
                    <div>
                        <ButtonToolbar className="pull-right btn-toolbar-right">
                            <Button
                                className="btn-nobg"
                                bsStyle="default"
                                onClick={this.onViewAll}>
                                <span className="fa fa-list" aria-hidden="true"/>
                            </Button>
                        </ButtonToolbar>
                        <span className="h5 text-uppercase">
                            Recent History
                        </span>
                    </div>
                </div>
                <div className="panel-body no-padding">
                    <HistoryTable collection={this.props.product.getChanges()} columns={this.getColumns()} limit={10} />
                </div>
            </div>
        );
    },

    onViewAll: function() {
        this.transitionTo("productHistory", {productId: this.props.product.id || this.props.product.cid});
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

module.exports = HistoryPanel;
