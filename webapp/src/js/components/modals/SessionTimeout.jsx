"use strict";

var Modal = require("components/modals/Modal.jsx");
var React = require("react");
var UserStore = require("stores/UserStore");

var SessionTimeoutModal = React.createClass({
    /**
    * @return {object}
    */
    render: function() {
        return (
            <Modal
                title="Your Session Timed Out"
                saveLabel="Sign In"
                backdrop="static"
                onConfirm={this.logout}>
                You've been idle for for some time. We signed you out for security reasons. Please sign back in to continue.
            </Modal>
        );
    },

    logout: function() {
        UserStore.current.logout();
    }
});

module.exports = SessionTimeoutModal;
