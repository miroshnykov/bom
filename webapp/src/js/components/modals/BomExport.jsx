"use strict";

var React = require("react");
var Button = require("react-bootstrap").Button;
var Navigation = require("react-router").Navigation;
var Glyphicon = require("react-bootstrap").Glyphicon;

var BomActions = require("actions/BomActions");
var BomExportStore = require("stores/BomExportStore");

function getState() {
    return {
        allExportBoms: BomExportStore
    };
}

var BomExportModal = React.createClass({

    propTypes: {
        backdrop: React.PropTypes.string,
    },

    getInitialState: function() {
        return getState();
    },

    componentDidMount: function() {
        BomExportStore.on("add change remove", this.onChange);
    },

    componentWillUnmount: function() {
        BomExportStore.off("add change remove", this.onChange);
    },

    onChange: function(model, options) {
        this.setState(getState());
    },

    render: function() {
        var exported = this.state.allExportBoms.last();
        var status;
        var message;
        var title;
        var downloadBtn;

        var dismissHeader = (
            <button type="button" className="close" data-dismiss="modal" tabIndex="-1">
                <span aria-hidden="true">&times;</span>
            </button>);
        var dismissFooter = (
            <button type="button" className="btn btn-default" data-dismiss="modal" tabIndex="2">
                Cancel
            </button>);

        if (exported) {
            status = exported.get("status");
        }

        if (status === "ready") {
            message = "Your export is ready!";
            downloadBtn = (
                <Button
                    bsStyle="primary"
                    href={exported.get("url")}
                    target="_blank"
                    onClick={this.props.onDownload}>
                <Glyphicon glyph="download" /> CSV</Button>);

        }
        else if (status === "failed") {
            message = "Sorry, something went wrong. " + exported.get("message");
            downloadBtn = (
                <Button bsStyle="primary" onClick={this.retry}>
                <span className="glyphicon glyphicon-refresh" aria-hidden="true"></span> CSV</Button>);

        }
        else {
            message = "Your export is in progress...";
            downloadBtn = (
                <Button bsStyle="primary" disabled>
                <span className="glyphicon glyphicon-refresh glyphicon-spin" aria-hidden="true"></span> CSV</Button>);
        }

        return (
            <div className="modal fade modal-export" id="modal" data-backdrop={this.props.backdrop}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            {dismissHeader}
                            <h4 className="modal-title">Export</h4>
                        </div>
                        <div className="modal-body">
                            {message}
                        </div>
                        <div className="modal-footer">
                            {dismissFooter}
                            {downloadBtn}
                        </div>
                    </div>
                </div>
            </div>
        );
    },

    retry: function() {
        BomActions.retryExportItems();
    }
});

module.exports = BomExportModal;
