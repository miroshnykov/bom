var React = require("react");
var Navigation = require("react-router").Navigation;
var Button = require("react-bootstrap").Button;
var ButtonToolbar = require("react-bootstrap").ButtonToolbar;
var Glyphicon = require("react-bootstrap").Glyphicon;
var Panel = require("react-bootstrap").Panel;
var Table = require("react-bootstrap").Table;

var BomActions = require("../actions/BomActions");
var BomPanelItem = require("../components/BomPanelItem.react");
var TextInput = require("../components/TextInput.react");

var BomPanel = React.createClass({displayName: "BomPanel",
    mixins: [Navigation],

    propTypes: {
        product: React.PropTypes.object.isRequired,
        allBoms: React.PropTypes.object.isRequired,
        expanded: React.PropTypes.bool
    },

    getInitialState: function() {
        return {
            isAdding: false,
            isExpanded: this.props.expanded
        };
    },

    /**
     * @return {object}
     */
    render: function() {
        var product = this.props.product;
        var header;
        var boms;
        var newBom;

        header = (
            React.createElement("div", {onClick: this._onToggle}, 
                React.createElement(ButtonToolbar, {className: "pull-left"}, 
                    React.createElement(Glyphicon, {glyph: this.state.isExpanded ? "triangle-bottom" : "triangle-right"})
                ), 
                React.createElement(ButtonToolbar, {className: "pull-right btn-toolbar-right"}, 
                    React.createElement(Button, {
                        className: "btn-nobg", 
                        bsStyle: "default", 
                        bsSize: "small", 
                        onClick: this._onAdd}, 
                        React.createElement(Glyphicon, {glyph: "plus"})
                    ), 
                    React.createElement(Button, {
                        className: "btn-nobg", 
                        bsStyle: "default", 
                        bsSize: "small", 
                        onClick: this._onImport}, 
                        React.createElement(Glyphicon, {glyph: "save"})
                    )
                ), 
                React.createElement("h2", null, "Bill of Materials")
            ));

        // Get the BoMs to display
        boms = [];
        _.each(product.getBoms(), function(result) {
            boms.push(this.props.allBoms.get(result));
            boms = boms.concat(this.props.allBoms.getDescendantBomsOfBom( result.id || result.cid ));
        }, this);

        // Create the new BoM item if + was clicked
        if (this.state.isAdding) {
            newBom = (React.createElement("tr", null, ")", 
                    React.createElement("td", null, 
                        React.createElement(TextInput, {
                            className: "edit", 
                            onSave: this._onSave, 
                            onCancel: this._onCancel, 
                            value: "", 
                            placeholder: "New BoM"})
                    ), 
                    React.createElement("td", null, "0 item"), 
                    React.createElement("td", null, 
                        React.createElement(Button, {
                            className: "btn-nobg", 
                            bsStyle: "danger", 
                            bsSize: "small", 
                            onClick: this._onCancel}, 
                            React.createElement(Glyphicon, {glyph: "remove"})
                        )
                    )
                ));
        }

        return (
            React.createElement(Panel, {ref: "panel", header: header, expanded: this.state.isExpanded, collapsable: true}, 
                React.createElement(Table, {striped: true, bordered: true, condensed: true, hover: true, fill: true}, 
                    React.createElement("tbody", null, 
                        boms.map(function(bom) {
                            return (React.createElement(BomPanelItem, {key: bom.id || bom.cid, bom: bom, product: product}));
                        }, this), 
                        newBom
                    )
                )
            )
        );
    },

    _onToggle: function(event) {
        this.setState({ isExpanded: !this.state.isExpanded });
    },

    _onAdd: function(event) {
        this.setState({
            isAdding: true,
            isExpanded: true
        });

        event.stopPropagation();
        event.preventDefault();
    },

    _onCancel: function(event) {
        this.setState({
            isAdding: false,
        });
    },

    _onSave: function(name) {
        name = name || "";
        name = name.trim();

        if (name) {
            BomActions.create(name, this.props.product.id || this.props.product.cid);
        }
        else {
            // TODO fix Panel class to update dimensions...
        }

        this.setState({
            isAdding: false,
        });
    },

    _onImport: function(event) {
        var product = this.props.product;

        this.transitionTo("productImport", {
            productId: product.id || product.cid
        });
    },
});

module.exports = BomPanel;
