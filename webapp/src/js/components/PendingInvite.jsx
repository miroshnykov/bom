"use strict";

var AppDispatcher = require("dispatcher/AppDispatcher");
var backboneMixin = require("backbone-react-component");
var Modal = require("components/modals/Modal.jsx");
var cx = require("react/lib/cx");
var React = require("react");

module.exports = React.createClass({
    mixins: [backboneMixin],

    render: function() {
        return (
            <li className="list-group-item">
                <div className="row">
                    <div className="col-md-8">
                        <h5 className="list-group-item-heading">
                            {this.getModel().get("firstName") + " " + this.getModel().get("lastName")}
                        </h5>
                        <p className="list-group-item-text">{this.getModel().get("email")}</p>
                    </div>
                    <div className="col-md-4">
                        <div className="btn-group pull-right" role="group">
                            <button
                                type="button"
                                className="btn btn-primary"
                                title="Resend the invitation"
                                onClick={this.resendInvite} >
                                <span className="fa fa-envelope" aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                onClick={this.cancelInvite}
                                title="Cancel the invitation"
                                className={cx({
                                    "btn": true,
                                    "btn-default": true,
                                    "disabled": this.getModel().get("status") !== this.getModel().INVITE_STATUS_PENDING
                                })}
                                disabled={this.getModel().get("status") !== this.getModel().INVITE_STATUS_PENDING}>
                                <span className="fa fa-minus-circle" aria-hidden="true"/>
                            </button>
                        </div>
                    </div>
                </div>
            </li>
        );
    },

    cancelInvite: function() {
        AppDispatcher.dispatch({
            action: {
                type: "show-modal"
            },
            modal: (
                <Modal
                    title="Cancel Invitation"
                    saveLabel="Confirm"
                    dismissLabel="Cancel"
                    onConfirm={this.onConfirmCancellation}>
                    Are you sure you want to cancel the invitation for this user?
                </Modal>)
        });
    },

    resendInvite: function() {
        AppDispatcher.dispatch({
            action: {
                type: "show-modal"
            },
            modal: (
                <Modal
                    title="Resend Invitation"
                    saveLabel="Confirm"
                    dismissLabel="Cancel"
                    onConfirm={this.onConfirmResend}>
                    Do you want to send an email invitation to this user?
                </Modal>)
        });
    },

    onConfirmCancellation: function() {
        this.getModel().destroy({
            wait: true
        }).then(undefined, function(error) {
            this.getModel().fetch();

            AppDispatcher.dispatch({
                action: {
                    type: "show-alert"
                },
                alert: { type: "danger", message: error.message}
            });
        }.bind(this));
    },

    onConfirmResend: function() {
        this.getModel().save({send: true}, {patch: true}).then(function(invite) {
            AppDispatcher.dispatch({
                action: {
                    type: "show-alert"
                },
                alert: { type: "success", message: "The invitation has successfully been sent."}
            });
        }, function(error) {
            this.getModel().fetch();

            AppDispatcher.dispatch({
                action: {
                    type: "show-alert"
                },
                alert: { type: "danger", message: error.message}
            });
        }.bind(this));

    }
});

