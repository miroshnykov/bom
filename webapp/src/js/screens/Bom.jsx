"use strict";

var _ = require("underscore");
var React = require("react");
var Router = require("react-router");
var Navigation = require("react-router").Navigation;
var State = require("react-router").State;
var RouteHandler = Router.RouteHandler;

var LocalStorage = require("utils/LocalStorage");
var BomStore = require("stores/BomStore");

var Bom = React.createClass({
    mixins: [Navigation, State],

    componentWillMount: function() {
        this.validate();
    },

    componentWillReceiveProps: function() {
        this.validate();
    },

    validate: function() {
        var bom = this.getBom();

        if (!bom) {
            this.replaceWith("default");
        }
        // Redirect if bomId is present as parameter but doesn't match
        // This is used to redirect a client id to its permanent id
        else if ( bom.id && bom.id !== +this.getParams().bomId ) {
            this.replaceWith("bom", _.extend(this.getParams(), {bomId: bom.id}));
        }
    },

    getBom: function() {
        return BomStore.collection.get(this.getParams().bomId);
    },

    render: function() {
        var bom = this.getBom();
        if (!bom) { return null; }

        return (<RouteHandler bom={bom} />);
    }
});

module.exports = Bom;
