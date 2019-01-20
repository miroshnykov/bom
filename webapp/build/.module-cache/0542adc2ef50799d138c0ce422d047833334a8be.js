"use strict";

var $ = require("jquery");
var React = require("react");
var ProductList = require("../components/ProductList.react");

var Button = require("react-bootstrap").Button;
var Glyphicon = require("react-bootstrap").Glyphicon;

var LeftPanel = React.createClass({displayName: "LeftPanel",

    propTypes: {
        allProducts: React.PropTypes.object.isRequired,
        allBoms: React.PropTypes.object.isRequired,
        currentProductId: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number
        ]),
        currentBomId: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number
        ]),
        open: React.PropTypes.bool,
        onClose: React.PropTypes.func,
        onOpen: React.PropTypes.func
    },

    getInitialState: function() {
        return {
            view: 'products'
        };
    },

    componentDidMount: function() {
        if (this.props.open) {
            this._addScroll();
        }
    },

    componentWillUnmount: function() {
        var niceScroll = this._getScroll();
        if (niceScroll) {
            niceScroll.remove();
        }
    },

    componentWillUpdate: function(nextProps) {
        if (this.props.open && !nextProps.open) {
            this._removeScroll();
        }
    },

    componentDidUpdate: function(prevProps, prevState) {
        var niceScroll = this._getScroll();
        if (this.props.open) {
            if (!prevProps.open) {
                this._addScroll();
            }
            else if (niceScroll) {
                niceScroll.resize();
            }
        }
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
        return this.props.open ? this._renderOpen() : this._renderClose();
    },

    _renderOpen: function() {
        var panel;
        var footer;

        switch(this.state.view) {
            case 'products':
                panel = (React.createElement(ProductList, {
                    allProducts: this.props.allProducts, 
                    allBoms: this.props.allBoms, 
                    currentProductId: this.props.currentProductId, 
                    currentBomId: this.props.currentBomId}));
                break;

            default:
                break;
        }

        return (
            React.createElement("div", {className: "sidepanel sidepanel-left sidepanel-left-open pull-left"}, 
                React.createElement("div", {className: "scrollable"}, 
                    React.createElement("div", {className: "wrapper"}, 
                        panel
                    )
                ), 
                React.createElement("div", {className: "closer"}, 
                    React.createElement(Button, {bsStyle: "link", onClick: this._close}, 
                        React.createElement(Glyphicon, {glyph: "chevron-left"})
                    )
                ), 
                React.createElement("div", {className: "footer"}, 
                    footer
                )
            )
        );
    },

    _renderClose: function() {
        return (
            React.createElement("div", {className: "sidepanel sidepanel-left sidepanel-left-close pull-left", onClick: this._open}, 
                React.createElement("div", {className: "closer"}, 
                    React.createElement(Button, {bsStyle: "link", onClick: this._open}, 
                        React.createElement(Glyphicon, {glyph: "chevron-right"})
                    )
                )
            )
        );
    },

    _close: function(event) {
        if (this.props.onClose) {
            this.props.onClose();
        }
    },

    _open: function() {
        if (this.props.onOpen) {
            this.props.onOpen();
        }
    },

    _showProducts: function(event) {
        this.setState({
            view: "products",
        });
        this._open();
    }
});

module.exports = LeftPanel;
