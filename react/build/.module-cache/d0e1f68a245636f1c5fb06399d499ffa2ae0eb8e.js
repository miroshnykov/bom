var React = require("react");
var Modal = require("react-bootstrap").Modal;
var Button = require("react-bootstrap").Button;
var Navigation = require("react-router").Navigation;


var SessionTimeoutModal = React.createClass({displayName: "SessionTimeoutModal",
    /**
    * @return {object}
    */
    render: function() {
        return (
            React.createElement(Modal, React.__spread({},  this.props, 
                {onRequestHide: this._onCancel, 
                bsStyle: "primary", 
                backdrop: true, 
                title: "Your session timed out", 
                animation: true, 
                className: "modal-session-timeout"}), 
                React.createElement("div", {className: "modal-body"}, 
                    React.createElement("div", null, "You've been idle for for some time. We signed you out for security reasons. Please sign back in to continue.")
                ), 
                React.createElement("div", {className: "modal-footer"}, 
                    React.createElement(Button, {bsStyle: "primary", onClick: this._redirect}, "Sign In")
                )
            )
        );
    },

    _redirect: function() {
        window.location.href = "/user/signout";
    },

    _onCancel: function() {}
});

module.exports = SessionTimeoutModal;
