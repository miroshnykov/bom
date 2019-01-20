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
var RevisionStore = require("../stores/RevisionStore");
//var ComponentStore = require("../stores/ComponentStore");
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

var cx = require("react/lib/cx");

function getState() {
    return {
        user: UserStore,
        allCompanies: CompanyStore,
        allProducts: ProductStore,
        allBoms: BomStore,
        allSelectedBomItems: SelectedBomItemStore,
        allRevisions: RevisionStore,
        //allComponents: ComponentStore,
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
                    TypeActions.fetchAll()
                    //ComponentActions.fetchAll()
                ]);
            } else {
                return Promise.reject(new Error("User is not linked to a company."));
            }

        }).then(function(result) {

            //success
            ProductStore.on("add change remove reset", this._onChange);
            BomStore.on("add change remove reset", this._onChange);
            SelectedBomItemStore.on("add change remove reset", this._onChange);
            UserStore.on("add change remove reset", this._onChange);
            RevisionStore.on("add change remove reset", this._onChange);
            //ComponentStore.on("add change remove sync", this._onChange);
            FieldStore.on("add change remove reset", this._onChange);
            FieldTypeStore.on("add change remove reset", this._onChange);
            BomImportStore.on("add change remove reset", this._onChange);
            CompanyStore.on("add change remove reset", this._onChange);

            $(window).on("beforeunload", function(){
                if (RevisionStore.getQueueLength()) {
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
            this.setState({
                isSessionTimeoutModalOpen: true
            });
        }.bind(this));
    },

    componentWillUnmount: function() {
        ProductStore.off("add change remove", this._onChange);
        BomStore.off("add change remove", this._onChange);
        SelectedBomItemStore.off("add change remove", this._onChange);
        UserStore.off("add change remove", this._onChange);
        RevisionStore.off("add change remove", this._onChange);
        //ComponentStore.off("add remove change sync", this._onChange);
        FieldStore.off("add remove change reset", this._onChange);
        FieldTypeStore.off("add remove change reset", this._onChange);
        BomImportStore.off("add remove change reset", this._onChange);
        CompanyStore.off("add remove change reset", this._onChange);
    },

    render: function() {
        var isConnected = this.state.allRevisions.isConnected();
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
                    allRevisions: this.state.allRevisions}), 
                React.createElement(LeftPanel, {
                    open: this.state.sidePanelOpen, 
                    onOpen: this._onOpenSidePanel, 
                    onClose: this._onCloseSidePanel, 
                    allProducts: this.state.allProducts, 
                    allBoms: this.state.allBoms, 
                    allRevisions: this.state.allRevisions, 
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
                            allImportBoms: this.state.allImportBoms})
                    ), 
                    React.createElement(BottomPanel, {
                        open: this.state.bottomPanelOpen, 
                        onOpen: this._onOpenBottomPanel, 
                        onClose: this._onCloseBottomPanel, 
                        allBoms: this.state.allBoms, 
                        allSelectedBomItems: this.state.allSelectedBomItems, 
                        allFields: this.state.allFields, 
                        allTypes: this.state.allTypes})
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
     * Event handler for "change" events coming from the ProductStore
     */
    _onChange: function(model, options) {
        options = options ? options : {};

        if (!options.waitForRelation) {
            this.setState(getState());
        }
    }
});

module.exports = BomManager;
