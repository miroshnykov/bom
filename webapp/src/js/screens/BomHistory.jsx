"use strict";

var _ = require("underscore");
var React = require("react");
var State = require("react-router").State;
var Link = require("react-router").Link;

var ButtonToolbar = require("react-bootstrap").ButtonToolbar;
var Glyphicon = require("react-bootstrap").Glyphicon;
var Button = require("react-bootstrap").Button;

var HistoryTable = require("components/HistoryTable.jsx");
var ChangeConstants = require("constants/ChangeConstants");
var Scroll = require("components/Scroll.jsx");
var Breadcrumbs = require("components/Breadcrumbs.jsx");

var BomHistory = React.createClass({
    mixins: [State],

    propTypes: {
        bom: React.PropTypes.object.isRequired
    },

    render: function() {
        var bom = this.props.bom;

        return (
            <Scroll className="bom-history">
                <div className="col-md-12">
                    <div className="btn-toolbar">
                        <Breadcrumbs>
                            <Link to="bom" params={this.getParams()}>{bom.get("name")}</Link>
                            History
                        </Breadcrumbs>
                        <HistoryTable collection={bom.getChanges()} columns={this.getColumns()} />
                    </div>
                </div>
            </Scroll>
        );
    },

    getColumns: function() {
        return [
            ChangeConstants.NUMBER,
            ChangeConstants.ITEM_SKU,
            ChangeConstants.CHANGED_BY,
            ChangeConstants.DETAILS,
            ChangeConstants.DATE,
        ];
    }
});

module.exports = BomHistory;
