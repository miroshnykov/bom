"use strict";

var React = require("react");
var Navigation = require("react-router").Navigation;
var Button = require("react-bootstrap").Button;
var ButtonToolbar = require("react-bootstrap").ButtonToolbar;
var Glyphicon = require("react-bootstrap").Glyphicon;
var Link = require("react-router").Link;
var moment = require("moment");
var _string = require("underscore.string");

var ProductActions = require("../actions/ProductActions");
var TextInput = require("../components/TextInput.react");

var CommentItem = React.createClass({displayName: "CommentItem",
    mixins: [Navigation],

    propTypes: {
        comment: React.PropTypes.object.isRequired,
        // product: React.PropTypes.object.isRequired,
        onSave: React.PropTypes.func.isRequired,
        onRemove: React.PropTypes.func.isRequired
    },

    getInitialState: function() {
        return {
            isEditing: false
        };
    },

    /**
     * @return {object}
     */
    render: function() {
        var comment = this.props.comment;
        var createdAtElement = comment.has("createdAt") ? (React.createElement("span", null, React.createElement("small", null, "— ", moment.unix(comment.get("createdAt")).calendar()))) : undefined;
        var bodyElement;

        if (this.state.isEditing) {
            bodyElement = (React.createElement(TextInput, {
                type: "textarea", 
                className: "edit", 
                onSave: this._onSave, 
                onCancel: this._onCancel, 
                value: comment.get("body")})
            );
        }
        else {
            bodyElement = (React.createElement("p", null, 
                _string(comment.get("body")).lines().map(function(line, index){
                    return (React.createElement("span", {key: index}, line, React.createElement("br", null)));
                })
            ));
        }

        return (React.createElement("tr", null, 
                React.createElement("td", null, 
                    bodyElement, 
                    createdAtElement
                ), 
                React.createElement("td", {className: "actions"}, 
                    React.createElement(Button, {
                        className: "btn-nobg", 
                        bsStyle: "default", 
                        bsSize: "small", 
                        onClick: this._onEdit}, 
                        React.createElement(Glyphicon, {
                            bsSize: "small", 
                            glyph: "pencil"})
                    ), 
                    React.createElement(Button, {
                        className: "btn-nobg", 
                        bsStyle: "danger", 
                        bsSize: "small", 
                        onClick: this._onRemove}, 
                        React.createElement(Glyphicon, {
                            bsSize: "small", 
                            glyph: "remove"})
                    )
                )
            ))
    },

    _onEdit: function(event) {
        this.setState({
            isEditing: true
        });
    },

    _onSave: function(body) {
        body = body || "";
        body = body.trim();

        if (body && this.props.comment.get("body") !== body) {
            this.props.onSave(this.props.comment.id, body);
        }

        this.setState({
            isEditing: false
        });
    },

    _onCancel: function(body) {
        this.setState({
            isEditing: false
        });
    },

    _onRemove: function() {
        var comment = this.props.comment;
        var product = this.props.product;

        if (confirm("Are you sure you want to permanently delete this comment?")) {
            this.props.onRemove(comment.id || comment.cid);
        }
    }
});

module.exports = CommentItem;
