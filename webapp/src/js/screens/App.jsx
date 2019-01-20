"use strict";

var React = require("react");
var RouteHandler = require("react-router").RouteHandler;

var ChangeStore = require("stores/ChangeStore");
var AppDispatcher = require("dispatcher/AppDispatcher");
var UserStore = require("stores/UserStore");
var Alerts = require("components/Alerts.jsx");
var Spinner = require("components/Spinner.jsx");
var SessionTimeoutModal = require("components/modals/SessionTimeout.jsx");

function handleAjaxError(event, jqxhr, settings, thrownError){
    if(jqxhr.status === 403) {
         AppDispatcher.dispatch({
            action: {
                type: "show-modal"
            },
            modal: (<SessionTimeoutModal />)
        });
    }
}

module.exports = React.createClass({

    getInitialState: function() {
        return {
            initialized: false,
            modal: null
        };
    },

    componentDidMount: function() {
        AppDispatcher.register((function(payload) {
            if(!payload || !payload.action || !payload.action.type){
                return;
            }

            if(payload.action.type === "show-modal"){
                this.setState({
                    modal: payload.modal
                });
            }
        }).bind(this));

        UserStore.init().then(function(user) {

            //Hacked to simulate a login action.
            user.login();

            this.setState({
                initialized: true
            });

        }.bind(this)).then(function() {
            $(document).ajaxError(handleAjaxError);

        }, function(error) {
            console.error("Application error caught: ", error);
            UserStore.current.logout();

        }.bind(this));

        $(window).on("resize", function(){
            this.forceUpdate();
        }.bind(this));
    },

    componentDidUpdate: function(prevProps, prevState){
        if(this.state.modal && !prevState.modal) {
            $("#modal").on("hidden.bs.modal", (function (e) {
                this.setState({
                    modal: null
                });
            }).bind(this));

            $("#modal").on("shown.bs.modal", function () {
              $("#modalConfirm").focus();
            });

            $("#modal").modal("show");
        }
    },

    componentWillUnmount: function() {
        $("#modal").off();
    },

    render: function() {
        return (
            <div className="container-fluid full-height">
                <Alerts />
                {this.state.initialized ? <RouteHandler /> : this.renderSpinner()}
                {this.state.modal}
            </div>
        );
    },

    renderSpinner: function() {
        return (
            <div className="container-fluid full-height">
                <div className="loader">
                    Loading
                    <Spinner className="spinner-dark" />
                </div>
            </div>);
    }
});
