"use strict";

var React = require("react");


module.exports = React.createClass({
    propTypes: {
        allCount:     React.PropTypes.number.isRequired,
        changeCount:  React.PropTypes.number.isRequired,
        commentCount: React.PropTypes.number.isRequired,
        problemCount: React.PropTypes.number.isRequired
    },

    render: function() {
        return (
            <div className="activity-header">
                <span className="h5 text-uppercase">Activity</span>
                <div>
                    <button className="btn btn-sm btn-outline-primary">
                        All
                        <span className="badge">{this.props.allCount}</span>
                    </button>
                    <button className="btn btn-sm btn-outline-primary">
                        Comments
                        <span className="badge">{this.props.commentCount}</span>
                    </button>
                    <button className="btn btn-sm btn-outline-primary">
                        Changes
                        <span className="badge">{this.props.changeCount}</span>
                    </button>
                    <button className="btn btn-sm btn-outline-primary">
                        Problems
                        <span className="badge">{this.props.problemCount}</span>
                    </button>
                </div>
            </div>
        );
    },

});
