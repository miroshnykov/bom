"use strict";

var _ = require("underscore");
var Alert = require("components/Alert.jsx");
var AppDispatcher = require("dispatcher/AppDispatcher");
var React = require("react");

module.exports = React.createClass({

    getInitialState: function() {
        return {
            alerts: {}
        };
    },

    componentDidMount: function() {
        AppDispatcher.register((function(payload) {
            if(!payload || !payload.action || !payload.action.type){
                return;
            }

            if(payload.action.type === "show-alert"){
                var newAlerts = _.clone(this.state.alerts);
                newAlerts[_.uniqueId("alert_")] = payload.alert;
                this.setState({
                    alerts: newAlerts
                });
            }
        }).bind(this));
    },

    render: function() {
        return (
            <div id="alerts" className="alerts">
                <div className="center-block">
                    {this.renderAlerts()}
                </div>
            </div>
        );
    },

    renderAlerts: function() {
        return _.first(_.map(this.state.alerts, function (element, index) {
            return (
                <Alert
                    key={index}
                    type={element.type}
                    onClick={this.onClick}
                    index={index}
                    sticky={element.sticky}>
                    {element.message}
                </Alert>);
        }.bind(this)), 3);
    },

    onClick: function(index) {
        var newAlerts = _.clone(this.state.alerts);
        delete newAlerts[index];
        this.setState({
            alerts: newAlerts
        });
    }
});
