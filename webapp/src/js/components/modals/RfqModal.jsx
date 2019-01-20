"use strict";

var Modal     = require("components/modals/Modal.jsx");
var React     = require("react");
var UserStore = require("stores/UserStore");

module.exports = React.createClass({
    propTypes: {
      bom: React.PropTypes.object.isRequired
    },

    render: function() {
        return (
            <Modal
                title="Help Me Price This BoM"
                saveLabel="Confirm"
                dismissLabel="Cancel"
                onConfirm={this.onConfirmRfq}>
                Someone from Fabule will review your BoM and help you price it. We will send a confirmation email and may then ask for more details.
            </Modal>
        );
    },

    onConfirmRfq: function() {
        var body =
            "payload={\"text\": \"User " + UserStore.current.get("email") +
            " requested pricing help on Bom: " + this.props.bom.get("name") +
            "(id=" + this.props.bom.id + ")\"}";
        $.post("https://hooks.slack.com/services/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",
            body
        ).fail(function(error) {
            console.log(error);
        });
    }
});
