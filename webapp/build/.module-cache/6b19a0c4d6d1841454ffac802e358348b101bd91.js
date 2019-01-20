"use strict";

var $ = require("jquery");
var React = require("react");
var Table = require("react-bootstrap").Table;

var FieldConstants = require("../constants/FieldConstants");

var BomItemDetails = React.createClass({displayName: "BomItemDetails",

    propTypes: {
        allFields: React.PropTypes.object.isRequired,
        allTypes: React.PropTypes.object.isRequired,
        item: React.PropTypes.object,
        bom: React.PropTypes.object
    },

    componentDidMount: function() {
        if (this.props.item) {
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
        if (this.props.item && !this.props.item) {
            this._removeScroll();
        }
    },

    componentDidUpdate: function(prevProps, prevState) {
        var niceScroll = this._getScroll();
        if (this.props.item) {
            if (!prevProps.item) {
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
        var bom = this.props.bom;
        var item = this.props.item;
        var fieldIds;
        var attributes;
        var element;
        var description;
        var sku;
        var id;

        if (!item) {
            element = (
                React.createElement("div", null, 
                    React.createElement("h1", null, "Component"), 
                    React.createElement("div", null, "No selected component.")
                )
            );
        }
        else {
            fieldIds = [
                FieldConstants.TYPE,
                FieldConstants.VALUE,
                FieldConstants.VOLT,
                FieldConstants.TOLERANCE,
                FieldConstants.TEMP_COEFF,
                FieldConstants.PACKAGE];

            id = bom.getItemValueForField(item.id || item.cid, FieldConstants.ID);
            sku = bom.getItemValueForField(item.id || item.cid, FieldConstants.SKU);
            description = bom.getItemValueForField(item.id || item.cid, FieldConstants.DESCRIPTION);

            element = (
                React.createElement("div", {className: "full-height"}, 
                    React.createElement("h1", null, "Component ", sku ? sku.get("content") : (id ? id.get("content") : undefined)), 
                    React.createElement("div", {className: "scrollable"}, 
                        React.createElement("div", {className: "wrapper"}, 
                            React.createElement("p", null, React.createElement("strong", null, description ? description.get("content") : undefined)), 
                            React.createElement(Table, {condensed: true}, 
                                React.createElement("tbody", null, 
                                    fieldIds.map(function(result) {
                                        var value = bom.getItemValueContentForField(item.id || item.cid, result);
                                        return (
                                            React.createElement("tr", {key: result}, 
                                                React.createElement("td", null, this.props.allFields.get(result).get("name")), 
                                                React.createElement("td", null, value)
                                            ));
                                    }, this)
                                )
                            )
                        )
                    )
                )
            );
        }

        return (
            React.createElement("div", {id: "component-details", className: "full-height col-md-3"}, 
                element
            )
        );
    }
});

module.exports = BomItemDetails;
