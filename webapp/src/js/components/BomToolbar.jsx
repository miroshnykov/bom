"use strict";

var AppDispatcher  = require("dispatcher/AppDispatcher");
var BomViewStore   = require("stores/BomViewStore");
var Button         = require("react-bootstrap").Button;
var ButtonToolbar  = require("react-bootstrap").ButtonToolbar;
var EditableLabel  = require("components/EditableLabel.jsx");
var FieldConstants = require("constants/FieldConstants");
var MenuItem       = require("react-bootstrap").MenuItem;
var Modal          = require("components/modals/Modal.jsx");
var React          = require("react");
var RfqModal       = require("components/modals/RfqModal.jsx");
var SplitButton    = require("react-bootstrap").SplitButton;
var UserStore      = require("stores/UserStore");

var BomToolbar = React.createClass({

    propTypes: {
        bom: React.PropTypes.object.isRequired,
        onRemoveItems: React.PropTypes.func.isRequired,
        onExport: React.PropTypes.func.isRequired,
        onShowHistory: React.PropTypes.func.isRequired,
        onShowComments: React.PropTypes.func.isRequired,
        onChangeView: React.PropTypes.func.isRequired,
        onSaveView: React.PropTypes.func.isRequired,
        onDeleteView: React.PropTypes.func.isRequired
    },

    getInitialState: function() {
        return {
            currentViewId: FieldConstants.FULL_FIELDSET,
            selectedItemCount: this.props.bom.getItems().getSelected().length
        };
    },

    componentDidMount: function() {
        this.props.bom.getItems().on("remove change:selectedAt", this.onChangeSelected);
        this.props.bom.getAttributes().on("add change:visible remove", this.onChangeAttributes);
    },

    componentWillUnmount: function() {
        this.props.bom.getItems().off("remove change:selectedAt", this.onChangeSelected);
        this.props.bom.getAttributes().off("add change:visible remove", this.onChangeAttributes);
    },

    componentWillReceiveProps: function(nextProps) {
        if (this.props.bom !== nextProps.bom) {
            this.props.bom.getItems().off("remove change:selectedAt", this.onChangeSelected);
            this.props.bom.getAttributes().off("add change:visible remove", this.onChangeAttributes);

            nextProps.bom.getItems().on("remove change:selectedAt", this.onChangeSelected);
            nextProps.bom.getAttributes().on("add change:visible remove", this.onChangeAttributes);

            this.setState({
                selectedItemCount: nextProps.bom.getItems().getSelected().length
            });
        }
    },

    onChangeSelected: function() {
        this.setState({
            selectedItemCount: this.props.bom.getItems().getSelected().length
        });
    },

    onChangeAttributes: function(model) {
        if (this.state.currentViewId !== FieldConstants.CUSTOM_FIELDSET && model.get("visible")) {
            this.onSelectView(FieldConstants.CUSTOM_FIELDSET);
        }
    },

    render: function() {
        var bom = this.props.bom;
        var items = bom.getItems();

        return (
            <div className="bom-toolbar">
                <div className="col-md-12">
                    {this.renderViewSelector()}
                    <div className="btn-toolbar">
                        <EditableLabel
                            className="h4 bom-name pull-left"
                            value={bom.get("name")}
                            onSave={this.onSaveBomName} />
                        <div className="btn-group">
                            <Button
                                title="View History"
                                bsStyle="primary"
                                onClick={this.props.onShowHistory}>
                                <span className="fa fa-history" aria-hidden="true"/>
                            </Button>
                            <Button
                                title="View Comments"
                                bsStyle="primary"
                                onClick={this.props.onShowComments}>
                                <span className="fa fa-comment" aria-hidden="true"/>
                            </Button>
                        </div>
                        <div className="btn-group">
                            <Button
                                title="Delete Items"
                                bsStyle="primary"
                                onClick={this.props.onRemoveItems}
                                disabled={this.isReadOnly() || !this.state.selectedItemCount}>
                                <span className="fa fa-trash" aria-hidden="true"/>
                            </Button>
                            <Button
                                title="Export"
                                bsStyle="primary"
                                onClick={this.props.onExport}
                                disabled={this.isReadOnly()}>
                                <span className="fa fa-file-archive-o" aria-hidden="true"/>
                            </Button>
                        </div>
                        <div className="btn-group">
                            <Button
                                title="Help Me Price This BoM"
                                bsStyle="primary"
                                onClick={this.onRequestQuote}>
                                <span className="fa fa-usd" aria-hidden="true"/>
                            </Button>
                            <Button
                                title="Help Me find a Contract Manufacturer"
                                bsStyle="primary"
                                onClick={this.onRequestCM}>
                                <span className="fa fa-industry" aria-hidden="true"/>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    },

    renderViewSelector: function() {
        var bom = this.props.bom;
        var view;
        var title;
        var saveViewBtn;
        var deleteViewBtn;
        var options;
        var savedViews;

        if (this.props.currentViewId === FieldConstants.CUSTOM_FIELDSET) {
            title = "Custom View";
            saveViewBtn = (
                <div className="btn-group">
                        <div className="btn btn-primary"
                            onClick={this.onSaveView}>
                            <span className="fa fa-pencil" aria-hidden="true"/>
                        </div>
                </div>);
        }
        else {
            view = BomViewStore.get(this.props.currentViewId);
            title = view.get("name");

            if (!view.get("default")) {
                saveViewBtn = (
                    <div className="btn-group">
                        <div className="btn btn-primary"
                            onClick={this.onSaveView.bind(this, this.props.currentViewId)}>
                            <span className="fa fa-pencil" aria-hidden="true"/>
                        </div>
                    </div>);
                deleteViewBtn = (
                    <div className="btn-group">
                        <div className="btn btn-danger"
                            onClick={this.onDeleteView.bind(this, this.props.currentViewId)}>
                            <span className="fa fa-remove" aria-hidden="true"/>
                        </div>
                    </div>);
            }
            else {
                title += " View";
            }
        }

        // Generate default views options
        options = BomViewStore.getDefaults().map(function(view) {
            return (
                <MenuItem
                    key={view.id || view.cid}
                    eventKey={view.id || view.cid}>{view.get("name") + " View"}</MenuItem>);
        });

        // Add the saved custom views (if any)
        savedViews = BomViewStore.getSaved();
        if (savedViews.length) {
            options.push(<MenuItem key="saved-divider" divider />);
            options = options.concat( savedViews.map(function(view) {
                return <MenuItem key={view.id || view.cid} eventKey={view.id || view.cid}>{view.get("name")}</MenuItem>
            }));
        }

        // If the top bom has visible columns, then add custom view option
        if (bom.hasVisibleAttributes()) {
            options.push(<MenuItem key="custom-divider" divider />);
            options.push(<MenuItem
                key={FieldConstants.CUSTOM_FIELDSET}
                eventKey={FieldConstants.CUSTOM_FIELDSET}>{"Custom"}</MenuItem>);
        }

        return (
            <div className="btn-toolbar pull-right">
                <SplitButton
                    bsStyle="default"
                    title={title}
                    onSelect={this.onSelectView}>
                    {options}
                </SplitButton>
                {saveViewBtn}
                {deleteViewBtn}
            </div>);
    },

    onSaveBomName: function(name) {
        var bom = this.props.bom;

        name = name || "";
        name = name.trim();

        if (name && bom.get("name") !== name) {
            bom.save({name: name});
        }
    },

    isReadOnly: function() {
        var bom = this.props.bom;
        return bom && bom.isStateSending();
    },

    onSelectView: function(id) {
        this.setState({ currentViewId: id });
        this.props.onChangeView(id);
    },

    onSaveView: function(id) {
        this.props.onSaveView(id);
    },

    onDeleteView: function(id) {
        this.props.onDeleteView(id);
    },

    onRequestQuote: function() {
        AppDispatcher.dispatch({
            action: {
                type: "show-modal"
            },
            modal: (<RfqModal bom={this.props.bom} />)
        });
    },

    onRequestCM: function() {
        AppDispatcher.dispatch({
            action: {
                type: "show-modal"
            },
            modal: (
                <Modal
                    title="Help Me Find a Contract Manufacturer"
                    saveLabel="Confirm"
                    dismissLabel="Cancel"
                    onConfirm={this.onConfirmCM}>
                    Someone from Fabule will review your BoM and help you find potential contract manufacturers. We will send a confirmation email and may then ask for more details.
                </Modal>)
        });
    },

    onConfirmCM: function() {
        var body =
            "payload={\"text\": \"User " + UserStore.current.get("email") +
            " requested help to find CMs on Bom: " + this.props.bom.get("name") + "(id=" + this.props.bom.id + ")\"}";
        $.post("https://hooks.slack.com/services/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",
            body
        ).fail(function(error) {
            console.log(error);
        });
    }
});

module.exports = BomToolbar;
