var React = require("react");
var Navigation = require("react-router").Navigation;
var Button = require("react-bootstrap").Button;
var ButtonToolbar = require("react-bootstrap").ButtonToolbar;
var Glyphicon = require("react-bootstrap").Glyphicon;
var Panel = require("react-bootstrap").Panel;
var Table = require("react-bootstrap").Table;

var BomUtils = require("../utils/BomUtils");
var TextInput = require("../components/TextInput.react");

var CommentPanel = React.createClass({displayName: "CommentPanel",
    mixins: [Navigation],

    propTypes: {
        expanded: React.PropTypes.bool
    },

    getInitialState: function() {
        return {
            isAdding: false,
            isExpanded: this.props.expanded
        };
    },

    /**
     * @return {object}
     */
    render: function() {
        var header;
        var comments;
        var newComment;

        header = (
            React.createElement("div", null, 
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

        comments = [];
        comments.push({
            displayname: "SwampTony",
            content: "We'll be upgrading the CAD files soon.",
            createdAt: BomUtils.getLocalDate(new Date("2015-05-02 11:27:43"))
        });
        comments.push({
            displayname: "WhiteKenny",
            content: "Let's get samples in white, grey, and matte black",
            createdAt: BomUtils.getLocalDate(new Date("2015-04-28 21:14:37"))
        });

        // Create the new BoM item if + was clicked
        if (this.state.isAdding) {
            newComment = (React.createElement("tr", null, 
                    React.createElement("td", null, "You:"), 
                    React.createElement("td", null, 
                        React.createElement(TextInput, {
                            className: "edit", 
                            onSave: this._onSave, 
                            onCancel: this._onCancel, 
                            value: "", 
                            placeholder: "Enter your comment"})
                    ), 
                    React.createElement("td", null, 
                        React.createElement(Button, {
                            className: "btn-nobg", 
                            bsStyle: "danger", 
                            bsSize: "small", 
                            onClick: this._onCancel}, 
                            React.createElement(Glyphicon, {glyph: "remove"})
                        )
                    )
                ));
        }

        return (
            React.createElement(Panel, {ref: "panel", header: header, onSelect: this._onToggle, expanded: this.state.isExpanded, collapsable: true}, 
                React.createElement(Table, {className: "comment-table", striped: true, bordered: true, condensed: true, hover: true, fill: true}, 
                    React.createElement("tbody", null, 
                        comments.map(function(comment, index) {
                            return (React.createElement("tr", {key: index}, 
                                    React.createElement("td", null, comment.displayname, ":"), 
                                    React.createElement("td", null, 
                                        React.createElement("p", null, comment.content), 
                                        React.createElement("span", null, React.createElement("small", null, "— ", comment.createdAt))
                                    ), 
                                    React.createElement("td", null, 
                                        React.createElement(Button, {
                                            className: "btn-nobg", 
                                            bsStyle: "default", 
                                            bsSize: "small", 
                                            onClick: this._onEdit}, 
                                            React.createElement(Glyphicon, {
                                                bsSize: "small", 
                                                glyph: "pencil"})
                                        )
                                    )
                                ))
                        }), 
                        newComment
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

    _onCancel: function(event) {
        this.setState({
            isAdding: false,
        });
    },

    _onEdit: function(event) {
        // TMP
    },

    _onSave: function(name) {
        // name = name || "";
        // name = name.trim();

        // if (name) {
        //     BomActions.create(name, this.props.product.id || this.props.product.cid);
        // }
        // else {
        //     // TODO fix Panel class to update dimensions...
        // }

        this.setState({
            isAdding: false,
        });
    }
});

module.exports = CommentPanel;
