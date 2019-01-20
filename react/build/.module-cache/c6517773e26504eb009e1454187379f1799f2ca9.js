var React = require("react");
var Navigation = require("react-router").Navigation;
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

var ComponentActions = require("../actions/ComponentActions");
var BomActions = require("../actions/BomActions");
var ProductActions = require("../actions/ProductActions");

var FieldConstants = require("../constants/FieldConstants");

var Bom = React.createClass({displayName: "Bom",
    mixins: [Navigation],

    propTypes: {
        allProducts: React.PropTypes.object.isRequired,
        allBoms: React.PropTypes.object.isRequired,
        allSelectedBomItems: React.PropTypes.object.isRequired,
        //allComponents: React.PropTypes.object.isRequired,
        allFields: React.PropTypes.object.isRequired,
        allTypes: React.PropTypes.object.isRequired
    },

    getInitialState: function() {
        var bom;
        var fieldSetId;

        bom = this._getBom(this.props);
        fieldSetId = bom && bom.hasVisibleColumns() ? FieldConstants.CUSTOM_FIELDSET : FieldConstants.FULL_FIELDSET;

        return {
            isAddColumnModalOpen: false,
            isEditColumnModalOpen: false,
            isExportModalOpen: false,
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

        this._validateBom(nextProps);

        // If we are showing custom view, make sure the BoM has visible columns
        if (this.state.fieldSetId === FieldConstants.CUSTOM_FIELDSET) {
            bom = this._getBom(nextProps);
            if (!bom.hasVisibleColumns()) {
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
        }
        // If the bom does not exists, try to redirect to the product
        else if ( !bom ) {
            this.replaceWith("product", {productId: product.id || product.cid});
        }
        // Redirect if bomId is present as parameter but doesn't match
        // This is used to redirect a client id to its permanent id
        else if ( props.params.bomId && bom.id && bom.id !== +props.params.bomId ) {
            this.replaceWith("bom", {
                productId: product.id || product.cid,
                bomId: bom.id});
        }
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
        var fields = this._getColumnsForFieldSet( this.state.fieldSetId );
        var childBoms;
        var boms;
        var breadcrumbs;
        var deleteBtn;
        var fieldSet;
        var fieldSetOptions;
        var fieldSetTitle;
        var addColumnModal;
        var editColumnModal;
        var exportModal;
        var fieldsForAdd;
        var readonly;

        //if BoM is syncing, make it readonly
        //TODO: we only need this until we implement saving parts of the BoM independently
        readonly = bom.isSyncing();

        //get the BoMs to display
        boms = [];
        boms.push(bom);
        boms = boms.concat(this.props.allBoms.getDescendantBomsOfBom( bom.id || bom.cid ));

        //generate the breadcrumbs
        //TODO (only shows active Product or Bom name for now)
        breadcrumbs = product.get("bomId") === (bom.id || bom.cid) ?
          product.get("name") : bom.get("name");

        if (this.state.fieldSetId) {
            fieldSet = _.find(FieldConstants.FIELDSETS, function(result) {
                return result.id === this.state.fieldSetId;
            }, this);
        }

        fieldSetTitle = fieldSet ? fieldSet.name : "Custom View";

        //generate the preset options
        fieldSetOptions = FieldConstants.FIELDSETS.map(function(result) {
            return (React.createElement(MenuItem, {
                key: result.id, 
                eventKey: result.id}, result.name));
        });

        // If the top bom has visible columns, then add custom view option
        if (bom.hasVisibleColumns()) {
            fieldSetOptions.push(React.createElement(MenuItem, {key: "custom-divider", divider: true}));
            fieldSetOptions.push(React.createElement(MenuItem, {
                key: FieldConstants.CUSTOM_FIELDSET, 
                eventKey: FieldConstants.CUSTOM_FIELDSET}, "Custom View"));
        }

        // delete button
        if (!this.props.params.bomId) {
            deleteBtn = (
                React.createElement(Button, {
                    bsStyle: "danger", 
                    bsSize: "small", 
                    onClick: this._onDeleteProduct}, 
                    "Delete Product")
                );
        }
        else {
            deleteBtn = (
                React.createElement(Button, {
                    bsStyle: "danger", 
                    bsSize: "small", 
                    onClick: this._onDeleteBom}, 
                    "Delete BoM")
                );
        }

        // add column modal
        if (this.state.isAddColumnModalOpen) {
          addColumnModal = this._getAddColumnModal(bom, fields);
        }
        // edit column modal
        else if (this.state.isEditColumnModalOpen) {
          editColumnModal = this._getEditColumnModal(bom, fields);
        }
        // bom export modal
        else if (this.state.isExportModalOpen) {
          exportModal = this._getExportModal();
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
                                React.createElement(Button, {
                                    bsStyle: "primary", 
                                    onClick: this._onImport}, 
                                    React.createElement(Glyphicon, {glyph: "save"})
                                ), 
                                React.createElement(Button, {
                                    bsStyle: "primary", 
                                    onClick: this._onExport}, 
                                    React.createElement(Glyphicon, {glyph: "open"})
                                )
                            ), 
                            React.createElement(SplitButton, {
                                bsStyle: "default", 
                                title: fieldSetTitle, 
                                onSelect: this._onSelectView}, 
                                fieldSetOptions
                            )
                        )
                    ), 
                    React.createElement("div", null, 
                        React.createElement(Table, {striped: true, bordered: true, condensed: true, hover: true}, 
                            React.createElement("thead", null, 
                                React.createElement("tr", null, 
                                    fields.map(function(result, index) {
                                        return React.createElement(BomField, {
                                            key: result ? result.fieldId : "new", 
                                            index: index, 
                                            attribute: result, 
                                            field: this.props.allFields.get(result.fieldId), 
                                            onAddColumn: this._onClickAddColumn, 
                                            onEditColumn: this._onClickEditColumn, 
                                            readonly: readonly});
                                    }, this)
                                )
                            ), 
                            boms.map(function(result) {
                                return React.createElement(BomSection, {
                                    key: result.id || result.cid, 
                                    bom: result, 
                                    fields: fields, 
                                    allFields: allFields, 
                                    selectedIds: this.props.allSelectedBomItems.getItemIdsForBom(result.id || result.cid), 
                                    readonly: result.isSyncing()});
                            }, this)
                        ), 
                        React.createElement(ButtonToolbar, null, 
                            deleteBtn
                        )
                    ), 
                    addColumnModal, 
                    editColumnModal, 
                    exportModal
                )
            )
        );
    },

    // Products

    _onDeleteProduct: function() {
        var product = this._getProduct();

        if (confirm("Are you sure you want to permanently delete this product?")) {
            //TODO unselect only selected items for the product we are deleting
            BomActions.unselectItems();
            ProductActions.destroy(product.id || product.cid);
            this.transitionTo("dashboard");
        }
    },

    // Boms

    _onDeleteBom: function() {
        var product = this._getProduct();
        var rootBomId = product.get("bomId");
        var bom = this._getBom();

        //if we're trying to delete the root BoM of the product, delete the product
        if (rootBomId === bom.id || rootBomId === bom.cid) {
            this._onDeleteProduct();
            return;
        }

        if (confirm("Are you sure you want to permanemtly delete this BoM?")) {
            //TODO unselect only selected items for the bom we are deleting
            BomActions.unselectItems();
            BomActions.destroy(bom.id || bom.cid);
            this.transitionTo("product", {productId: product.id || product.cid});
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
        var columns = this._getColumnsForFieldSet( this.state.fieldSetId );
        var column;

        this.setState({
            isAddColumnModalOpen: false
        });

        column = columns[index];

        //pluck ids for the columns that have them, keep the object if not
        columns = columns.map(function(result) {
            return result.id || result.cid ? result.id || result.cid : result;
        });

        //replace the column
        if (fieldId) {
            columns.splice(index, 0, {
                fieldId: fieldId,
                name: name
            });
        }
        else {
            columns.splice(index, 0, {
                typeId: typeId,
                name: name
            });
        }

        BomActions.setVisibleColumns(bom.id || bom.cid, columns);

        if (this.state.fieldSetId !== FieldConstants.CUSTOM_FIELDSET) {
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

    _onSaveEditColumn: function(fieldId, typeId, name, index, columnId) {
        var bom = this._getBom();
        var column = bom.getColumn(columnId);

        var columns;

        this.setState({
            isEditColumnModalOpen: false
        });

        //if we're updating an existing column, check if we're only changing its name
        if (column && column.fieldId === fieldId) {
            BomActions.setColumn(bom.id || bom.cid, {
                id: columnId,
                fieldId: fieldId,
                name: name
            });
        }
        else {
            //get column ids for the current view
            columns = this._getColumnsForFieldSet( this.state.fieldSetId );

            column = columns[index];

            //pluck ids for the columns that have then, keep the object if not
            columns = columns.map(function(result) {
                return result.id || result.cid ? result.id || result.cid : result;
            });

            //replace the column
            if (fieldId) {
                columns[index] = {
                    fieldId: fieldId,
                    name: name
                };
            }
            else {
                columns[index] = {
                    typeId: typeId,
                    name: name
                };
            }

            BomActions.setVisibleColumns(bom.id || bom.cid, columns);

            if (column.fieldId != fieldId) {
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

    _onRemoveColumn: function(index) {
        var bom = this._getBom();
        var columns;

        this.setState({
            isEditColumnModalOpen: false,
        });

        //get column ids for the current view
        columns = this._getColumnsForFieldSet( this.state.fieldSetId );

        //if current view is custom, only need to remove the column
        if (this.state.fieldSetId === FieldConstants.CUSTOM_FIELDSET) {
            BomActions.removeColumn(bom.id || bom.cid, columns[index].id || columns[index].cid);
        }
        //but if another view, then we need to set and update the custom view
        else {
            //remove the column
            columns.splice(index, 1);

            //pluck the ids of the columns that don't change, leave objects for the rest
            columns = columns.map(function(result) {
                return result.id || result.cid ? result.id || result.cid : result;
            });

            BomActions.setVisibleColumns(bom.id || bom.cid, columns);

            this.setState({
                fieldSetId: FieldConstants.CUSTOM_FIELDSET
            });
        }
    },

    _onSelectView: function(id) {
        // var fieldSet = _.find(this.state.fieldSets, function(result) {
        //   return id === result.id || result.cid;
        // });
        // if (!fieldSet) { return; }

        this.setState({
            fieldSetId: id
        });
    },

    _getAddColumnModal: function(bom, fields) {
        var fieldOptions = this.props.allFields.map(function(field) {
            var column = bom.getColumnForField(field.id || field.cid);

            var disabled = !!_.find(fields, function(result) {
                return result.fieldId === field.id || result.fieldId === field.cid;
            });

            return {
                id: field.id || field.cid,
                name: column ? column.name : field.get("name"),
                typeId: field.get("typeId"),
                disabled: disabled
            };
        }, this);

        return (
            React.createElement(AddColumnModal, {
                index: this.state.addColumnIndex, 
                onCancel: this._onCancelAddColumn, 
                onSave: this._onSaveAddColumn, 
                fields: fieldOptions, 
                allTypes: this.props.allTypes}));
    },

    _getEditColumnModal: function(bom, fields) {
        var editColumn = fields[ this.state.editColumnIndex ];
        var editField = this.props.allFields.get( editColumn.fieldId );

        var fieldOptions = this.props.allFields.map(function(field) {
            var column = _.find(bom.getColumns(), function(result) {
                return result.fieldId === field.id || result.fieldId === field.cid;
            });

            //TODO okay to enable column we are editing
            var disabled = !!_.find(fields, function(visibleField) {
                return visibleField.fieldId === field.id || visibleField.fieldId === field.cid;
            });

            return {
                id: field.id || field.cid,
                name: column ? column.name : field.get("name"),
                typeId: field.get("typeId"),
                disabled: disabled
            };
        }, this);

        return (
            React.createElement(EditColumnModal, {
                index: this.state.editColumnIndex, 
                column: editColumn, 
                typeId: editField.get("typeId"), 
                onCancel: this._onCancelEditColumn, 
                onSave: this._onSaveEditColumn, 
                onRemove: this._onRemoveColumn, 
                fields: fieldOptions, 
                allTypes: this.props.allTypes}));
    },

    //TODO move this to the BomStore...
    _getColumnsForFieldSet: function(fieldSetId) {
        var bom = this._getBom();
        var fields;
        var fieldSet;
        var bomFields;

        if (fieldSetId === FieldConstants.CUSTOM_FIELDSET) {
            fields = bom.getVisibleColumns();
        }
        else {
            fieldSet = _.find(FieldConstants.FIELDSETS, function(result) {
                return fieldSetId === result.id || fieldSetId === result.cid;
            });

            fields = [];

            _.each( fieldSet.fieldIds, function(result) {
                var bomField = bom.getColumnForField( result );

                var field;
                if (!bomField) {
                    field = this.props.allFields.get( result );
                    if (field) {
                        bomField = {
                            id: undefined,
                            fieldId: result,
                            name: field.get("name")
                        }
                    }
                }

                if (bomField) {
                    fields.push(bomField);
                }
            }, this);

            //for the full view, add custom fields at the end
            if (fieldSetId === FieldConstants.FULL_FIELDSET) {
                // get all existing columns from the bom
                bomFields = bom.getColumns().map(_.clone);

                //add any field that is not in the fieldset
                _.each(bomFields, function(result) {
                    if (!_.contains(fieldSet.fieldIds, result.fieldId)) {
                        fields.push(result);
                    }
                })
            }
        }

        return fields;
    },

    _onImport: function(event) {
        var product = this._getProduct();
        var bom = this._getBom();

        this.transitionTo("productImport", {
            productId: product.id || product.cid
        });
    },

    _onRemoveItems: function(event) {
        BomActions.removeItems(this.props.allSelectedBomItems.toJSON());
    },

    _onExport: function(event) {
        var attributes;
        var itemIds;
        var boms;
        var bom = this._getBom();
        if (!bom) { return null; }

        //Get the attributes to export
        attributes = this._getColumnsForFieldSet( this.state.fieldSetId );
        attributes = attributes.map(function(result) {
            return {
                name: result.name,
                fieldId: result.fieldId
            };
        });

        //Get the items to export
        boms = [];
        boms.push(bom);
        boms = boms.concat(this.props.allBoms.getDescendantBomsOfBom( bom.id || bom.cid ));

        itemIds = [];
        _.each(boms, function(result) {
            itemIds = itemIds.concat( result.getItems() );
        });

        itemIds = itemIds.map(function(result) {
            return result.id || result.cid;
        });

        // Export!
        BomActions.exportItems(attributes, itemIds);

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
