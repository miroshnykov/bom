"use strict";

var _ = require("underscore");
var React = require("react");
var Navigation = require("react-router").Navigation;
var State = require("react-router").State;
var Link = require("react-router").Link;
var backboneMixin = require("backbone-react-component");

var Button = require("react-bootstrap").Button;
var ButtonToolbar = require("react-bootstrap").ButtonToolbar;
var Glyphicon = require("react-bootstrap").Glyphicon;
var SplitButton = require("react-bootstrap").SplitButton;
var MenuItem = require("react-bootstrap").MenuItem;

var AppDispatcher = require("dispatcher/AppDispatcher");
var LocalStorage = require("utils/LocalStorage");
var Checkbox = require("components/forms/Checkbox.jsx");
var BomField = require("components/BomField.jsx");
var TextInput = require("components/TextInput.jsx");
var AddColumnModal = require("components/modals/AddColumn.jsx");
var EditColumnModal = require("components/modals/EditColumn.jsx");
var BomExportModal = require("components/modals/BomExport.jsx");
var SaveViewModal = require("components/modals/SaveView.jsx");
var BomToolbar = require("components/BomToolbar.jsx");
var Spinner = require("components/Spinner.jsx");
var FieldStore = require("stores/FieldStore");
var BomViewStore = require("stores/BomViewStore");
var BottomPanel = require("components/BottomPanel.jsx");
var BomItem = require("components/BomItem.jsx");

var BomActions = require("actions/BomActions");
var BomAttributeModel = require("models/BomAttributeModel");
var FieldConstants = require("constants/FieldConstants");
var Scroll = require("components/Scroll.jsx");
var BomItemToolbar = require("components/BomItemToolbar.jsx");

var cx = require("react/lib/cx");

var BOTTOM_PANEL_STORAGE_KEY = "settings:ui:is_bottom_panel_open";

