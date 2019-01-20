"use strict";

var _             = require("underscore");
var BomActions    = require("actions/BomActions");
var EditableLabel = require("components/EditableLabel.jsx");
var Panel         = require("components/Panel.jsx");
var React         = require("react");

require("underscore.inflection");

module.exports = React.createClass({
    propTypes: {
        bom: React.PropTypes.object.isRequired,
    },

    componentDidMount: function() {
        this.props.bom.on("change:description", this.onChange);
    },

    componentWillUnmount: function() {
        this.props.bom.off("change:description", this.onChange);
    },

    renderItem: function(name, content) {
        return (
            <div className="row">
                <div className="col-xs-4 text-right">
                    {name}
                </div>
                <div className="col-xs-8">
                    {content}
                </div>
            </div>
        );
    },

    render: function() {
        var bom = this.props.bom;
        var description = (
            <EditableLabel
                inline={true}
                value={bom.get("description")}
                onSave={this.onSaveDescription} />
        );

        var warningCount  = bom.get("warningCount")  || 0;
        var errorCount    = bom.get("errorCount")    || 0;
        var approvedCount = bom.get("approvedCount") || 0;
        var totalItems    = bom.totalItems           || 0;

        return (
            <Panel title="Overview">
                {this.renderItem("Description", description)}
                {this.renderItem("# of Parts", totalItems + _.pluralize(" Part", totalItems))}
                {this.renderItem("# of Alerts",
                   errorCount + _.pluralize(" Error", errorCount) + " & " +
                   warningCount + _.pluralize(" Warning", warningCount))}
                {this.renderItem("$ per unit", "18.95 USD")}
                {this.renderItem("Status", approvedCount + "/" + totalItems + _.pluralize(" item", totalItems) +" approved")}
            </Panel>
        );
    },

    onChange: function() {
        this.forceUpdate();
    },

    onSaveDescription: function(description) {
        BomActions.update({bomId: this.props.bom.id, update: {description: description}});
    }

});
