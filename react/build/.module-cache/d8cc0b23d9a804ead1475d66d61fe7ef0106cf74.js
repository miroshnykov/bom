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

var UserActions = require("../actions/UserActions");
var ProductActions = require("../actions/ProductActions");
var BomActions = require("../actions/BomActions");
var FieldActions = require("../actions/FieldActions");
var TypeActions = require("../actions/TypeActions");
var ComponentActions = require("../actions/ComponentActions");
var CompanyActions = require("../actions/CompanyActions");
var ChangeActions = require("../actions/ChangeActions");

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
        allImportBoms: BomImportStore
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
        UserActions.fetch().then(function(user) {

            if (CompanyStore.length > 0) {
                CompanyActions.select(CompanyStore.first().id);

                return Promise.all([
                    ProductActions.fetchAll(),
                    BomActions.fetchAll(),
                    FieldActions.fetchAll(),
                    TypeActions.fetchAll(),
                    ChangeActions.fetchAll()
                ]);
            } else {
                return Promise.reject(new Error("User is not linked to a company."));
            }

        }).then(function(result) {

            //success
            ProductStore.on("add", this._onAdd);
            ProductStore.on("change", this._onChange);
            ProductStore.on("remove", this._onRemove);
            ProductStore.on("reset", this._onReset);
            ProductStore.on("sync", this._onSync);

            BomStore.on("add add:items add:attributes add:values", this._onAdd);
            BomStore.on("change change:items change:attributes change:values", this._onChange);
            BomStore.on("remove remove:items remove:attributes remove:values", this._onRemove);
            BomStore.on("reset reset:items reset:attributes reset:values", this._onReset);
            BomStore.on("sync sync:items sync:attributes sync:values", this._onSync);

            SelectedBomItemStore.on("add", this._onAdd);
            SelectedBomItemStore.on("change", this._onChange);
            SelectedBomItemStore.on("remove", this._onRemove);
            SelectedBomItemStore.on("reset", this._onReset);
            SelectedBomItemStore.on("sync", this._onSync);

            UserStore.on("add", this._onAdd);
            UserStore.on("change", this._onChange);
            UserStore.on("remove", this._onRemove);
            UserStore.on("reset", this._onReset);
            UserStore.on("sync", this._onSync);

            ChangeStore.on("add", this._onAdd);
            ChangeStore.on("change", this._onChange);
            ChangeStore.on("remove", this._onRemove);
            ChangeStore.on("reset", this._onReset);
            ChangeStore.on("sync", this._onSync);

            FieldStore.on("add", this._onAdd);
            FieldStore.on("change", this._onChange);
            FieldStore.on("remove", this._onRemove);
            FieldStore.on("reset", this._onReset);
            FieldStore.on("sync", this._onSync);

            FieldTypeStore.on("add", this._onAdd);
            FieldTypeStore.on("change", this._onChange);
            FieldTypeStore.on("remove", this._onRemove);
            FieldTypeStore.on("reset", this._onReset);
            // FieldTypeStore.on("sync", this._onSync);

            BomImportStore.on("add", this._onAdd);
            BomImportStore.on("change", this._onChange);
            BomImportStore.on("remove", this._onRemove);
            BomImportStore.on("reset", this._onReset);
            BomImportStore.on("sync", this._onSync);

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
        ProductStore.off("add", this._onAdd);
        ProductStore.off("change", this._onChange);
        ProductStore.off("remove", this._onRemove);
        ProductStore.off("reset", this._onReset);
        ProductStore.off("sync", this._onSync);

        BomStore.off("add add:items add:attributes add:values", this._onAdd);
        BomStore.off("change change:items change:attributes change:values", this._onChange);
        BomStore.off("remove remove:items remove:attributes remove:values", this._onRemove);
        BomStore.off("reset reset:items reset:attributes reset:values", this._onReset);
        BomStore.off("sync sync:items sync:attributes sync:values", this._onSync);

        SelectedBomItemStore.off("add", this._onAdd);
        SelectedBomItemStore.off("change", this._onChange);
        SelectedBomItemStore.off("remove", this._onRemove);
        SelectedBomItemStore.off("reset", this._onReset);
        SelectedBomItemStore.off("sync", this._onSync);

        UserStore.off("add", this._onAdd);
        UserStore.off("change", this._onChange);
        UserStore.off("remove", this._onRemove);
        UserStore.off("reset", this._onReset);
        UserStore.off("sync", this._onSync);

        ChangeStore.off("add", this._onAdd);
        ChangeStore.off("change", this._onChange);
        ChangeStore.off("remove", this._onRemove);
        ChangeStore.off("reset", this._onReset);
        ChangeStore.off("sync", this._onSync);

        FieldStore.off("add", this._onAdd);
        FieldStore.off("change", this._onChange);
        FieldStore.off("remove", this._onRemove);
        FieldStore.off("reset", this._onReset);
        FieldStore.off("sync", this._onSync);

        FieldTypeStore.off("add", this._onAdd);
        FieldTypeStore.off("change", this._onChange);
        FieldTypeStore.off("remove", this._onRemove);
        FieldTypeStore.off("reset", this._onReset);
        // FieldTypeStore.off("sync", this._onSync);

        BomImportStore.off("add", this._onAdd);
        BomImportStore.off("change", this._onChange);
        BomImportStore.off("remove", this._onRemove);
        BomImportStore.off("reset", this._onReset);
        BomImportStore.off("sync", this._onSync);
    },

    render: function() {
        var isConnected = this.state.allChanges.isConnected();
        var sessionTimeoutModal;

        // add session timeout modal
        if (this.state.isSessionTimeoutModalOpen || !isConnected) {
            sessionTimeoutModal = (React.createElement(SessionTimeoutModal, null));
        }

        if (!this.state.initialized) {
            //TODO render header and spinner
            return (React.createElement("div", {className: "container-fluid"}, 
                    React.createElement(Header, null), 
                    React.createElement("div", {className: "center-panel col-md-12"}, 
                        React.createElement("div", {className: "loader"}, 
                            React.createElement("div", null, "Loading... ", React.createElement("span", {className: "glyphicon glyphicon-refresh glyphicon-spin", "aria-hidden": "true"}))
                        )
                    ), 
                    sessionTimeoutModal
                ));
        }

        //TODO add spinner
        return (
            React.createElement("div", {className: "container-fluid"}, 
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
                    "col-md-10": this.state.sidePanelOpen
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
                            allChanges: this.state.allChanges})
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

    _onSync: function(collection, resp, options) {
        options = options || {};
        if (options.shouldUpdate === false) { return; }

        this.setState(getState());
    },
});

module.exports = BomManager;
