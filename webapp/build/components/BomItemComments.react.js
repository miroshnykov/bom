"use strict";

var React = require("react");
var Table = require("react-bootstrap").Table;
var Glyphicon = require("react-bootstrap").Glyphicon;
var Button = require("react-bootstrap").Button;
var ButtonToolbar = require("react-bootstrap").ButtonToolbar;

var FieldConstants = require("../constants/FieldConstants");
var CommentItem = require("../components/CommentItem.react");
var TextInput = require("../components/TextInput.react");
var ChangeConstants = require("../constants/ChangeConstants");
var BomActions = require("../actions/BomActions");

var BomItemComments = React.createClass({displayName: "BomItemComments",

    propTypes: {
        bom: React.PropTypes.object,
        item: React.PropTypes.object,
        active: React.PropTypes.bool
    },

    getInitialState: function() {
        return {
            isAdding: false
        };
    },

    componentDidMount: function() {
        this._addScroll();
        this._init();
    },

    componentDidUpdate: function(nextProps) {
        $(this.getDOMNode()).getNiceScroll().resize();

        // Trigger a fake mouse enter
        // This solve a bug that seem to fail to update the width
        // of the horizontal scrollbar when the left panel opens
        $(this.getDOMNode()).trigger("mouseenter");

        this._init();
    },

    componentWillUnmount: function() {
        this._removeScroll();
    },

    _addScroll: function() {
        $(this.getDOMNode()).niceScroll({
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
        $(this.getDOMNode()).getNiceScroll().remove();
    },

    _init: function() {
        var bom = this.props.bom;
        var item = this.props.item;
        var changes = this.props.changes;

        if (!bom || !item || !this.props.active || item.getComments().hasFetched() || item.getComments().isLoaded()) { return; }

        BomActions.fetchItemComments(bom.id, item.id, 10);
    },

    /**
    * @return {object}
    */
    render: function() {
        var bom = this.props.bom;
        var item = this.props.item;
        var newComment;
        var spinner;
        var more;

        if (!bom || !item) {
            return ( React.createElement("div", null) );
        }

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
                            onClick: this._onCancelNew}, 
                            React.createElement(Glyphicon, {glyph: "remove"})
                        )
                    )
                ));
        }
        else {
            newComment = (React.createElement("tr", null, 
                    React.createElement("td", {colSpan: "2", onClick: this._onAdd}, 
                        React.createElement(ButtonToolbar, {className: "pull-right btn-toolbar-right"}, 
                            React.createElement(Button, {
                                className: "btn-nobg", 
                                bsStyle: "default", 
                                bsSize: "small", 
                                onClick: this._onAdd}, 
                                React.createElement(Glyphicon, {glyph: "plus"})
                            )
                        )
                    )
                ));
        }

        if (item.getComments().isFetching()) {
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
        else if (!item.getComments().isLoaded()) {
            more = (
                React.createElement("tr", {key: "more"}, 
                    React.createElement("td", {colSpan: "2", className: "text-center"}, 
                        React.createElement(Button, {bsStyle: "link", onClick: this._loadPrevious}, "load previous")
                    )
                ));
        }

        return (
            React.createElement("div", {className: "row content scrollable"}, 
                React.createElement("div", {className: "wrapper col-md-12"}, 
                    React.createElement(Table, {className: "comment-table", striped: true, bordered: true, condensed: true, hover: true, fill: true}, 
                        React.createElement("tbody", null, 
                            newComment, 
                            item.getComments().map(function(comment, index) {
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
        );
    },

    _onAdd: function(event) {
        this.setState({
            isAdding: true,
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
        var bom = this.props.bom;
        var item = this.props.item;

        body = body || "";
        body = body.trim();

        if (body) {
            BomActions.createItemComment(bom.id || bom.cid, item.id || item.cid, body);
        }

        this.setState({
            isAdding: false,
        });
    },

    _onSaveEdit: function(commentId, body) {
        var bom = this.props.bom;
        var item = this.props.item;

        BomActions.updateItemComment(bom.id || bom.cid, item.id || item.cid, commentId, body);
    },

    _onRemove: function(commentId) {
        var bom = this.props.bom;
        var item = this.props.item;

        BomActions.destroyItemComment(bom.id || bom.cid, item.id || item.cid, commentId);
    },

    _loadPrevious: function() {
        var bom = this.props.bom;
        var item = this.props.item;

        BomActions.fetchItemComments(bom.id || bom.cid, item.id || item.cid, 10);
    }
});

module.exports = BomItemComments;
