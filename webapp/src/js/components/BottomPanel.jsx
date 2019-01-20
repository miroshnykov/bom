"use strict";

var React = require("react");
var TabbedArea = require("react-bootstrap").TabbedArea;
var TabPane = require("react-bootstrap").TabPane;
var Button = require("react-bootstrap").Button;
var Glyphicon = require("react-bootstrap").Glyphicon;
var backboneMixin = require("backbone-react-component");

var BomItemDetails = require("components/BomItemDetails.jsx");
var BomItemPurchasing = require("components/BomItemPurchasing.jsx");
var BomItemUsage = require("components/BomItemUsage.jsx");
var BomItemHistory = require("components/BomItemHistory.jsx");

var CommentCollection = require("collections/CommentCollection");

var FieldConstants = require("constants/FieldConstants");
var BomUtils = require("utils/BomUtils");

var BottomPanel = React.createClass({
    mixins: [backboneMixin],

    propTypes: {
        bom: React.PropTypes.object.isRequired,
        open: React.PropTypes.bool,
        onClose: React.PropTypes.func,
        onOpen: React.PropTypes.func
    },

    getInitialState: function() {
        return {
            activeTab: "purchasing"
        };
    },

    render: function() {
        return this.props.open ? this.renderOpen() : this.renderClose();
    },

    renderOpen: function() {
        var bom = this.props.bom;
        var item = this.getCollection().getLastSelected();

        return (
          <div className="sidepanel sidepanel-bottom sidepanel-bottom-open">
            <div className="closer">
                <Button bsStyle="link" onClick={this.close}>
                    <Glyphicon glyph="chevron-down" />
                </Button>
            </div>
            <div className="row full-height">
                <div id="component-details" className="full-height col-md-3">
                    {item ?
                        (<BomItemDetails bom={bom} item={item} collection={item.getValues()} />) :
                        (<div>
                            <h1>Component</h1>
                            <div>No selected component.</div>
                        </div>)}
                </div>
              <div id="component-tabs" className="col-md-9">
                <TabbedArea activeKey={this.state.activeTab} onSelect={this.handleSelectTab} animation={false}>
                  <TabPane eventKey="purchasing" tab="Purchasing Information">
                    {item && this.state.activeTab === "purchasing" ?
                        (<BomItemPurchasing bom={bom} item={item} collection={item.getValues()} />) :
                        null}
                  </TabPane>
                  <TabPane eventKey="usage" tab="Usage Information">
                    {item && this.state.activeTab === "usage" ?
                        (<BomItemUsage bom={bom} item={item} collection={item.getValues()} />) :
                        null}
                  </TabPane>
                  <TabPane eventKey="history" tab="History" className="history-tab-pane">
                    {item && this.state.activeTab === "history" ?
                        (<BomItemHistory item={item} />) :
                        null}
                  </TabPane>
                </TabbedArea>
              </div>
            </div>
          </div>
        );
    },

    renderClose: function() {
        return (
            <div className="sidepanel sidepanel-bottom sidepanel-bottom-close" onClick={this.open}>
                <div className="closer">
                    <Button bsStyle="link" onClick={this.open}>
                        <Glyphicon glyph="chevron-up" />
                    </Button>
                </div>
            </div>
        );
    },

    close: function(event) {
        if (this.props.onClose) {
            this.props.onClose();
        }
    },

    open: function() {
        if (this.props.onOpen) {
            this.props.onOpen();
        }
    },

    handleSelectTab: function(key) {
        this.setState({
            activeTab: key
        });
    }
});

module.exports = BottomPanel;
