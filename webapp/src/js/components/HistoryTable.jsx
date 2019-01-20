"use strict";

var _ = require("underscore");
var React = require("react");
var backboneMixin = require("backbone-react-component");

var ChangeConstants = require("constants/ChangeConstants");
var HistoryItem = require("components/HistoryItem.jsx");
var Spinner = require("components/Spinner.jsx");

var HistoryTable = React.createClass({
    mixins: [backboneMixin],

    propTypes: {
        columns: React.PropTypes.array,
        limit: React.PropTypes.number
    },

    getInitialState: function() {
        return {
            isLoaded: false,
            pageCount: 10
        };
    },

    componentDidMount: function() {
        this.init();
    },

    componentWillReceiveProps: function(nextProps) {
        if (this.props.collection === nextProps.collection) { return; }
        this.init(nextProps.collection);
    },

    init: function(collection) {
        collection = collection || this.getCollection();
        if (!collection.isEmpty()) { return; }
        this.fetch(collection);
    },

    fetch: function(collection) {
        collection = collection || this.getCollection();

        var oldCount = collection.length;
        collection.fetch({
            data: {
                count: this.state.pageCount+1,
                before: collection.length ? collection.last().get("number") : undefined
            },
            remove: false
        }).then(function(updated) {
            if(updated.length < (oldCount + this.state.pageCount+1)) {
                this.setState({
                    isLoaded: true
                });
            } else {
                // Limit to 10 results. The extra one is only there to allow or not the more
                collection.pop();
            }
        }.bind(this));
    },

    render: function() {
        var more;
        var changes = this.getCollection();

        if (changes.isStateSending()) {
            more = (
                <tr>
                    <td colSpan={this.props.columns.length} className="text-center">
                        <Spinner className="spinner-dark" />
                    </td>
                </tr>);
        }
        else if (!this.state.isLoaded && (!this.props.limit || changes.length < this.props.limit)) {
            more = (
                <tr>
                    <td colSpan={this.props.columns.length} className="text-center">
                        <button className="btn btn-link" onClick={function(event) { this.fetch(); }.bind(this)}>load more</button>
                    </td>
                </tr>);
        }

        changes = changes.map(function(change) {
            return (
                <HistoryItem
                    key={change.id}
                    change={change}
                    columns={this.props.columns} />);
        }, this);

        changes = this.props.limit ? _.first(changes, this.props.limit) : changes;

        return (
            <table className="table table-striped table-condensed table-hover">
                <thead>
                    <tr>
                        {this.props.columns.map(function(columnId) {
                            return this.getHeader(columnId);
                        }, this)}
                    </tr>
                </thead>
                <tbody>
                    {changes}
                    {more}
                </tbody>
            </table>);
    },

    getHeader: function(columnId) {
        switch(columnId) {
            case ChangeConstants.NUMBER:
                return (<th className="compact text-center" key={columnId}>#</th>);
                break;
            case ChangeConstants.BOM_ID:
                return (<th className="compact" key={columnId}>BoM ID</th>);
                break;
            case ChangeConstants.BOM_NAME:
                return (<th className="compact" key={columnId}>BoM Name</th>);
                break;
            case ChangeConstants.ITEM_ID:
                return (<th className="compact" key={columnId}>Item ID</th>);
                break;
            case ChangeConstants.ITEM_SKU:
                return (<th className="compact" key={columnId}>Item SKU</th>);
                break;
            case ChangeConstants.CHANGED_BY:
                return (<th className="compact" key={columnId}>Changed By</th>);
                break;
            case ChangeConstants.DETAILS:
                return (<th key={columnId}>Details</th>);
                break;
            case ChangeConstants.DATE:
                return (<th className="compact" key={columnId}>Date</th>);
                break;
            case ChangeConstants.STATUS:
                return (<th className="compact" key={columnId}>Saved</th>);
                break;
        }
    }
});

module.exports = HistoryTable;
