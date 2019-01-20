"use strict";

var CommentTable = require("components/CommentTable.jsx");
var React = require("react");
var Scroll = require("components/Scroll.jsx");

var CommentPanel = React.createClass({
    propTypes: {
        comments: React.PropTypes.object.isRequired
    },

    render: function() {
        return (
            <div className="panel panel-default comment-panel">
                <div className="panel-heading">
                    <div>
                        <span className="h5 text-uppercase">Comments</span>
                    </div>
                </div>
                <div className="panel-body no-padding">
                    <Scroll>
                        <CommentTable collection={this.props.comments} />
                    </Scroll>
                </div>
            </div>
        );
    }
});

module.exports = CommentPanel;
