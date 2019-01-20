"use strict";

var React = require("react");
var moment = require("moment");
var backboneMixin = require("backbone-react-component");
var filesize = require("filesize");

var AppDispatcher = require("dispatcher/AppDispatcher");
var Spinner = require("components/Spinner.jsx");
var Modal = require("components/modals/Modal.jsx");
var FileModel = require("models/FileModel");

var cx = require("react/lib/cx");

module.exports = React.createClass({
    mixins: [backboneMixin],

    render: function() {
        var file = this.getModel();
        var error;
        var status;
        var removeBtn;

        var icon = file.isStateSending() ?
            <Spinner className="spinner-dark" /> :
            <span className={cx({
                "fa": true,
                "fa-file-o": true,
                "text-danger": file.get("status") === FileModel.FAILED})} />;

        var label = (
            <span>
                <span className="icon">{icon}</span>
                {file.get("status") === FileModel.UPLOADED ?
                    <span>
                        <a href="#" target="_blank" onClick={this.download}>{file.get("name")}</a>
                        <span className="invisible"><a ref="link" href="#" target="_blank"></a></span>
                    </span> :
                    <span className={file.get("status") === FileModel.FAILED ? "text-danger" : null}>{file.get("name")}</span>}
            </span>
        );

        switch (file.get("status")) {
            case FileModel.FAILED:
                status = <span className="text-danger">Failed to upload</span>;
                break;
            case FileModel.PENDING_UPLOAD:
                if (file.get("progress")) {
                    status = (
                        <div className="progress">
                            <div className="progress-bar progress-bar-info progress-bar-striped active" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style={{minWidth: "2em", width: file.get("progress")+"%"}}>
                                <span>{file.get("progress")}%</span>
                            </div>
                        </div>
                    );
                }
                else {
                    status = <span>Pending upload</span>;
                }
                break;
            default:
                status = <span>{filesize(file.get("size"))}</span>;
        }

        removeBtn = (
            <button
                className="btn btn-nobg btn-danger btn-sm"
                onClick={this.onDelete} >
                <span className="fa fa-remove"></span>
            </button>
        );

        return (
            <div className="row file-item">
                <div className="col-xs-10 col-sm-6 col-md-10 col-lg-8">{label}</div>
                <div className="hidden-sm hidden-lg col-xs-2 col-md-2 text-right">
                    {removeBtn}
                </div>
                <div className="col-xs-12 col-sm-4 col-md-12 col-lg-3 text-right">{status}</div>
                <div className="hidden-xs hidden-md col-sm-2 col-lg-1 text-right">
                    {removeBtn}
                </div>
            </div>)
    },

    onDelete: function(event) {
        AppDispatcher.dispatch({
            action: {
                type: "show-modal"
            },
            modal: (
                <Modal
                    title="Delete File"
                    saveLabel="Confirm"
                    dismissLabel="Cancel"
                    onConfirm={this.onDeleteConfirm}>
                    Are you sure you want to permanently delete this file?
                </Modal>)
        });
   },

    onDeleteConfirm: function() {
        this.getModel().destroy();
    },

    download: function(event) {
        var file = this.getModel();

        file.fetch().then(function(file) {
            var link = $(React.findDOMNode(this.refs.link));
            link.attr({
                href: file.get("url")
            });
            link[0].click();
        }.bind(this), function(error) {
            AppDispatcher.dispatch({
                action: {
                    type: "show-alert"
                },
                alert: { type: "danger", message: error.message}
            });
        });

        event.preventDefault();
    }
});
