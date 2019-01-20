"use strict";

var _ = require("underscore");
var React = require("react");

var ActivityActions    = require("actions/ActivityActions");
var ActivityCollection = require("collections/ActivityCollection");
var ActivityHeader     = require("components/ActivityHeader.jsx");
var ActivityList       = require("components/ActivityList.jsx");
var ActivityStore      = require("stores/ActivityStore");
var Panel              = require("components/Panel.jsx");

module.exports = React.createClass({
    propTypes: {
        model: React.PropTypes.object.isRequired
    },

    getInitialState: function() {
        return {
            collection: new ActivityCollection(),
            comments: [],
            changes:  [],
            problems: []
        }
    },

    componentWillMount: function() {
        ActivityActions.load({model: this.props.model}).then(this.onLoad);
    },

    componentWillUnmount: function() {
        if(this.state.collection.off) {
            this.state.collection.off("add", this.update);
            this.state.collection.off("remove", this.update);
        }

        ActivityActions.unload({model: this.props.model});
    },

    render: function() {
        return (
            <Panel header={
                <ActivityHeader
                    allCount={this.state.collection.length}
                    commentCount={this.state.comments.length}
                    changeCount={this.state.changes.length}
                    problemCount={this.state.problems.length} />} >
                <ActivityList collection={this.state.collection.models} />
            </Panel>
        );
    },

    update: function(attrs) {
        var groups = attrs.collection.groupBy(function(item) {
            switch(item.get("type")) {
                case "bomComment":
                case "itemComment":
                case "productComment":
                    return "comments";

                case "bomError":
                case "itemError":
                    return "problems";

                default:
                    return "changes";
            }
        }, {comments: [], problems: [], changes: []});

        this.setState(_.extend(groups, {collection: attrs.collection}));
    },

    onLoad: function(collection) {
        collection.on("add", this.update);
        collection.on("remove", this.update);

        this.update({collection: collection});
    }
});
