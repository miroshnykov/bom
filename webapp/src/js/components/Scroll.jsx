"use strict";

var React = require("react");
var cx = require("react/lib/cx");

var Scroll = React.createClass({

    propTypes: {
        className: React.PropTypes.string
    },

    componentDidMount: function() {
        this.addScroll();
    },

    componentWillUnmount: function() {
        this.removeScroll();
    },

    componentDidUpdate: function() {
        $(React.findDOMNode(this)).getNiceScroll().resize();

        // Trigger a fake mouse enter
        // This solve a bug that seem to fail to update the width
        // of the horizontal scrollbar when the left panel opens
        $(React.findDOMNode(this)).trigger("mouseenter");
    },

    addScroll: function() {
        $(React.findDOMNode(this)).niceScroll({
            cursoropacitymax: 0.25,
            cursorwidth: "10px",
            railpadding: {
                top: 5,
                right: 1,
                left: 1,
                bottom: 5
            },
            autohidemode: "leave",
            hidecursordelay: 0
        });
    },

    removeScroll: function() {
        $(React.findDOMNode(this)).getNiceScroll().remove();
    },

    render: function() {
        return (
            <div className={cx("scroll", this.props.className)}>
                <div className="wrapper">
                    {this.props.children}
                </div>
            </div>
        );
    }
});

module.exports = Scroll;
