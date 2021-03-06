"use strict";

var _ = require("underscore");
var React = require("react");
var RouteHandler = require("react-router").RouteHandler;

var Header = require("../components/Header.react");
var LeftPanel = require("../components/LeftPanel.react");
var BottomPanel = require("../components/BottomPanel.react");
var SessionTimeoutModal = require("../components/SessionTimeoutModal.react");

var ProductStore = require("../stores/ProductStore");
var BomStore = require("../stores/BomStore");
var BomImportStore = require("../stores/BomImportStore");
var SelectedBomItemStore = require("../stores/SelectedBomItemStore");
var UserStore = require("../stores/UserStore");
var ChangeStore = require("../stores/ChangeStore");
var FieldStore = require("../stores/FieldStore");
var FieldTypeStore = require("../stores/FieldTypeStore");
var CompanyStore = require("../stores/CompanyStore");
var BomViewStore = require("../stores/BomViewStore");

var UserActions = require("../actions/UserActions");
var ProductActions = require("../actions/ProductActions");
var BomActions = require("../actions/BomActions");
var FieldActions = require("../actions/FieldActions");
var TypeActions = require("../actions/TypeActions");
var CompanyActions = require("../actions/CompanyActions");
var ChangeActions = require("../actions/ChangeActions");
var BomViewActions = require("../actions/BomViewActions");

var cx = require("react/lib/cx");

function getState() {
    return {
        user: UserStore,
        allCompanies: CompanyStore,
        allProducts: ProductStore,
        allBoms: BomStore,
        allSelectedBomItems: SelectedBomItemStore,
        allChanges: ChangeStore,
        allFields: FieldStore,
        allTypes: FieldTypeStore,
        allImportBoms: BomImportStore,
        allViews: BomViewStore
    };
}

