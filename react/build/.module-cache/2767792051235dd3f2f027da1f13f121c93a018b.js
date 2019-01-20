var React = require("react");
var Navigation = require("react-router").Navigation;
var Link = require("react-router").Link;

var Table = require("react-bootstrap").Table;
var Button = require("react-bootstrap").Button;
var ButtonToolbar = require("react-bootstrap").ButtonToolbar;
var Glyphicon = require("react-bootstrap").Glyphicon;
var SplitButton = require("react-bootstrap").SplitButton;
var MenuItem = require("react-bootstrap").MenuItem;

var BomSection = require("../components/BomSection.react");
var BomField = require("../components/BomField.react");
var TextInput = require("../components/TextInput.react");
var AddColumnModal = require("../components/AddColumnModal.react");
var EditColumnModal = require("../components/EditColumnModal.react");
var BomExportModal = require("../components/BomExportModal.react");
var SaveViewModal = require("../components/SaveViewModal.react");

var ComponentActions = require("../actions/ComponentActions");
var BomActions = require("../actions/BomActions");
var BomViewActions = require("../actions/BomViewActions");
var ProductActions = require("../actions/ProductActions");
var BomAttributeModel = require("../models/BomAttributeModel");
var FieldConstants = require("../constants/FieldConstants");

var cx = require("react/lib/cx");

