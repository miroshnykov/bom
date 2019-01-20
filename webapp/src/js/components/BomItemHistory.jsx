"use strict";

var _ = require("underscore");
var React = require("react");

var HistoryTable = require("components/HistoryTable.jsx");
var ChangeConstants = require("constants/ChangeConstants");
var Scroll = require("components/Scroll.jsx");

var BomItemHistory = React.createClass({

    propTypes: {
        item: React.PropTypes.object.isRequired
    },

    render: function() {
        return (
            <Scroll>
                <div className="wrapper col-md-12">
                    <HistoryTable collection={this.props.item.getChanges()} columns={this.getColumns()} />
                </div>
            </Scroll>
        );
    },

    getColumns: function() {
        return [
            ChangeConstants.NUMBER,
            ChangeConstants.CHANGED_BY,
            ChangeConstants.DETAILS,
            ChangeConstants.DATE
        ];
    }
});

module.exports = BomItemHistory;