var BomSpreadsheetTable = React.createClass({
    mixins: [Navigation, State],

    propTypes: {
        bom: React.PropTypes.object.isRequired,
        headers: React.PropTypes.array.isRequired,
        readonly: React.PropTypes.bool,
        isLoading: React.PropTypes.bool
    },

    componentDidMount: function() {
        this.props.bom.getItems().on("change:isApproved", this.onChange);
        this.props.bom.getItems().on("change:totalComments", this.onChange);
        this.props.bom.getItems().on("change:totalErrors", this.onChange);
        this.props.bom.getItems().on("change:totalWarnings", this.onChange);
    },

    componentWillReceiveProps: function(nextProps) {
        if (this.props.bom === nextProps.bom) { return; }

        this.props.bom.getItems().off("change:isApproved", this.onChange);
        this.props.bom.getItems().off("change:totalComments", this.onChange);
        this.props.bom.getItems().off("change:totalErrors", this.onChange);
        this.props.bom.getItems().off("change:totalWarnings", this.onChange);

        nextProps.bom.getItems().on("change:isApproved", this.onChange);
        nextProps.bom.getItems().on("change:totalComments", this.onChange);
        nextProps.bom.getItems().on("change:totalErrors", this.onChange);
        nextProps.bom.getItems().on("change:totalWarnings", this.onChange);
    },

    componentWillUnmount: function() {
        this.props.bom.getItems().off("change:isApproved", this.onChange);
        this.props.bom.getItems().off("change:totalComments", this.onChange);
        this.props.bom.getItems().off("change:totalErrors", this.onChange);
        this.props.bom.getItems().off("change:totalWarnings", this.onChange);
    },

    onChange: function() {
        this.forceUpdate();
    },

    render: function() {
        var bom = this.props.bom;
        var headers = this.props.headers;

        var commentCount = bom.getItems() ?
            bom.getItems().reduce(function(sum, item) {
                return sum + item.get("totalComments");
            }, 0) : 0;

        var warningCount = bom.getItems() ?
            bom.getItems().reduce(function(sum, item) {
                return sum + item.get("totalWarnings");
            }, 0) : 0;

        var errorCount = bom.getItems() ?
            bom.getItems().reduce(function(sum, item) {
                return sum + item.get("totalErrors");
            }, 0) : 0;

        var allApproved = !bom.getItems().isEmpty() && bom.getItems().every(function(item) {
            return item.get("isApproved");
        });

        return (
             <table className="table table-striped table-bordered table-condensed">
                <thead>
                    <tr>
                        <th className={cx({
                                "text-center": true,
                                "compact": true,
                                "readonly": this.props.readonly
                            })}>
                            <Checkbox checked={bom.getItems().areAllSelected()} onClick={this.onSelectAllItems} />
                        </th>
                        <th className="compact">
                            <BomItemToolbar comments={commentCount}
                                warnings={warningCount}
                                errors={errorCount}
                                isApproved={allApproved}
                                />
                        </th>
                        <th className={cx({
                                "text-center": true,
                                "compact": true,
                                "readonly": this.props.readonly
                            })}>
                            <span>#</span>
                        </th>
                        {headers.map(function(result, index) {
                            return <BomField
                                key={result.fieldId}
                                index={index}
                                header={result}
                                field={FieldStore.get(result.fieldId)}
                                onAddColumn={this.onClickAddColumn}
                                onEditColumn={this.onClickEditColumn}
                                readonly={this.props.readonly} />;
                        }, this)}
                    </tr>
                </thead>
                <tbody>
                    {bom.getItems().map(function(result, index) {
                        return <BomItem
                            key={result.id || result.cid}
                            item={result}
                            bom={bom}
                            headers={headers}
                            sequence={index+1}
                            readonly={this.props.readonly} />;
                    }, this)}
                    {this.renderLoadingStatus(headers.length+3)}
                </tbody>
            </table>
        );
    },

    renderLoadingStatus: function(cols) {
        if (!this.props.isLoading) { return null; }

        return (
            <tr>
                <td colSpan={cols}>
                    <Spinner className="spinner-dark pull-left" />
                </td>
            </tr>);
    },

    onSelectAllItems: function(select) {
        this.props.bom.getItems().each(function(item) {
            item.setSelected( select );
        });
    },

    // Columns

    onClickAddColumn: function(index) {
        var fieldOptions = FieldStore.map(function(field) {
            var attribute = this.props.bom.getAttributeForField(field.id || field.cid);

            var disabled = !!_.find(this.props.headers, function(result) {
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

        AppDispatcher.dispatch({
            action: {
                type: "show-modal"
            },
            modal: (
                <AddColumnModal
                    index={index}
                    onConfirm={this.onSaveAddColumn}
                    fields={fieldOptions} />)
        });
    },

    onSaveAddColumn: function(fieldId, typeId, name, index) {
        var bom = this.props.bom;
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

        //pluck ids for the columns that have them, keep the object if not
        attributes = this.props.headers.map(function(result) {
            //return result.id ? result.id : result;
            return result.attribute ? result.attribute.id || result.attribute.cid : result;
        });

        //replace the attribute
        attributes.splice(index, 0, newAttribute);

        BomActions.setVisibleAttributes({bomId: bom.id || bom.cid, columns: attributes});
    },

    onClickEditColumn: function(index) {
        var editColumn = this.props.headers[ index ];
        var editField = FieldStore.get( editColumn.fieldId );

        var fieldOptions = FieldStore.map(function(field) {
            var attribute = this.props.bom.getAttributes().find(function(result) {
                return result.fieldId === field.id || result.fieldId === field.cid;
            });

            //TODO enable attribute we are editing
            var disabled = !!_.find(this.props.headers, function(result) {
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

        AppDispatcher.dispatch({
            action: {
                type: "show-modal"
            },
            modal: (
                <EditColumnModal
                    index={index}
                    column={editColumn}
                    typeId={editField.get("typeId")}
                    onConfirm={this.onSaveEditColumn}
                    onHide={this.onHideColumn}
                    fields={fieldOptions} />)
        });
    },

    onSaveEditColumn: function(fieldId, typeId, name, index, attributeId) {
        var bom = this.props.bom;
        var attribute = bom.getAttribute(attributeId);
        var headers = this.props.headers;
        var attributes;
        var prevHeader;

        //if we're updating an existing attribute, check if we're only changing its name
        if (attribute && attribute.get("fieldId") === fieldId) {

            if (attribute.get("name") === name) { return; }

            BomActions.setAttribute({
                bomdId: bom.id || bom.cid,
                attribute: {
                    id: attributeId,
                    name: name
                }
            });
        }
        //else we are hiding the existing and creating/updating the new attribute
        else {
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

            BomActions.setVisibleAttributes({bomId: bom.id || bom.cid, columns: attributes});
        }
    },

    onHideColumn: function(index) {
        var bom = this.props.bom;
        var attributes;
        var headers = this.props.headers.map(_.clone);

        //remove the column
        headers.splice(index, 1);

        //pluck the ids of the columns that don't change, leave objects for the rest
        attributes = headers.map(function(result) {
            //return result.id ? result.id : result;
            return result.attribute ? result.attribute.id || result.attribute.cid : result;
        });

        BomActions.setVisibleAttributes({bomId: bom.id || bom.cid, columns: attributes});
    }
});

module.exports = BomSpreadsheetTable;
