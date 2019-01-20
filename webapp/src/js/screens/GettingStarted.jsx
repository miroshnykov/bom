"use strict";

var AppDispatcher = require("dispatcher/AppDispatcher");
var Carousel = require("components/Carousel.jsx");
var CarouselSlide = require("components/CarouselSlide.jsx");
var cx = require("react/lib/cx");
var Modal = require("components/modals/Modal.jsx");
var Navigation = require("react-router").Navigation;
var React = require("react");
var TutorialActions = require("actions/TutorialActions");
var TutorialStore = require("stores/TutorialStore");

module.exports = React.createClass({
    mixins: [Navigation],

    componentDidMount: function() {
        TutorialStore.on("tutorialComplete", this.onChange);
    },

    componentWillUnmount: function() {
        TutorialStore.off("tutorialComplete", this.onChange);
    },

    render: function() {
        return (
            <div className="content-page">
                <div className="text-center title">
                    <img src="/assets/images/icon-32px.png" />
                    <span className="h3">Getting Started with BoM Squad</span>
                </div>
                <Carousel onComplete={TutorialActions.completeTutorial}>
                    <CarouselSlide
                        imageSource="/assets/images/getting-started/import.png"
                        title="Import"
                        description="Have your BoM available online, accessible anywhere and anytime.">
                    </CarouselSlide>

                    <CarouselSlide
                        imageSource="/assets/images/getting-started/comment.png"
                        title="Commenting"
                        description="Be on the same page as the rest of your team.">
                    </CarouselSlide>

                    <CarouselSlide
                        imageSource="/assets/images/getting-started/alert.png"
                        title="Alerts &amp; Validation"
                        description="Alert your teams when you find problems. We'll also check your BoM for issues and alert you.">
                    </CarouselSlide>

                    <CarouselSlide
                        imageSource="/assets/images/getting-started/price.png"
                        title="Price your BoM"
                        description="Curious about costs? Ready to purchase components? Use our one click Pricing to request an estimate.">
                    </CarouselSlide>

                    <CarouselSlide
                        imageSource="/assets/images/getting-started/manufacture.png"
                        title="Contract Manufacturer Matchmaking"
                        description="Meet the Contract Manufacturer of your dreams in a single click.">
                    </CarouselSlide>
                </Carousel>
                {this.renderImportButton()}
            </div>
        );
    },

    renderImportButton: function() {
        var viewedAll = TutorialStore.completedTutorial();
        return (
            <button
                type="button"
                className={cx({
                    btn: true,
                    "btn-primary": viewedAll,
                    "btn-link": !viewedAll,
                    "center-block": true
                })}
                onClick={this.onImport}>
                I’m ready. Import my BoM <span className="fa fa-long-arrow-right" />
            </button>);
    },

    onImport: function() {
        if(!TutorialStore.completedTutorial()) {
            AppDispatcher.dispatch({
                action: {
                    type: "show-modal"
                },
                modal: (
                    <Modal
                        title="Skip the Guide?"
                        saveLabel="Confirm"
                        dismissLabel="Go Back"
                        onConfirm={this.confirmNavToImport}>
                        Are you sure you want to skip the guide? If you want to see it later, you can by
                        clicking on the top left menu under Getting Started.
                    </Modal>)
            });
        } else {
            this.transitionTo("default");
        }
    },

    confirmNavToImport: function() {
        TutorialActions.completeTutorial();
        this.transitionTo("default");
    },

    onChange: function() {
        this.forceUpdate();
    }
});
