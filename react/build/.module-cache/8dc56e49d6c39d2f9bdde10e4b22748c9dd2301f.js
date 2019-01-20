var React = require("react");
var Navigation = require("react-router").Navigation;
var Table = require("react-bootstrap").Table;
var ButtonToolbar = require("react-bootstrap").ButtonToolbar;
var Button = require("react-bootstrap").Button;

var BomImportAttribute = require("../components/BomImportAttribute.react");
var BomImportItem = require("../components/BomImportItem.react");
var BomActions = require("../actions/BomActions");


var BomImportMatch = React.createClass({displayName: "BomImportMatch",
    mixins: [Navigation],

    propTypes: {
        allImportBoms: React.PropTypes.object.isRequired,
        allFields: React.PropTypes.object.isRequired,
        allTypes: React.PropTypes.object.isRequired,
        allProducts: React.PropTypes.object.isRequired
    },

    getInitialState: function() {
        if (!this._validateBom(this.props)) { return {}; }

        var bom = this.props.allImportBoms.last();
        var attributes = bom.getAttributes().map(_.clone);

        // Set the first attribute as active
        attributes[0].status = "active";

        // Add the readonly ID attribute
        attributes.unshift({
            id: "id",
            fieldId: "id",
            name: "ID",
            status: "readonly"
        });

        return {
            attributes: attributes
        };
    },

    componentWillMount: function() {
        this._validateBom(this.props);
    },

    componentDidMount: function() {
        this._addScroll();
    },

    componentWillUnmount: function() {
        this._removeScroll();
    },

    componentWillReceiveProps: function(nextProps) {
        this._validateBom(nextProps);
    },

    componentDidUpdate: function(nextProps) {
        $(this.getDOMNode()).getNiceScroll().resize();
    },

    _addScroll: function() {
        $(this.getDOMNode()).niceScroll({
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
        $(this.getDOMNode()).getNiceScroll().remove();
    },

    _validateBom: function(props) {
        var productId;
        var bomId;

        if (props.allImportBoms.last()) { return true; }

        if (props.params) {
            productId = props.params.productId;
            bomId = props.params.bomId;
        }

        if (bomId) {
            this.transitionTo("bomImport", {productId: productId, bomId: bomId});
        }
        else if (productId) {
            this.transitionTo("productImport", {productId: productId, bomId: bomId});
        }
        else {
            this.transitionTo("newProductImport", {productId: productId, bomId: bomId});
        }

        return false;
    },

    /**
     * @return {object}
     */
    render: function() {
        var bom = this.props.allImportBoms.last();
        if (!bom) { return null; }

        var attributes = this.state.attributes.map(_.clone);
        var numPreviewItems = 5;
        var fields;
        var headers;
        var attributeIds;
        var items;
        var canImport;

        // Generate available fields (prevent repeat fields)
        fields = this.props.allFields.map(function(field) {

            // Disable if field is already assigned to an attribute
            var disabled = !!_.find(attributes, function(attribute) {
                return attribute.fieldId &&
                    (attribute.fieldId === field.id || attribute.fieldId === field.cid);
            });

            return {
                id: field.id || field.cid,
                name: field.get("name"),
                typeId: field.get("typeId"),
                disabled: disabled
            };
        }, this);

        headers = attributes.map(function(result, index) {
            return React.createElement(BomImportAttribute, {
                key: result.id || result.cid, 
                attribute: _.clone(result), 
                index: index, 
                onSave: this._onSaveColumn, 
                onChange: this._onChangeColumn, 
                onEdit: this._onEditColumn, 
                onSkip: this._onSkipColumn, 
                fields: fields, 
                allTypes: this.props.allTypes});
        }, this);

        items = _.first(bom.getItems(), numPreviewItems).map(function(result, index) {
            return React.createElement(BomImportItem, {
                key: index, 
                item: result, 
                attributes: attributes});
        });

        canImport = !!_.find(attributes, function(result) {
            return result.status !== "saved" && result.status !== "skipped" && result.status !== "readonly";
        });

        return (
            React.createElement("div", {id: "bom-import-match", className: "scrollable content"}, 
                React.createElement("div", {className: "wrapper"}, 
                    React.createElement("h1", null, "Import BoM"), 
                    React.createElement("p", null, "Now we'll match the columns in your CSV file with your BoM Squad Bill of Materials."), 
                    React.createElement(Table, {striped: true}, 
                        React.createElement("thead", null, 
                            React.createElement("tr", null, 
                                headers
                            )
                        ), 
                        React.createElement("tbody", null, 
                            items
                        )
                    ), 
                    React.createElement(ButtonToolbar, {className: "btn-toolbar-import"}, 
                        React.createElement(Button, {
                            bsStyle: "primary", 
                            bsSize: "large", 
                            onClick: this._onImport, 
                            disabled: canImport}, 
                            "Import"
                        ), 
                        React.createElement(Button, {
                            bsStyle: "link", 
                            bsSize: "large", 
                            onClick: this.goBack}, 
                            "Cancel"
                        )
                    )
                )
            )
        );
    },

    _onImport: function(event) {
        var importedBom = this.props.allImportBoms.last();
        var productId;
        var bomId;
        var product;

        if (this.props.params) {
            productId = this.props.params.productId;
            bomId = this.props.params.bomId;
        }

        if (bomId) {
            // this.transitionTo("bom", {productId: productId, bomId: bomId});

            // BomActions.importUpdateBom(
            //     importedBom.id || importedBom.cid,
            //     this._getAttributesForImport(),
            //     bomId
            // );
        }
        else if (productId) {
            BomActions.importNewBom(
                importedBom.id || importedBom.cid,
                this._getAttributesForImport(),
                productId
            ).then(function(bom) {
                this.transitionTo("bom", {productId: productId, bomId: bom.id || bom.cid});
            }.bind(this), function(error) {
                //TODO show warning
                console.log(error);
            });
        }
        else {
            BomActions.importNewProduct(
                importedBom.id || importedBom.cid,
                this._getAttributesForImport()
            ).then(function(product) {
                this.transitionTo("product", { productId: product.id || product.cid });
            }.bind(this), function(error) {
                //TODO show warning
                console.log(error);
            });
        }
    },

    _getAttributesForImport: function() {
        var attributes = this.state.attributes.map(_.clone);

        attributes = _.filter(attributes, function(result) {
            return result.status !== "skipped";
        });

        _.each(attributes, function(result) {
            if (result.savedName) {
                result.name = result.savedName;
                delete result.savedName;
            }
        });

        return attributes;
    },

    _onSaveColumn: function(index, name, fieldId) {
        var attributes = this.state.attributes.map(_.clone);
        var nextActive;

        if (!attributes[index]) { return; }

        attributes[index].status = "saved",
        attributes[index].savedName = name,
        attributes[index].fieldId = fieldId

        // Find the next to activate
        this._updateActiveColumn(attributes);

        this.setState({
            attributes: attributes
        });
    },

    _onChangeColumn: function(index, fieldId) {
        var attributes = this.state.attributes.map(_.clone);
        if (!attributes[index]) { return; }

        attributes[index].fieldId = fieldId;

        this.setState({
            attributes: attributes
        });
    },

    _onEditColumn: function(index) {
        var attributes = this.state.attributes.map(_.clone);
        if (!attributes[index]) { return; }

        attributes[index].status = undefined;

        // Find the next to activate
        this._updateActiveColumn(attributes);

        this.setState({
            attributes: attributes
        });
    },

    _onSkipColumn: function(index, skip) {
        var attributes = this.state.attributes.map(_.clone);
        var nextActive;

        if (!attributes[index]) { return; }

        // Set as skipped
        attributes[index].status = skip ? "skipped" : undefined;

        // Find the next to activate
        this._updateActiveColumn(attributes);

        this.setState({
            attributes: attributes
        });
    },

    _updateActiveColumn: function(attributes) {
        var found;
        // var hs;

        _.each(attributes, function(result, index) {
            if (found === undefined) {
                if (result.status === "active" || !result.status) {
                    result.status = "active";
                    found = index;
                }
            }
            else if (result.status === "active") {
                result.status = undefined;
            }
        });

        // if (found !== undefined) {
        //     found = $(this.getDOMNode()).find("thead>tr>th:nth-child("+found+")");
        //     if (found) {
        //         console.log(found);
        //         console.log(found.position());
        //         hs = $(this.getDOMNode()).getNiceScroll(0);
        //         console.log(hs.scroll.x + found.position().left);
        //         hs.doScrollLeft(hs.scroll.x + found.position().left, 1000);
        //     }
        // }
    }

});

module.exports = BomImportMatch;