var Bom = React.createClass({displayName: "Bom",
    mixins: [Navigation],

    propTypes: {
        allProducts: React.PropTypes.object.isRequired,
        allBoms: React.PropTypes.object.isRequired,
        allSelectedBomItems: React.PropTypes.object.isRequired,
        allFields: React.PropTypes.object.isRequired,
        allTypes: React.PropTypes.object.isRequired,
        allViews: React.PropTypes.object.isRequired
    },

    getInitialState: function() {
        var bom;
        var fieldSetId;

        bom = this._getBom(this.props);

        fieldSetId = bom && bom.hasVisibleAttributes()
            ? FieldConstants.CUSTOM_FIELDSET : FieldConstants.FULL_FIELDSET;

        return {
            isAddColumnModalOpen: false,
            isEditColumnModalOpen: false,
            isExportModalOpen: false,
            isSaveViewModalOpen: false,
            fieldSetId: fieldSetId,
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
        var bom;

        if (!this._validateBom(nextProps)) { return; }

        // If we are showing custom view, make sure the BoM has visible columns
        if (this.state.fieldSetId === FieldConstants.CUSTOM_FIELDSET) {
            bom = this._getBom(nextProps);
            if (!bom.hasVisibleAttributes()) {
                this.setState({
                    fieldSetId: FieldConstants.FULL_FIELDSET
                });
            }
        }
    },

    componentDidUpdate: function(nextProps) {
        $(this.getDOMNode()).getNiceScroll().resize();

        // Trigger a fake mouse enter
        // This solve a bug that seem to fail to update the width
        // of the horizontal scrollbar when the left panel opens
        $(this.getDOMNode()).trigger("mouseenter");
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
        var bom = this._getBom( props );
        var product = this._getProduct( props );

        //TODO check this because of update order
        //if ( !bom || props.product.isAncestorOfBom(bom.id || bom.cid)) {
        if ( !product ) {
            this.replaceWith("dashboard");
            return false;
        }
        // If the bom does not exists, try to redirect to the product
        else if ( !bom ) {
            this.replaceWith("product", {productId: product.id || product.cid});
            return false;
        }
        // Redirect if bomId is present as parameter but doesn't match
        // This is used to redirect a client id to its permanent id
        else if ( bom.id && bom.id !== +props.params.bomId ) {
            this.replaceWith("bom", {
                productId: product.id || product.cid,
                bomId: bom.id});
            return false;
        }

        return true;
    },

    _getProduct: function(props) {
        var productId;
        props = props ? props : this.props;
        productId = props.params ? props.params.productId : undefined;
        return props.allProducts.get( productId );
    },

    _getBom: function(props) {
        var product;
        props = props ? props : this.props;

        if (props.params && props.params.bomId) {
            return props.allBoms.get( props.params.bomId );
        }
        else if ((product = this._getProduct(props))) {
            return props.allBoms.get( product.get("bomId") );
        }
    },

    _isReadOnly: function() {
        var bom = this._getBom();
        return !!bom && (bom.isDirty() || bom.isNew());
    },

    /**
    * @return {object}
    */
    render: function() {
        var product = this._getProduct();
        if (!product) { return null; }

        var bom = this._getBom();
        if (!bom) { return null; }

        //var allComponents = this.props.allComponents;
        var allFields = this.props.allFields;
        var allTypes = this.props.allTypes;
        var allViews = this.props.allViews;
        var headers = this._getHeaders();
        var childBoms;
        var boms;
        var breadcrumbs;
        var modal;
        var fieldsForAdd;
        var spinner;

        //get the BoMs to display
        boms = [];
        boms.push(bom);
        boms = boms.concat(this.props.allBoms.getDescendantBomsOfBom( bom.id || bom.cid ));

        //generate the breadcrumbs
        //TODO show parent product and parent boms
        breadcrumbs = bom.get("name");

        // Show spinner if the value is read only but not because of parent
        if (this._isReadOnly()) {
            spinner = (
                React.createElement(Glyphicon, {
                    className: cx({
                        "glyphicon-spin" : bom.isSyncing()
                    }), 
                    bsSize: "small", 
                    bsStyle: "default", 
                    glyph: "repeat"}));
        }

        return (
            React.createElement("div", {className: "component-list content"}, 
                React.createElement("div", {className: "wrapper"}, 
                    React.createElement("div", {className: "component-list-header clearfix"}, 
                        React.createElement(ButtonToolbar, {className: "pull-left"}, 
                            React.createElement("div", {className: "btn-group"}, 
                                React.createElement("h1", null, breadcrumbs)
                            ), 
                            React.createElement("div", {className: "btn-group btn-group-actions"}, 
                                React.createElement(Link, {to: "bomHistory", params: {productId: product.id || product.cid, bomId: bom.id || bom.cid}}, "History")
                            ), 
                            React.createElement("div", {className: "btn-group btn-group-actions"}, 
                                React.createElement(Button, {
                                    bsStyle: "primary", 
                                    onClick: this._onRemoveItems, 
                                    disabled: this._isReadOnly() || !this.props.allSelectedBomItems.length}, 
                                    React.createElement(Glyphicon, {glyph: "trash"})
                                ), 
                                React.createElement(Button, {
                                    bsStyle: "primary", 
                                    onClick: this._onExport, 
                                    disabled: this._isReadOnly()}, 
                                    React.createElement(Glyphicon, {glyph: "open"})
                                )
                            ), 
                            this._renderViewSelector(bom)
                        )
                    ), 
                    React.createElement("div", null, 
                        React.createElement(Table, {striped: true, bordered: true, condensed: true, hover: true}, 
                            React.createElement("thead", null, 
                                React.createElement("tr", null, 
                                    React.createElement("th", {className: cx({
                                            "icon" : true,
                                            "text-center": true,
                                            "readonly": this._isReadOnly()
                                        })}, 
                                        spinner
                                    ), 
                                    headers.map(function(result, index) {
                                        return React.createElement(BomField, {
                                            key: result.fieldId, 
                                            index: index, 
                                            header: result, 
                                            field: this.props.allFields.get(result.fieldId), 
                                            onAddColumn: this._onClickAddColumn, 
                                            onEditColumn: this._onClickEditColumn, 
                                            readonly: this._isReadOnly()});
                                    }, this)
                                )
                            ), 
                            boms.map(function(result) {
                                return React.createElement(BomSection, {
                                    key: result.id || result.cid, 
                                    bom: result, 
                                    headers: headers, 
                                    allFields: allFields, 
                                    selectedItemIds: this.props.allSelectedBomItems.getItemIdsForBom(result.id || result.cid), 
                                    readonly: this._isReadOnly()});
                            }, this)
                        ), 
                        React.createElement(Button, {
                            bsStyle: "primary", 
                            onClick: this._onAddItem, 
                            disabled: this._isReadOnly()}, 
                            React.createElement(Glyphicon, {glyph: "plus"})
                        )
                    ), 
                    this._renderModal(bom, headers)
                )
            )
        );
    },

    _renderViewSelector: function(bom) {
        var allViews = this.props.allViews;
        var view;
        var title;
        var saveViewBtn;
        var options;
        var savedViews;

        if (this._isCustomViewActive()) {
            title = "Custom";
            saveViewBtn = (
                React.createElement(Button, {
                    bsStyle: "primary", 
                    onClick: this._onClickSaveView.bind(this, undefined)}, 
                    "Save"
                ));
        }
        else {
            view = allViews.get(this.state.fieldSetId);
            title = view.get("name");

            if (!view.get("default")) {
                saveViewBtn = (
                    React.createElement(Button, {
                        bsStyle: "primary", 
                        onClick: this._onClickSaveView.bind(this, view.id || view.cid)}, 
                        "Edit"
                    ));
            }
        }

        // Generate default views options
        options = allViews.getDefaults().map(function(view) {
            return (
                React.createElement(MenuItem, {
                    key: view.id || view.cid, 
                    eventKey: view.id || view.cid}, view.get("name")));
        });

        // Add the saved custom views (if any)
        savedViews = allViews.getSaved();
        if (savedViews.length) {
            options.push(React.createElement(MenuItem, {key: "saved-divider", divider: true}));
            options = options.concat( savedViews.map(function(view) {
                return React.createElement(MenuItem, {key: view.id || view.cid, eventKey: view.id || view.cid}, view.get("name"))
            }));
        }

        // If the top bom has visible columns, then add custom view option
        if (bom.hasVisibleAttributes()) {
            options.push(React.createElement(MenuItem, {key: "custom-divider", divider: true}));
            options.push(React.createElement(MenuItem, {
                key: FieldConstants.CUSTOM_FIELDSET, 
                eventKey: FieldConstants.CUSTOM_FIELDSET}, "Custom"));
        }

        return (
            React.createElement("div", {className: "btn-toolbar-section"}, 
                React.createElement(SplitButton, {
                    bsStyle: "default", 
                    title: title, 
                    onSelect: this._onSelectView}, 
                    options
                ), 
                React.createElement("div", {className: "btn-group"}, 
                    saveViewBtn
                )
            ));
    },

    _renderModal: function(bom, headers) {
        // add column modal
        if (this.state.isAddColumnModalOpen) {
            return this._getAddColumnModal(bom, headers);
        }
        // edit column modal
        else if (this.state.isEditColumnModalOpen) {
            return this._getEditColumnModal(bom, headers);
        }
        // bom export modal
        else if (this.state.isExportModalOpen) {
            return this._getExportModal();
        }
        // save view modal
        else if (this.state.isSaveViewModalOpen) {
            return this._getSaveViewModal(headers);
        }
    },

    // Columns

    _onClickAddColumn: function(index) {
        this.setState({
            isAddColumnModalOpen: true,
            addColumnIndex: index
        });
    },

    _onSaveAddColumn: function(fieldId, typeId, name, index) {
        var bom = this._getBom();
        var headers;
        var attributes;
        var newAttribute;

        this.setState({
            isAddColumnModalOpen: false
        });

        //create the attribute
        if (fieldId) {
            newAttribute = {
                fieldId: fieldId,
                name: name
            };
        }
        else {
            newAttribute = {
                typeId: typeId,
                name: name
            };
        }

        //if we're updating an existing attribute, check if we're only changing its name
        if (this.state.fieldSetId === FieldConstants.CUSTOM_FIELDSET) {

            newAttribute.visible = true;
            newAttribute.position = index;

            BomActions.addAttribute(bom.id || bom.cid, newAttribute);

        } else {
            //get the headers
            headers = this._getHeaders();

            //pluck ids for the columns that have them, keep the object if not
            attributes = headers.map(function(result) {
                //return result.id ? result.id : result;
                return result.attribute ? result.attribute.id || result.attribute.cid : result;
            });

            //replace the attribute
            attributes.splice(index, 0, newAttribute);

            BomActions.setVisibleAttributes(bom.id || bom.cid, attributes);

            this.setState({
                fieldSetId: FieldConstants.CUSTOM_FIELDSET
            });
        }
    },

    _onCancelAddColumn: function() {
        this.setState({
            isAddColumnModalOpen: false
        });
    },

    _onClickEditColumn: function(index) {
        this.setState({
            isEditColumnModalOpen: true,
            editColumnIndex: index
        });
    },

    _onSaveEditColumn: function(fieldId, typeId, name, index, attributeId) {
        var bom = this._getBom();
        var attribute = bom.getAttribute(attributeId);
        var headers;
        var attributes;
        var prevHeader;

        this.setState({
            isEditColumnModalOpen: false
        });

        //if we're updating an existing attribute, check if we're only changing its name
        if (attribute && attribute.get("fieldId") === fieldId) {

            if (attribute.get("name") === name) { return; }

            BomActions.setAttribute(bom.id || bom.cid, {
                id: attributeId,
                name: name
            });
        }
        //else we are hiding the existing and creating/updating the new attribute
        else {
            //get attribute ids for the current view
            headers = this._getHeaders();

            prevHeader = headers[index];

            //pluck ids for the attributes that have then, keep the object if not
            attributes = headers.map(function(result) {
                //return result.id ? result.id : result;
                return result.attribute ? result.attribute.id || result.attribute.cid : result;
            });

            //replace the column
            if (fieldId) {
                attributes[index] = {
                    fieldId: fieldId,
                    name: name
                };
            }
            else {
                attributes[index] = {
                    typeId: typeId,
                    name: name
                };
            }

            BomActions.setVisibleAttributes(bom.id || bom.cid, attributes);

            if (prevHeader.fieldId != fieldId) {
                this.setState({
                    fieldSetId: FieldConstants.CUSTOM_FIELDSET
                });
            }
        }
    },

    _onCancelEditColumn: function() {
        this.setState({
            isEditColumnModalOpen: false
        });
    },

    _onHideColumn: function(index) {
        var bom = this._getBom();
        var attributes;
        var headers

        this.setState({
            isEditColumnModalOpen: false,
        });

        //get column ids for the current view
        headers = this._getHeaders();

        //if current view is custom, only need to remove the column
        if (this.state.fieldSetId === FieldConstants.CUSTOM_FIELDSET) {
            BomActions.hideColumn(bom.id || bom.cid, headers[index].id);
        }
        //but if another view, then we need to set and update the custom view
        else {
            //remove the column
            headers.splice(index, 1);

            //pluck the ids of the columns that don't change, leave objects for the rest
            attributes = headers.map(function(result) {
                //return result.id ? result.id : result;
                return result.attribute ? result.attribute.id || result.attribute.cid : result;
            });

            BomActions.setVisibleAttributes(bom.id || bom.cid, attributes);

            this.setState({
                fieldSetId: FieldConstants.CUSTOM_FIELDSET
            });
        }
    },

    _isCustomViewActive: function() {
        return this.state.fieldSetId === FieldConstants.CUSTOM_FIELDSET;
    },

    _isFullViewActive: function() {
        return this.state.fieldSetId === FieldConstants.FULL_FIELDSET;
    },

    _onSelectView: function(id) {
        this.setState({ fieldSetId: id });
    },

    _getSaveViewModal: function(headers) {
        var view = this.state.saveViewModalView ?
            this.props.allViews.get( this.state.saveViewModalView ) : undefined;

        return (
            React.createElement(SaveViewModal, {
                onCancel: this._onCancelSaveView, 
                onSave: this._onSaveView, 
                onDelete: this._onDeleteView, 
                columns: headers, 
                view: view, 
                allViews: this.props.allViews}
            ));
    },

    _onClickSaveView: function(id) {
        this.setState({
            isSaveViewModalOpen: true,
            saveViewModalView: id
        });
    },

    _onCancelSaveView: function(id) {
        this.setState({
            isSaveViewModalOpen: false,
            saveViewModalView: undefined
        });
    },

    _onSaveView: function(name, fieldIds, viewId) {
        if (viewId) {
            BomViewActions.update(viewId, name, fieldIds).then(function(view) {
                this.setState({
                    fieldSetId: view.id || view.cid,
                    isSaveViewModalOpen: false
                });
            }.bind(this), function(error) {
                // TODO user feedback
                this.setState({
                    isSaveViewModalOpen: false
                });
            }.bind(this));
        }
        else {
            BomViewActions.create(name, fieldIds).then(function(view) {
                this.setState({
                    fieldSetId: view.id || view.cid,
                    isSaveViewModalOpen: false
                });
            }.bind(this), function(error) {
                // TODO user feedback
                this.setState({
                    isSaveViewModalOpen: false
                });
            }.bind(this));
        }
    },

    _onDeleteView: function(id) {
        var bom = this._getBom(this.props);
        var fieldSetId = bom && bom.hasVisibleAttributes()
            ? FieldConstants.CUSTOM_FIELDSET : FieldConstants.FULL_FIELDSET;

        this.setState({
            fieldSetId: fieldSetId,
            isSaveViewModalOpen: false
        });

        BomViewActions.destroy(id).then(undefined, function(error) {
            // TODO user feedback
            console.log(error);
            this.setState({
                fieldSetId: id
            });
        }.bind(this));
    },

    _getAddColumnModal: function(bom, headers) {
        var fieldOptions = this.props.allFields.map(function(field) {
            var attribute = bom.getAttributeForField(field.id || field.cid);

            var disabled = !!_.find(headers, function(result) {
                return result.fieldId === field.id || result.fieldId === field.cid;
            });

            return {
                id: field.id || field.cid,
                name: attribute ? attribute.get("name") : field.get("name"),
                typeId: field.get("typeId"),
                disabled: disabled
            };
        }, this);

        // TMP
        //  disable the ID field for now
        fieldOptions = _.filter(fieldOptions, function(field) {
            return field.id !== FieldConstants.ID;
        });

        return (
            React.createElement(AddColumnModal, {
                index: this.state.addColumnIndex, 
                onCancel: this._onCancelAddColumn, 
                onSave: this._onSaveAddColumn, 
                fields: fieldOptions, 
                allTypes: this.props.allTypes}));
    },

    _getEditColumnModal: function(bom, headers) {
        var editColumn = headers[ this.state.editColumnIndex ];
        var editField = this.props.allFields.get( editColumn.fieldId );

        var fieldOptions = this.props.allFields.map(function(field) {
            var attribute = bom.getAttributes().find(function(result) {
                return result.fieldId === field.id || result.fieldId === field.cid;
            });

            //TODO enable attribute we are editing
            var disabled = !!_.find(headers, function(result) {
                return result.fieldId === field.id || result.fieldId === field.cid;
            });

            return {
                id: field.id || field.cid,
                name: attribute ? attribute.get("name") : field.get("name"),
                typeId: field.get("typeId"),
                disabled: disabled
            };
        }, this);

        // TMP
        //  disable the ID field for now
        fieldOptions = _.filter(fieldOptions, function(field) {
            return field.id !== FieldConstants.ID;
        });

        return (
            React.createElement(EditColumnModal, {
                index: this.state.editColumnIndex, 
                column: editColumn, 
                typeId: editField.get("typeId"), 
                onCancel: this._onCancelEditColumn, 
                onSave: this._onSaveEditColumn, 
                onHide: this._onHideColumn, 
                fields: fieldOptions, 
                allTypes: this.props.allTypes}));
    },

    //TODO move this to the BomStore...
    _getHeaders: function() {
        var bom = this._getBom();
        var headers;
        var view;

        if (this._isCustomViewActive()) {
            headers = bom.getVisibleAttributes().map(function(attribute) {
                return {
                    id: attribute.id || attribute.cid,
                    fieldId: attribute.get("fieldId"),
                    name: attribute.get("name"),
                    attribute: attribute
                };
            });
        }
        else {
            headers = [];
            view = this.props.allViews.get( this.state.fieldSetId );
            if (!view) { return headers; }

            _.each( view.get("fieldIds"), function(result) {
                var attribute = bom.getAttributeForField( result );
                var header;
                var field;

                if (!attribute) {
                    field = this.props.allFields.get( result );
                    if (field) {
                        header = {
                            fieldId: result,
                            name: field.get("name")
                        };
                    }
                }
                else {
                    header = {
                        id: attribute.id || attribute.cid,
                        fieldId: attribute.get("fieldId"),
                        name: attribute.get("name"),
                        attribute: attribute
                    };
                }

                if (header) {
                    headers.push(header);
                }
            }, this);

            //for the full view, add custom fields at the end
            if (this._isFullViewActive()) {
                bom.getAttributes().each(function(attribute) {
                    if (!_.contains(view.get("fieldIds"), attribute.get("fieldId"))) {
                        headers.push({
                            id: attribute.id || attribute.cid,
                            fieldId: attribute.get("fieldId"),
                            name: attribute.get("name"),
                            attribute: attribute
                        });
                    }
                });
            }
        }

        return headers;
    },

    _onAddItem: function(event) {
        var bom = this._getBom();
        if (!bom) { return; }

        //TODO
        //if one or more items are selected, insert after last selected item (lowest one)

        BomActions.addItem(bom.id || bom.cid);
    },

    _onRemoveItems: function(event) {
        var bom = this._getBom();
        if (!bom) { return; }

        BomActions.removeItems(
            bom.id || bom.cid,
            this.props.allSelectedBomItems.getItemIdsForBom(bom.id || bom.cid)
        );
    },

    _onExport: function(event) {
        var headers;
        var itemIds;
        var boms;
        var bom = this._getBom();
        if (!bom) { return null; }

        //Get the headers to export
        headers = this._getHeaders();

        //Get the items to export
        boms = [];
        boms.push(bom);
        boms = boms.concat(this.props.allBoms.getDescendantBomsOfBom( bom.id || bom.cid ));

        itemIds = [];
        _.each(boms, function(result) {
            result.getItems().each(function(item) {
                itemIds.push(item.id || item.cid);
            });
        });

        // Export!
        BomActions.exportItems(headers, itemIds);

        // Show export modal
        this.setState({
          isExportModalOpen: true
        });
    },

    _onCancelExport: function() {
        // Show export modal
        this.setState({
          isExportModalOpen: false
        });
    },

    _onDownloadExport: function() {
        // Show export modal
        this.setState({
          isExportModalOpen: false
        });
    },

    _getExportModal: function() {
        return (
          React.createElement(BomExportModal, {
            onCancel: this._onCancelExport, 
            onDownload: this._onDownloadExport}));
    },

});

module.exports = Bom;
