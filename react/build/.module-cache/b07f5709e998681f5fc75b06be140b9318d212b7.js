var React = require("react");
var TabbedArea = require("react-bootstrap").TabbedArea;
var TabPane = require("react-bootstrap").TabPane;
var Button = require("react-bootstrap").Button;
var Glyphicon = require("react-bootstrap").Glyphicon;

var BomItemDetails = require("../components/BomItemDetails.react");
var BomItemPurchasing = require("../components/BomItemPurchasing.react");
var BomItemUsage = require("../components/BomItemUsage.react");
var BomItemHistory = require("../components/BomItemHistory.react");
var BomItemComments = require("../components/BomItemComments.react");

var FieldConstants = require("../constants/FieldConstants");
var BomUtils = require("../utils/BomUtils");

var BottomPanel = React.createClass({displayName: "BottomPanel",

    propTypes: {
        allBoms: React.PropTypes.object.isRequired,
        allSelectedBomItems: React.PropTypes.object.isRequired,
        allFields: React.PropTypes.object.isRequired,
        allTypes: React.PropTypes.object.isRequired,
        allChanges: React.PropTypes.object.isRequired,
        open: React.PropTypes.bool,
        onClose: React.PropTypes.func,
        onOpen: React.PropTypes.func
    },

    /**
    * @return {object}
    */
    render: function() {
        return this.props.open ? this._renderOpen() : this._renderClose();
    },

    _renderOpen: function() {
        var lastSelection = this.props.allSelectedBomItems.last();
        var bom;
        var item;
        var sku;
        var comments = [];

        if (lastSelection) {
            bom = this.props.allBoms.get( lastSelection.get("bomId") );
            item = bom.getItem( lastSelection.get("itemId") );

            // TMP
            sku = bom.getItemValueForField(item.id || item.cid, FieldConstants.SKU);
            if (sku && sku.get("content") === "FAB-123") {
                comments.push({
                    displayname: "SwampTony",
                    content: "Kenny, this isn't going to work! WTF",
                    createdAt: BomUtils.getLocalDate(new Date("2015-05-04 12:02:05"))
                });
            }
        }

        return (
          React.createElement("div", {className: "sidepanel sidepanel-bottom sidepanel-bottom-open"}, 
            React.createElement("div", {className: "closer"}, 
                React.createElement(Button, {bsStyle: "link", onClick: this._close}, 
                    React.createElement(Glyphicon, {glyph: "chevron-down"})
                )
            ), 
            React.createElement("div", {className: "row wrapper"}, 
              React.createElement(BomItemDetails, {
                allFields: this.props.allFields, 
                allTypes: this.props.allTypes, 
                bom: bom, 
                item: item}), 
              React.createElement("div", {id: "component-tabs", className: "col-md-9"}, 
                React.createElement(TabbedArea, {defaultActiveKey: "purchasing", animation: false}, 
                  React.createElement(TabPane, {eventKey: "purchasing", tab: "Purchasing Information"}, 
                    React.createElement(BomItemPurchasing, {
                      bom: bom, 
                      item: item})
                  ), 
                  React.createElement(TabPane, {eventKey: "usage", tab: "Usage Information"}, 
                    React.createElement(BomItemUsage, {
                      bom: bom, 
                      item: item})
                  ), 
                  React.createElement(TabPane, {eventKey: "history", tab: "History"}, 
                    React.createElement(BomItemHistory, {
                      bom: bom, 
                      item: item, 
                      changes: item ? this.props.allChanges.getVisibleForItem(item.id || item.cid) : undefined})
                  ), 
                  React.createElement(TabPane, {eventKey: "comments", tab: "Comments"}, 
                    React.createElement(BomItemComments, {
                      bom: bom, 
                      item: item, 
                      comments: comments})
                  )
                )
              )
            )
          )
        );
    },

    _renderClose: function() {
        return (
            React.createElement("div", {className: "sidepanel sidepanel-bottom sidepanel-bottom-close", onClick: this._open}, 
                React.createElement(Button, {className: "pull-right", bsStyle: "link", onClick: this._open}, 
                    React.createElement(Glyphicon, {glyph: "chevron-up"})
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

});

module.exports = BottomPanel;
