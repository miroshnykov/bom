"use strict";

var _ = require("underscore");
var backboneMixin = require("backbone-react-component");
var React = require("react");

module.exports = React.createClass({
    mixins: [backboneMixin],

    propTypes: {
        emptyText: React.PropTypes.string,
        item: React.PropTypes.func.isRequired,
        filter: React.PropTypes.func
    },

    render: function() {
        if(this.props.emptyText && !_.size(this.getList()))
        {
            return (<div className="text-center text-muted">{this.props.emptyText}</div>);
        }

        return (
            <ul className="list-group list-striped">
                {this.getList().map(this.createItem)}
            </ul>
        );
    },

    createItem: function(item, index) {
        return (<this.props.item key={item.id || item.cid} model={item} />);
    },

    getList: function() {
        if(!this.props.filter) {
            return this.getCollection();
        }

        return this.getCollection().filter(this.props.filter);
    }
});
