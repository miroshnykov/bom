"use strict";

var React = require("react");
var State = require("react-router").State;

var SidebarHeader = require("components/SidebarHeader.jsx");
var SidebarFooter = require("components/SidebarFooter.jsx");
var ProductList = require("components/ProductList.jsx");
var Scroll = require("components/Scroll.jsx");
var UserStore = require("stores/UserStore");
var ProductStore = require("stores/ProductStore");

var Sidebar = React.createClass({
    mixins: [State],

    render: function() {
        return (
            <div className="sidebar pull-left">
                <SidebarHeader model={UserStore.current} />
                <div className="sidebar-content">
                    <Scroll>
                        <ProductList
                            collection={ProductStore.collection}
                            currentProductId={this.getParams().productId}
                            currentBomId={this.getParams().bomId} />
                    </Scroll>
                </div>
                <SidebarFooter />
            </div>
        );
    }
});

module.exports = Sidebar;
