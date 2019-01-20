"use strict";

var _                = require("underscore");
var ActivityListItem = require("components/ActivityListItem.jsx");
var backboneMixin    = require("backbone-react-component");
var React            = require("react");

module.exports = React.createClass({
    propTypes: {
        collection: React.PropTypes.array.isRequired
    },

    componentWillMount: function() {

    },

    componentWillUnmount: function() {

    },

    render: function() {
        return (
            <div>
                {_.map(this.props.collection, function(item, index) {
                    return (<ActivityListItem item={item} key={index}/>);
                })}
            </div>
        );
    },

});
