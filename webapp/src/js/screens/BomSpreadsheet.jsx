"use strict";

var _ = require("underscore");
var React = require("react");
var Navigation = require("react-router").Navigation;
var State = require("react-router").State;

var LocalStorage = require("utils/LocalStorage");
var BomExportModal = require("components/modals/BomExport.jsx");
var SaveViewModal = require("components/modals/SaveView.jsx");
var Modal = require("components/modals/Modal.jsx");
var BomToolbar = require("components/BomToolbar.jsx");
var FieldStore = require("stores/FieldStore");
var BomViewStore = require("stores/BomViewStore");
var BottomPanel = require("components/BottomPanel.jsx");
var BomSpreadsheetTable = require("components/BomSpreadsheetTable.jsx");

var AppDispatcher = require("dispatcher/AppDispatcher");
var BomActions = require("actions/BomActions");
var BomViewActions = require("actions/BomViewActions");
var FieldConstants = require("constants/FieldConstants");
var Scroll = require("components/Scroll.jsx");
var Spinner = require("components/Spinner.jsx");

var cx = require("react/lib/cx");

var BOTTOM_PANEL_STORAGE_KEY = "settings:ui:is_bottom_panel_open";

var BomSpreadsheet = React.createClass({
    mixins: [Navigation, State],

    propTypes: {
        bom: React.PropTypes.object.isRequired
    },

    getInitialState: function() {
        return {
            currentViewId: this.props.bom.hasVisibleAttributes() ? FieldConstants.CUSTOM_FIELDSET : FieldConstants.FULL_FIELDSET,
            bottomPanelOpen: LocalStorage.get(BOTTOM_PANEL_STORAGE_KEY, {defaultValue: true}),
            readonly: false,
            isLoading: false,
            isAdding: false
        };
    },

    componentDidMount: function() {
        this.props.bom.on("change:state", this.onChangeBom);
        this.props.bom.getAttributes().on("change:state", this.onChangeAttributes);
        this.init();
    },

    componentWillUnmount: function() {
        this.props.bom.off("change:state", this.onChangeBom);
        this.props.bom.getAttributes().off("change:state", this.onChangeAttributes);
    },

    componentWillReceiveProps: function(nextProps) {
        if (this.props.bom !== nextProps.bom) {
            this.props.bom.off("change:state", this.onChangeBom);
            this.props.bom.getAttributes().off("change:state", this.onChangeAttributes);

            nextProps.bom.on("change:state", this.onChangeBom);
            nextProps.bom.getAttributes().on("change:state", this.onChangeAttributes);

            this.init(nextProps.bom);
        }

        // Switch to full view if new bom doesn't have visible columns
        if (this.state.currentViewId === FieldConstants.CUSTOM_FIELDSET && !nextProps.bom.hasVisibleAttributes()) {
            this.onChangeView( FieldConstants.FULL_FIELDSET );
        }
    },

    init: function(bom) {
        bom = bom || this.props.bom;
        if (bom.isStateSending() || bom.isLoaded() ) { return; }

        this.setState({
            isLoading: true
        });

        bom.fetch().then(function() {
            this.setState({
                isLoading: false
            });
        }.bind(this), function(error){
            this.setState({
                isLoading: false
            });
        });
    },

    onChangeBom: function(bom) {
        this.setState({
            readonly: bom.isStateSending() || bom.getAttributes().isStateSending()
        });
    },

    onChangeAttributes: function(attributes) {
        this.setState({
            readonly: this.props.bom.isStateSending() || attributes.isStateSending()
        });
    },

    render: function() {
        var bom = this.props.bom;

        return (
            <div className={cx({
                    "bom-spreadsheet": true,
                    "bom-spreadsheet-short": this.state.bottomPanelOpen,
                    "bom-spreadsheet-tall": !this.state.bottomPanelOpen
                })}>
                <BomToolbar
                    bom={bom}
                    currentViewId={this.state.currentViewId}
                    onRemoveItems={this.onRemoveItems}
                    onExport={this.onExport}
                    onShowHistory={this.onShowHistory}
                    onShowComments={this.onShowComments}
                    onChangeView={this.onChangeView}
                    onSaveView={this.onClickSaveView}
                    onDeleteView={this.onClickDeleteView} />
                <Scroll>
                    <div className="row">
                        <BomSpreadsheetTable
                            bom={bom}
                            headers={this.getHeaders()}
                            readonly={bom.isStateSending()}
                            isLoading={this.state.isLoading} />
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <button className="btn btn-primary" onClick={this.onAddItem} disabled={this.state.readonly || this.state.isAdding}>
                                {this.state.isAdding ? (<Spinner />) : (<span className="fa fa-plus"></span>)}
                            </button>
                            <button className="btn btn-danger pull-right" onClick={this.onDeleteBom} disabled={bom.isStateSending()}>
                                Delete this BoM
                            </button>
                        </div>
                    </div>
                </Scroll>
                <BottomPanel
                    bom={bom}
                    collection={bom.getItems()}
                    open={this.state.bottomPanelOpen}
                    onOpen={this.onOpenBottomPanel}
                    onClose={this.onCloseBottomPanel} />
            </div>
        );
    },

    getHeaders: function() {
        var bom = this.props.bom;
        var headers;
        var view;

        if (this.state.currentViewId === FieldConstants.CUSTOM_FIELDSET) {
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
            view = BomViewStore.get( this.state.currentViewId );
            if (!view) { return headers; }

            _.each( view.get("fieldIds"), function(result) {
                var attribute = bom.getAttributeForField( result );
                var header;
                var field;

                if (!attribute) {
                    field = FieldStore.get( result );
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
            if (this.state.currentViewId === FieldConstants.FULL_FIELDSET) {
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

    onShowHistory: function() {
        this.transitionTo("bomHistory", this.getParams());
    },

    onShowComments: function() {
        this.transitionTo("bomComments", this.getParams());
    },

    // Bottom Panel

    onOpenBottomPanel: function() {
        LocalStorage.set(BOTTOM_PANEL_STORAGE_KEY, true);
        this.setState({
            bottomPanelOpen: true
        });
    },

    onCloseBottomPanel: function() {
        LocalStorage.set(BOTTOM_PANEL_STORAGE_KEY, false);
        this.setState({
            bottomPanelOpen: false
        });
    },

    // Bom Views

    onChangeView: function(id) {
        this.setState({ currentViewId: id });
    },

    onClickSaveView: function(id) {
        AppDispatcher.dispatch({
            action: {
                type: "show-modal"
            },
            modal: (<SaveViewModal
                onConfirm={this.onSaveView}
                columns={this.getHeaders()}
                view={BomViewStore.get(id)} />)
        });
    },

    onSaveView: function(name, fieldIds, viewId) {
        if (viewId) {
            BomViewActions
                .update(viewId, {name: name, fieldIds: fieldIds})
                .then(function(view) {
                    this.setState({
                        currentViewId: view.id || view.cid
                    });
                }.bind(this), function(error) {
                    console.error(error);
                }.bind(this));
        }
        else {
            BomViewActions
                .create({name: name, fieldIds: fieldIds})
                .then(function(view) {
                    this.setState({
                        currentViewId: view.id || view.cid
                    });
                }.bind(this), function(error) {
                    console.error(error);
                }.bind(this));
        }
    },

    onClickDeleteView: function(id) {
        var view = BomViewStore.get(id);

        AppDispatcher.dispatch({
            action: {
                type: "show-modal"
            },
            modal: (
                <Modal
                    title="Delete View"
                    saveLabel="Delete"
                    dismissLabel="Cancel"
                    onConfirm={this.onDeleteView.bind(this, id)}>
                    {"Are you sure you want to delete view " + view.get("name") + "?"}
                </Modal>)
        });
    },

    onDeleteView: function(id) {
        var currentViewId = this.props.bom.hasVisibleAttributes() ?
            FieldConstants.CUSTOM_FIELDSET : FieldConstants.FULL_FIELDSET;

        this.setState({
            currentViewId: currentViewId
        });

        BomViewActions
            .destroy({viewId: id})
            .then(undefined, function(error) {
                // TODO user feedback
                console.error(error);
                this.setState({
                    currentViewId: id
                });
            }.bind(this));
    },

    // Items

    onAddItem: function(event) {
        this.setState({
            isAdding: true
        });

        this.props.bom.getItems().add({}).save().then(function(item) {
            this.setState({
                isAdding: false
            });
        }.bind(this), function(error) {
            this.setState({
                isAdding: false
            });
        }.bind(this));
    },

    onRemoveItems: function(event) {
        if (!this.props.bom.getItems().isAnySelected()) { return; }
        this.props.bom.getItems().destroy( this.props.bom.getItems().getSelected() );
        this.forceUpdate();
    },

    // Export

    onExport: function(event) {
        var bom = this.props.bom;
        var headers = this.getHeaders();

        var items = bom.getItems();
        items = items.isAnySelected() ? items.getSelected() : items.models;
        items = _.pluck(items, "id");

        BomActions.exportItems({attributes: headers, itemIds: items});

        AppDispatcher.dispatch({
            action: {
                type: "show-modal"
            },
            modal: (<BomExportModal />)
        });
    },

    onDeleteBom: function() {
        AppDispatcher.dispatch({
            action: {
                type: "show-modal"
            },
            modal: (
                <Modal
                    title="Delete BoM"
                    saveLabel="Confirm"
                    dismissLabel="Cancel"
                    onConfirm={this.onConfirmDeletion}>
                    Are you sure you want to delete this BoM?
                </Modal>)
        });
    },

    onConfirmDeletion: function() {
        var bom = this.props.bom;
        BomActions.destroy({bomId: bom.id || bom.cid});
    }
});

module.exports = BomSpreadsheet;
