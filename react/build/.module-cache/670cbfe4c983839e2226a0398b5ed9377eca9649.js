var React = require("react");
var TabbedArea = require("react-bootstrap").TabbedArea;
var TabPane = require("react-bootstrap").TabPane;
var Button = require("react-bootstrap").Button;
var Glyphicon = require("react-bootstrap").Glyphicon;

var BomItemDetails = require("../components/BomItemDetails.react");
var BomItemPurchasing = require("../components/BomItemPurchasing.react");
var BomItemUsage = require("../components/BomItemUsage.react");

var BottomPanel = React.createClass({displayName: "BottomPanel",

    propTypes: {
        allBoms: React.PropTypes.object.isRequired,
        allSelectedBomItems: React.PropTypes.object.isRequired,
        allFields: React.PropTypes.object.isRequired,
        allTypes: React.PropTypes.object.isRequired,
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

        if (lastSelection) {
          bom = this.props.allBoms.get( lastSelection.get("bomId") );
          item = bom.getItem( lastSelection.get("itemId") );
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
