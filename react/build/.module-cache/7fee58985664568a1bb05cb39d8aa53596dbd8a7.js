var React = require("react");
var Modal = require("react-bootstrap").Modal;
var Button = require("react-bootstrap").Button;
var Navigation = require("react-router").Navigation;
var Glyphicon = require("react-bootstrap").Glyphicon;

var BomActions = require("../actions/BomActions");
var BomExportStore = require("../stores/BomExportStore");

function getState() {
    return {
        allExportBoms: BomExportStore
    };
}

var BomExportModal = React.createClass({displayName: "BomExportModal",

    propTypes: {
        onCancel: React.PropTypes.func.isRequired,
        onDownload: React.PropTypes.func.isRequired
    },

    getInitialState: function() {
        return getState();
    },

    componentDidMount: function() {
        BomExportStore.on("add change remove", this._onChange);
    },

    componentWillUnmount: function() {
        BomExportStore.off("add change remove", this._onChange);
    },

    /**
     * Event handler for "change" events coming from the BomExportStore
     */
    _onChange: function(model, options) {
        this.setState(getState());
    },

    /**
    * @return {object}
    */
    render: function() {
        var exported = this.state.allExportBoms.last();
        var status;
        var message;
        var title;
        var downloadBtn;

        if (exported) {
            status = exported.get("status");
        }

        if (status === "ready") {
            title = "Your export is ready!";
            downloadBtn = (
                React.createElement(Button, {
                    bsStyle: "primary", 
                    href: exported.get("url"), 
                    target: "_blank", 
                    onClick: this.props.onDownload}, 
                React.createElement(Glyphicon, {glyph: "download"}), " CSV"));

        }
        else if (status === "failed") {
            title = "Sorry, something went wrong.";
            message = exported.get("message");
            downloadBtn = (
                React.createElement(Button, {bsStyle: "primary", onClick: this._retry}, 
                React.createElement("span", {className: "glyphicon glyphicon-refresh", "aria-hidden": "true"}), " CSV"));

        }
        else {
            title = "Your export is in progress...";
            downloadBtn = (
                React.createElement(Button, {bsStyle: "primary", disabled: true}, 
                React.createElement("span", {className: "glyphicon glyphicon-refresh glyphicon-spin", "aria-hidden": "true"}), " CSV"));
        }

        return (
            React.createElement(Modal, React.__spread({},  this.props, 
                {onRequestHide: function(){}, 
                bsStyle: "primary", 
                backdrop: true, 
                title: title, 
                animation: true, 
                className: "modal-export"}), 
                React.createElement("div", {className: "modal-body"}, message), 
                React.createElement("div", {className: "modal-footer"}, 
                  React.createElement(Button, {ref: "cancelBtn", onClick: this.props.onCancel}, "Cancel"), 
                  downloadBtn
                )
            )
        );
    },

    _retry: function() {
        BomActions.retryExportItems();
    }
});

module.exports = BomExportModal;
