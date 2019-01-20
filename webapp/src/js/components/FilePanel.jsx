"use strict";

var React = require("react");

var FileCollection = require("collections/FileCollection");
var FileList = require("components/FileList.jsx");
var FileActions = require("actions/FileActions");
var FileStore = require("stores/FileStore");

module.exports = React.createClass({

    propTypes: {
        model: React.PropTypes.object.isRequired
    },

    getInitialState: function() {
        return {
            collection: new FileCollection()
        };
    },

    componentWillMount: function() {
        this.load(this.props.model);
    },

    componentWillReceiveProps: function(nextProps) {
        if (this.props.model === nextProps.model) { return; }
        this.unload(this.props.model);
        this.load(nextProps.model);
    },

    componentWillUnmount: function() {
        this.unload(this.props.model);
    },

    load: function(model) {
        FileActions.load({model: model}).then(function(collection) {
            this.setState({
                collection: collection
            });
        }.bind(this));
    },

    unload: function(model) {
        FileActions.unload({model: model});
    },

    render: function() {
        return (
            <div className="file-panel panel panel-default">
                <div className="panel-heading">
                    <div>
                        <div className="btn-toolbar btn-toolbar-right pull-right">
                            <button
                                className="btn btn-nobg btn-default"
                                onClick={this.onAdd}>
                                <span className="fa fa-plus" aria-hidden="true"/>
                            </button>
                        </div>
                        <span className="h5 text-uppercase">
                            Files
                        </span>
                    </div>
                </div>
                <div className="panel-body no-padding">
                    <FileList ref="list" collection={this.props.files} />
                </div>
            </div>
        );
    },

    onAdd: function(event) {
        this.refs.list.onAdd();
    }
});