var BomManager = React.createClass({displayName: "BomManager",

    getInitialState: function() {
        return _.extend(getState(), {
            initialized: false,
            isSessionTimeoutModalOpen: false,
            sidePanelOpen: true,
            bottomPanelOpen: false
        });
    },

    componentDidMount: function() {
        UserActions.init().then(function(user) {
            var company;

            if (CompanyStore.length > 0) {
                company = CompanyStore.first();
                CompanyActions.select(company.id);
                return company;
            } else {
                return Promise.reject(new Error("User is not linked to a company."));
            }

        }).then(function(company) {

            // clean up initial data
            // TODO this should happend in a store
            company.unset("data");
            return company;

        }).then(function(company) {

            //success
            ProductStore.on("add add:comments", this._onAdd);
            ProductStore.on("change change:comments", this._onChange);
            ProductStore.on("remove remove:comments", this._onRemove);
            ProductStore.on("reset reset:comments", this._onReset);
            ProductStore.on("request request:comments", this._onRequest);
            ProductStore.on("sync sync:comments", this._onSync);
            ProductStore.on("update", this._onUpdate);

            BomStore.on("add add:items add:attributes add:values add:comments", this._onAdd);
            BomStore.on("change change:items change:attributes change:values change:comments", this._onChange);
            BomStore.on("remove remove:items remove:attributes remove:values remove:comments", this._onRemove);
            BomStore.on("reset reset:items reset:attributes reset:values reset:comments", this._onReset);
            BomStore.on("request request:items request:attributes request:values request:comments", this._onRequest);
            BomStore.on("sync sync:items sync:attributes sync:values sync:comments", this._onSync);
            BomStore.on("update update:items", this._onUpdate);

            SelectedBomItemStore.on("add", this._onAdd);
            SelectedBomItemStore.on("change", this._onChange);
            SelectedBomItemStore.on("remove", this._onRemove);
            SelectedBomItemStore.on("reset", this._onReset);
            SelectedBomItemStore.on("request", this._onRequest);
            SelectedBomItemStore.on("sync", this._onSync);

            UserStore.on("add", this._onAdd);
            UserStore.on("change", this._onChange);
            UserStore.on("remove", this._onRemove);
            UserStore.on("reset", this._onReset);
            UserStore.on("request", this._onRequest);
            UserStore.on("sync", this._onSync);
            UserStore.on("validate", this._onValidate);

            ChangeStore.on("add", this._onAdd);
            ChangeStore.on("change", this._onChange);
            ChangeStore.on("remove", this._onRemove);
            ChangeStore.on("reset", this._onReset);

            FieldStore.on("add", this._onAdd);
            FieldStore.on("change", this._onChange);
            FieldStore.on("remove", this._onRemove);
            FieldStore.on("reset", this._onReset);

            FieldTypeStore.on("add", this._onAdd);
            FieldTypeStore.on("change", this._onChange);
            FieldTypeStore.on("remove", this._onRemove);
            FieldTypeStore.on("reset", this._onReset);

            BomImportStore.on("add", this._onAdd);
            BomImportStore.on("change", this._onChange);
            BomImportStore.on("remove", this._onRemove);
            BomImportStore.on("reset", this._onReset);

            BomViewStore.on("add", this._onAdd);
            BomViewStore.on("change", this._onChange);
            BomViewStore.on("remove", this._onRemove);
            BomViewStore.on("reset", this._onReset);
            BomViewStore.on("sync", this._onSync);

            $(window).on("beforeunload", function(){
                if (ChangeStore.getQueueLength()) {
                    return "You have unsaved changes that will be lost if you leave now. Are you sure you want to leave?";
                }
            });

            $(window).on("resize", function(){
                this.forceUpdate();
            }.bind(this));

            this.setState({
                initialized: true
            });

        }.bind(this)).then(undefined, function(error) {
            console.log(error);
            this.setState({
                isSessionTimeoutModalOpen: true
            });
        }.bind(this));
    },

    componentWillUnmount: function() {

        ProductStore.off("add add:comments", this._onAdd);
        ProductStore.off("change change:comments", this._onChange);
        ProductStore.off("remove remove:comments", this._onRemove);
        ProductStore.off("reset reset:comments", this._onReset);
        ProductStore.off("request request:comments", this._onRequest);
        ProductStore.off("sync sync:comments", this._onSync);
        ProductStore.off("update", this._onUpdate);

        BomStore.off("add add:items add:attributes add:values add:comments", this._onAdd);
        BomStore.off("change change:items change:attributes change:values change:comments", this._onChange);
        BomStore.off("remove remove:items remove:attributes remove:values remove:comments", this._onRemove);
        BomStore.off("reset reset:items reset:attributes reset:values reset:comments", this._onReset);
        BomStore.off("request request:items request:attributes request:values request:comments", this._onRequest);
        BomStore.off("sync sync:items sync:attributes sync:values sync:comments", this._onSync);
        BomStore.off("update update:items", this._onUpdate);

        SelectedBomItemStore.off("add", this._onAdd);
        SelectedBomItemStore.off("change", this._onChange);
        SelectedBomItemStore.off("remove", this._onRemove);
        SelectedBomItemStore.off("reset", this._onReset);
        SelectedBomItemStore.off("request", this._onRequest);
        SelectedBomItemStore.off("sync", this._onSync);

        UserStore.off("add", this._onAdd);
        UserStore.off("change", this._onChange);
        UserStore.off("remove", this._onRemove);
        UserStore.off("reset", this._onReset);
        UserStore.off("request", this._onRequest);
        UserStore.off("sync", this._onSync);
        UserStore.off("validate", this._onValidate);

        ChangeStore.off("add", this._onAdd);
        ChangeStore.off("change", this._onChange);
        ChangeStore.off("remove", this._onRemove);
        ChangeStore.off("reset", this._onReset);

        FieldStore.off("add", this._onAdd);
        FieldStore.off("change", this._onChange);
        FieldStore.off("remove", this._onRemove);
        FieldStore.off("reset", this._onReset);

        FieldTypeStore.off("add", this._onAdd);
        FieldTypeStore.off("change", this._onChange);
        FieldTypeStore.off("remove", this._onRemove);
        FieldTypeStore.off("reset", this._onReset);

        BomImportStore.off("add", this._onAdd);
        BomImportStore.off("change", this._onChange);
        BomImportStore.off("remove", this._onRemove);
        BomImportStore.off("reset", this._onReset);

        BomViewStore.off("add", this._onAdd);
        BomViewStore.off("change", this._onChange);
        BomViewStore.off("remove", this._onRemove);
        BomViewStore.off("reset", this._onReset);
        BomViewStore.off("sync", this._onSync);
    },

    render: function() {
        var isConnected = this.state.allChanges.isConnected();
        var sessionTimeoutModal;

        // add session timeout modal
        if (this.state.isSessionTimeoutModalOpen || !isConnected) {
            sessionTimeoutModal = (React.createElement(SessionTimeoutModal, null));
        }

        if (!this.state.initialized) {
            return (React.createElement("div", {className: "container-fluid bom-manager"}, 
                    React.createElement(Header, null), 
                    React.createElement("div", {className: "center-panel col-md-12"}, 
                        React.createElement("div", {className: "loader"}, 
                            React.createElement("div", null, "Loading... ", React.createElement("span", {className: "glyphicon glyphicon-refresh glyphicon-spin", "aria-hidden": "true"}))
                        )
                    ), 
                    sessionTimeoutModal
                ));
        }

        return (
            React.createElement("div", {className: "container-fluid bom-manager"}, 
                React.createElement(Header, {
                    user: this.state.user, 
                    allChanges: this.state.allChanges}), 
                React.createElement(LeftPanel, {
                    open: this.state.sidePanelOpen, 
                    onOpen: this._onOpenSidePanel, 
                    onClose: this._onCloseSidePanel, 
                    allProducts: this.state.allProducts, 
                    allBoms: this.state.allBoms, 
                    allChanges: this.state.allChanges, 
                    currentProductId: this.props.params.productId, 
                    currentBomId: this.props.params.bomId}), 
                React.createElement("div", {className: cx({
                    "center-panel": true,
                    "center-panel-sidebar-offset": this.state.sidePanelOpen
                })}, 
                    React.createElement("div", {id: "content-area", 
                        className: cx({
                            "content-area-narrow": this.state.sidePanelOpen,
                            "content-area-wide": !this.state.sidePanelOpen,
                            "content-area-short": this.state.bottomPanelOpen,
                            "content-area-tall": !this.state.bottomPanelOpen
                        })}, 
                        React.createElement(RouteHandler, {
                            params: this.props.params, 
                            user: this.state.user, 
                            company: this.state.allCompanies.getCurrent(), 
                            allProducts: this.state.allProducts, 
                            allBoms: this.state.allBoms, 
                            allSelectedBomItems: this.state.allSelectedBomItems, 
                            allFields: this.state.allFields, 
                            allTypes: this.state.allTypes, 
                            allImportBoms: this.state.allImportBoms, 
                            allChanges: this.state.allChanges, 
                            allViews: this.state.allViews})
                    ), 
                    React.createElement(BottomPanel, {
                        open: this.state.bottomPanelOpen, 
                        onOpen: this._onOpenBottomPanel, 
                        onClose: this._onCloseBottomPanel, 
                        allBoms: this.state.allBoms, 
                        allSelectedBomItems: this.state.allSelectedBomItems, 
                        allFields: this.state.allFields, 
                        allTypes: this.state.allTypes, 
                        allChanges: this.state.allChanges})
                ), 
                sessionTimeoutModal
            ));
    },

    _onOpenSidePanel: function() {
        this.setState({
            sidePanelOpen: true
        });
    },

    _onCloseSidePanel: function() {
        this.setState({
            sidePanelOpen: false
        });
    },

    _onOpenBottomPanel: function() {
        this.setState({
            bottomPanelOpen: true
        });
    },

    _onCloseBottomPanel: function() {
        this.setState({
            bottomPanelOpen: false
        });
    },

    /**
     * Event handler for events coming from the stores
     */
    _onAdd: function(model, collection, options) {
        options = options || {};
        if (options.shouldUpdate === false) { return; }

        this.setState(getState());
    },

    _onRemove: function(model, collection, options) {
        options = options || {};
        if (options.shouldUpdate === false) { return; }

        this.setState(getState());
    },

    _onChange: function(collection, options) {
        options = options || {};
        if (options.shouldUpdate === false) { return; }

        this.setState(getState());
    },

    _onReset: function(collection, options) {
        options = options || {};
        if (options.shouldUpdate === false) { return; }

        this.setState(getState());
    },

    _onRequest: function(collection, xhr, options) {
        options = options || {};
        if (options.shouldUpdate === false) { return; }

        this.setState(getState());
    },

    _onSync: function(collection, resp, options) {
        options = options || {};
        if (options.shouldUpdate === false) { return; }

        this.setState(getState());
    },

    _onValidate: function() {
        this.setState(getState());
    },

    _onUpdate: function() {
        this.setState(getState());
    },
});

module.exports = BomManager;
