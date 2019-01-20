"use strict";

var backboneMixin = require("backbone-react-component");
var React         = require("react");

var ActivityStream = require("components/ActivityStream.jsx");
var EditableLabel  = require("components/EditableLabel.jsx");
var SplitView      = require("components/SplitView.jsx");

module.exports = React.createClass({
    mixins: [backboneMixin],

    render: function() {
        return (
            <div className="col-xs-12">
                <div className="row">
                    <div className="col-xs-12">
                        <EditableLabel
                            className="h4"
                            value={this.getModel().get("name")}
                            onSave={this.onTitleSave} />
                    </div>
                </div>
                <SplitView
                    left={this.props.children}
                    right={(<ActivityStream model={this.getModel()} />)} />
            </div>
        );
    },

    onTitleSave: function(title) {
        this.getModel().save({name: title}, {patch: true});
    }
});
