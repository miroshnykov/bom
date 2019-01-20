"use strict";

var React = require("react");
var Link = require("react-router").Link;
var State = require("react-router").State;

var Table = require("react-bootstrap").Table;
var Button = require("react-bootstrap").Button;
var backboneMixin = require("backbone-react-component");

var Spinner = require("components/Spinner.jsx");
var CommentItem = require("components/CommentItem.jsx");
var ChangeConstants = require("constants/ChangeConstants");
var TextInput = require("components/TextInput.jsx");
var Scroll = require("components/Scroll.jsx");

var CommentTable = React.createClass({
    mixins: [backboneMixin],

    propTypes: {
        alerts: React.PropTypes.bool,
        embedded: React.PropTypes.bool
    },


    getInitialState: function() {
        return {
            isLoaded: false,
            isLoading: false,
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

        this.setState({
            isLoading: true
        });

        var oldCount = collection.length;
        var options = {
            data: {
                count: this.state.pageCount+1,
                before: collection.length ? collection.last().get("createdAt") : undefined
            },
            remove: false
        };

        if(this.props.alerts) {
            options.data.category = "alert";
        }

        collection.fetch(options).then(function(updated) {
            if(updated.length < (oldCount + this.state.pageCount+1)) {
                this.setState({
                    isLoaded: true,
                    isLoading: false
                });
            } else {
                // Limit to 10 results. The extra one is only there to allow or not the more
                collection.pop();

                this.setState({
                    isLoading: false
                });
            }
        }.bind(this), function(error) {
            this.setState({
                isLoading: false
            });
        }.bind(this));
    },

    render: function() {
        var comments = this.getCollection();
        var newComment = comments.getNewComment();
        var more;

        if (this.state.isLoading) {
            more = (
                <tr>
                    <td colSpan={this.props.alerts ? 3 : 2} className="text-center">
                        <Spinner className="spinner-dark" />
                    </td>
                </tr>);
        }
        else if (!this.state.isLoaded) {
            more = (
                <tr>
                    <td colSpan={this.props.alerts ? 3 : 2} className="text-center">
                        <button className="btn btn-link" onClick={function(event) { this.fetch(); }.bind(this)}>load more</button>
                    </td>
                </tr>);
        }

        return (
            <table className="comment-table table table-striped table-bordered table-condensed table-hover table-fill">
                <tbody>
                    <CommentItem
                        model={newComment}
                        isEditing={true}
                        alert={this.props.alerts}
                        embedded={this.props.embedded}
                        readonly={newComment && newComment.isStateSending()} />

                    {comments.map(function(comment, index) {
                        return (<CommentItem
                            key={comment.id || comment.cid}
                            embedded={this.props.embedded}
                            alert={this.props.alerts}
                            model={comment} />);
                    }, this)}
                    {more}
                </tbody>
            </table>
        );
    }
});

module.exports = CommentTable;
