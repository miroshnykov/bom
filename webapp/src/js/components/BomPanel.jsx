"use strict";

var _ = require("underscore");
var React = require("react");
var Navigation = require("react-router").Navigation;
var Button = require("react-bootstrap").Button;
var ButtonToolbar = require("react-bootstrap").ButtonToolbar;
var backboneMixin = require("backbone-react-component");

var BomStore = require("stores/BomStore");
var BomModel = require("models/BomModel");
var BomPanelItem = require("components/BomPanelItem.jsx");
var Scroll = require("components/Scroll.jsx");

var BomPanel = React.createClass({
    mixins: [Navigation, backboneMixin],

    render: function() {
        var product = this.getModel();

        var boms = product.getBoms().map(function(result) {
            return BomStore.collection.get(result);
        });

        boms = _.filter(boms, function(bom) {
            return !!bom;
        });

        boms = _.sortBy(boms, function(bom) {
            return bom.get("name").toLowerCase();
        });

        return (
            <div className="panel panel-default bom-panel">
                <div className="panel-heading">
                    <div>
                        <ButtonToolbar className="pull-right btn-toolbar-right">
                            <Button
                                className="btn-nobg"
                                bsStyle="default"
                                bsSize="medium"
                                onClick={this.onImport}>
                                <span className="fa fa-plus" aria-hidden="true"/>
                            </Button>
                        </ButtonToolbar>
                        <span className="h5 text-uppercase">
                            Bill of Materials
                        </span>
                    </div>
                </div>
                <div className="panel-body no-padding">
                    <Scroll>
                        <table className="table table-striped table-bordered table-condensed table-hover table-fill">
                            <tbody>
                                {boms.map(function(bom) {
                                    return (<BomPanelItem key={bom.id} model={bom} productId={product.id} />);
                                }, this)}
                            </tbody>
                        </table>
                    </Scroll>
                </div>
            </div>
        );
    },

    onImport: function(event) {
        var product = this.getModel();

        this.transitionTo("addBom", {
            productId: product.id
        });
    },
});

module.exports = BomPanel;
