var React = require("react");
var Navigation = require("react-router").Navigation;
var Button = require("react-bootstrap").Button;
var ButtonToolbar = require("react-bootstrap").ButtonToolbar;
var Glyphicon = require("react-bootstrap").Glyphicon;
var Link = require("react-router").Link;

var BomActions = require("../actions/BomActions");
var TextInput = require("../components/TextInput.react");

var BomPanel = React.createClass({displayName: "BomPanel",
    mixins: [Navigation],

    propTypes: {
        bom: React.PropTypes.object.isRequired,
        product: React.PropTypes.object.isRequired
    },

    getInitialState: function() {
        return {
            isEditing: false
        };
    },

    /**
     * @return {object}
     */
    render: function() {
        var bom = this.props.bom;
        var product = this.props.product;
        var numItems = bom.getItems().length;
        var nameElement;

        if (this.state.isEditing) {
            nameElement = (React.createElement(TextInput, {
                className: "edit", 
                onSave: this._onSave, 
                value: bom.get("name")})
            );
        }
        else {
            nameElement = (React.createElement("div", null, 
                    React.createElement(Link, {to: "bom", params: { productId: product.id || product.cid, bomId: bom.id || bom.cid}}, 
                        bom.get("name")
                    ), 
                    React.createElement(Button, {
                        className: "btn-nobg", 
                        bsStyle: "default", 
                        bsSize: "small", 
                        onClick: this._onEdit}, 
                        React.createElement(Glyphicon, {
                            bsSize: "small", 
                            glyph: "pencil"})
                    )
                ));
        }

        return (
            React.createElement("tr", {key: bom.id || bom.cid}, 
                React.createElement("td", null, 
                    nameElement
                ), 
                React.createElement("td", null, 
                    numItems, " item", numItems>1?"s":""
                ), 
                React.createElement("td", null, 
                    React.createElement(Button, {
                        className: "btn-nobg", 
                        bsStyle: "danger", 
                        bsSize: "small", 
                        onClick: this._onDelete}, 
                        React.createElement(Glyphicon, {
                            bsSize: "small", 
                            glyph: "remove"})
                    )
                )
            )
        );
    },

    _onEdit: function(event) {
        this.setState({
            isEditing: true
        });
    },

    _onSave: function(name) {
        name = name || "";
        name = name.trim();

        if (name && this.props.bom.get("name") !== name) {
            BomActions.updateName(this.props.bom.id, name);
        }

        this.setState({
            isEditing: false
        });
    },

    _onDelete: function() {
        var bom = this.props.bom;

        if (confirm("Are you sure you want to permanemtly delete this BoM?")) {
            BomActions.destroy(bom.id || bom.cid);
        }
    }
});

module.exports = BomPanel;
