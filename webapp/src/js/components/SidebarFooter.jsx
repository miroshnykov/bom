"use strict";

var AppDispatcher = require("dispatcher/AppDispatcher");
var React = require("react");
var ReferModal = require("components/modals/Refer.jsx");
var TutorialActions = require("actions/TutorialActions");
var TutorialStore = require("stores/TutorialStore");

module.exports = React.createClass({

    componentDidMount: function() {
        TutorialStore.on("tutorialComplete", this.onChange);
        TutorialStore.on("dismissHint", this.onChange);
    },

    componentWillUnmount: function() {
        TutorialStore.off("tutorialComplete", this.onChange);
        TutorialStore.off("dismissHint", this.onChange);
    },

    render: function() {
        var helpHint = TutorialStore.showHint("help") ? (
            <div className="help">
                <svg className="arrow" width="100px" height="50px" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8,30 Q58,30 100,0" />
                    <path d="M0,30 L6,36 L6,24 z" className="triangle"/>
                </svg>
                <div className="text">
                    Got Questions? From BoM Management to your nuts and bolts, click
                    here and we can help
                    <span
                        className="fa fa-close dismiss cursor-pointer"
                        title="Dismiss hint"
                        onClick={this.onDismissHint}/>
                </div>
            </div>) : null;

        return (
            <footer className="text-center">
                <div className="btn btn-link" onClick={this.onRefer}>
                    Share the <span className="fa fa-heart" />
                </div>
                <div className="btn btn-link" onClick={this.help}>
                    Need Help?
                </div>
                {helpHint}
            </footer>
        );
    },

    onDismissHint: function() {
        TutorialActions.dismissHint({name: "help"});
    },

    help: function(event) {
        window.Intercom("show");
    },

    onRefer: function(event) {
        AppDispatcher.dispatch({
            action: {
                type: "show-modal"
            },
            modal: (<ReferModal />)
        });
    },

    onChange: function() {
        this.forceUpdate();
    }
});
