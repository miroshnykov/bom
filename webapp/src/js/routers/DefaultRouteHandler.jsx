"use strict";

var Navigation = require("react-router").Navigation;
var React      = require("react");

var ProductStore  = require("stores/ProductStore");
var TutorialStore = require("stores/TutorialStore");

module.exports = React.createClass({
    mixins: [Navigation],

    componentWillMount: function() {
        if (ProductStore.collection.isEmpty()) {
            this.replaceWith(TutorialStore.completedTutorial() ? "emptyState" : "welcome");
            return;
        }

        var product = ProductStore.collection.last();
        this.replaceWith("product", {productId: product.id || product.cid});
    },

    render: function() {
        return (
            <div />
        );
    }

});
