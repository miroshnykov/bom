"use strict";

var React = require("react");
var Navigation = require("react-router").Navigation;
var Button = require("react-bootstrap").Button;
var ButtonToolbar = require("react-bootstrap").ButtonToolbar;
var Glyphicon = require("react-bootstrap").Glyphicon;
var Panel = require("react-bootstrap").Panel;
var Table = require("react-bootstrap").Table;

var BomUtils = require("../utils/BomUtils");
var TextInput = require("../components/TextInput.react");
var ProductActions = require("../actions/ProductActions");
var CommentItem = require("../components/CommentItem.react");

var CommentPanel = React.createClass({displayName: "CommentPanel",
    mixins: [Navigation],

    propTypes: {
        product: React.PropTypes.object.isRequired,
        expanded: React.PropTypes.bool
    },

    getInitialState: function() {
        return {
            isAdding: false,
            isExpanded: this.props.expanded
        };
    },

    componentDidMount: function() {
        this._init();
        this._addScroll();
    },

    componentWillUnmount: function() {
        this._removeScroll();
    },

    componentDidUpdate: function(prevProps, prevState) {
        this._init();
    },

    _init: function() {
        if (!this.state.isExpanded ||
            this.props.product.getComments().hasFetched() ||
            this.props.product.getComments().isLoaded()) {
            return;
        }

        ProductActions.fetchComments(this.props.product.id, 10);
    },

    _addScroll: function() {
        $(this.getDOMNode()).find("div.scrollable").niceScroll({
            cursoropacitymax: 0.25,
            cursorwidth: "10px",
            railpadding: {
                top: 5,
                right: 1,
                left: 1,
                bottom: 5
            }
        });
    },

    _removeScroll: function() {
        var niceScroll = this._getScroll();
        if (niceScroll) {
            niceScroll.remove();
        }
    },

    _getScroll: function() {
        return $(this.getDOMNode()).find("div.scrollable").getNiceScroll();
    },

    /**
     * @return {object}
     */
    render: function() {
        var product = this.props.product;
        var header;
        var allComments = this.props.product.getComments();
        var newComment;
        var spinner;
        var more;

        header = (
            React.createElement("div", {onClick: this._onToggle}, 
                React.createElement(ButtonToolbar, {className: "pull-left"}, 
                    React.createElement(Glyphicon, {glyph: this.state.isExpanded ? "triangle-bottom" : "triangle-right"})
                ), 
                React.createElement(ButtonToolbar, {className: "pull-right btn-toolbar-right"}, 
                    React.createElement(Button, {
                        className: "btn-nobg", 
                        bsStyle: "default", 
                        bsSize: "small", 
                        onClick: this._onAdd}, 
                        React.createElement(Glyphicon, {glyph: "plus"})
                    )
                ), 
                React.createElement("h2", null, "Comments")
            ));

        // Create the new BoM item if + was clicked
        if (this.state.isAdding) {
            newComment = (React.createElement("tr", null, 
                    React.createElement("td", null, 
                        React.createElement(TextInput, {
                            type: "textarea", 
                            className: "edit", 
                            onSave: this._onSaveNew, 
                            onCancel: this._onCancelNew, 
                            value: "", 
                            placeholder: "Enter your comment"})
                    ), 
                    React.createElement("td", {className: "compact"}, 
                        React.createElement(Button, {
                            className: "btn-nobg", 
                            bsStyle: "danger", 
                            bsSize: "small", 
                            onClick: this._onCancelMew}, 
                            React.createElement(Glyphicon, {glyph: "remove"})
                        )
                    )
                ));
        }

        if (allComments.isFetching()) {
            spinner = (
                React.createElement("tr", {key: "spinner"}, 
                    React.createElement("td", {colSpan: "2", className: "text-center"}, 
                        React.createElement(Glyphicon, {
                            className: "glyphicon-spin", 
                            bsSize: "small", 
                            bsStyle: "default", 
                            glyph: "repeat"})
                    )
                ));
        }
        else if (!allComments.isLoaded()) {
            more = (
                React.createElement("tr", {key: "more"}, 
                    React.createElement("td", {colSpan: "2", className: "text-center"}, 
                        React.createElement(Button, {bsStyle: "link", onClick: this._loadPrevious}, "load previous")
                    )
                ));
        }

        return (
            React.createElement(Panel, {className: "comment-panel", ref: "panel", header: header, expanded: this.state.isExpanded, collapsable: true}, 
                React.createElement("div", {className: "scrollable"}, 
                    React.createElement("div", {className: "wrapper"}, 
                        React.createElement(Table, {className: "comment-table", striped: true, bordered: true, condensed: true, hover: true, fill: true}, 
                            React.createElement("tbody", null, 
                                newComment, 
                                allComments.map(function(comment, index) {
                                    return (React.createElement(CommentItem, {
                                        key: comment.id || comment.cid, 
                                        comment: comment, 
                                        onSave: this._onSaveEdit, 
                                        onRemove: this._onRemove}));
                                }, this), 
                                spinner, 
                                more
                            )
                        )
                    )
                )
            )
        );
    },

    _onToggle: function(event) {
        this.setState({ isExpanded: !this.state.isExpanded });
    },

    _onAdd: function(event) {
        this.setState({
            isAdding: true,
            isExpanded: true
        });

        event.stopPropagation();
        event.preventDefault();
    },

    _onCancelNew: function(event) {
        this.setState({
            isAdding: false,
        });
    },

    _onSaveNew: function(body) {
        body = body || "";
        body = body.trim();

        if (body) {
            ProductActions.createComment(this.props.product.id || this.props.product.cid, body);
        }

        this.setState({
            isAdding: false,
        });
    },

    _onSaveEdit: function(commentId, body) {
        var product = this.props.product;
        ProductActions.updateComment(product.id || product.cid, commentId, body);
    },

    _onRemove: function(commentId) {
        var product = this.props.product;
        ProductActions.destroyComment(product.id || product.cid, commentId);
    },

    _loadPrevious: function() {
        ProductActions.fetchComments(this.props.product.id, 10);
    }
});

module.exports = CommentPanel;
