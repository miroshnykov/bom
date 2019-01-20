var React = require("react");
var Table = require("react-bootstrap").Table;
var Button = require("react-bootstrap").Button;
var Glyphicon = require("react-bootstrap").Glyphicon;

var TextInput = require("../components/TextInput.react");

var BomItemComments = React.createClass({displayName: "BomItemComments",

    propTypes: {
        bom: React.PropTypes.object,
        item: React.PropTypes.object,
        comments: React.PropTypes.array,
    },

    componentDidMount: function() {
        this._addScroll();
    },

    componentDidUpdate: function(nextProps) {
        $(this.getDOMNode()).getNiceScroll().resize();

        // Trigger a fake mouse enter
        // This solve a bug that seem to fail to update the width
        // of the horizontal scrollbar when the left panel opens
        $(this.getDOMNode()).trigger("mouseenter");
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

    /**
    * @return {object}
    */
    render: function() {
        var bom = this.props.bom;
        var item = this.props.item;
        var comments = this.props.comments;
        var newComment;

        if (!bom || !item) { return ( React.createElement("div", null) ); }

        newComment = (React.createElement("tr", null, 
                React.createElement("td", null, "You:"), 
                React.createElement("td", null, 
                    React.createElement(TextInput, {
                        className: "edit", 
                        onSave: this._onSave, 
                        onCancel: this._onCancel, 
                        value: "", 
                        placeholder: "Add a comment"})
                ), 
                React.createElement("td", null)
            ));

        return (
            React.createElement("div", {className: "row content scrollable"}, 
                React.createElement("div", {className: "wrapper col-md-12"}, 
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
            )
        );
    }
});

module.exports = BomItemComments;
