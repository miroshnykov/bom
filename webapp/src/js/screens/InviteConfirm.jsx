"use strict";

var React = require("react");
var Navigation = require("react-router").Navigation;

var InviteConfirm = React.createClass({
    mixins: [Navigation],

    componentDidMount: function() {
        setTimeout(function() {
            window.location.href = "/";
        }, 3000);
    },

    render: function() {
        return (
            <div className="invite-confirm text-center">
                <div className="panel panel-primary">
                    <div className="text-center">
                        <h3>Welcome!</h3>
                        <h5>You are now signed up for BoM Squad. You will shortly be redirected.</h5>
                    </div>
                    <div className="panel-body">
                        <a href="/">If you are not redirected, please click this link.</a>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = InviteConfirm;
