"use strict";

var _             = require("underscore");
var AppDispatcher = require("dispatcher/AppDispatcher");
var BomActions    = require("actions/BomActions");
var BomModel      = require("models/BomModel");
var ContentPage   = require("components/ContentPage.jsx");
var cx            = require("react/lib/cx");
var Navigation    = require("react-router").Navigation;
var React         = require("react");
var Spinner       = require("components/Spinner.jsx");

module.exports = React.createClass({
    mixins: [Navigation],

    getInitialState: function() {
        return {
            creating: null,
            importProgress: 0
        };
    },

    propTypes: {
        product: React.PropTypes.object.isRequired
    },

    render: function() {
        console.log("import progress: ", this.state.importProgress);
        var importLabel = "Import existing BoM";
        if(this.state.creating === "import") {
            importLabel = (
                <div className="progress">
                    <div
                        className="progress-bar progress-bar-info progress-bar-striped active"
                        role="progressbar"
                        style={{width: this.state.importProgress + "%"}} />
                </div>
            );
        }

        return (
            <ContentPage className="new-bom" title="Add a new Bill of Materials">
                <p className="text-center">
                    For manufacturing purposes, BoMs work best when they don't have any surprises in
                    them, and conventions help keep things clear for both creators and manufacturers.
                </p>
                <p className="text-center">
                    We don't change ANY of your existing component information without your approval.
                </p>
                <div className="row">
                    <div className="col-md-offset-3 col-md-6">
                        <button
                            className="btn btn-link center-block"
                            disabled={this.state.creating}
                            onClick={this.create}>
                            {this.state.creating === "new" ?
                                <Spinner className="spinner-primary" /> : "Create a blank BoM"}
                        </button>
                        <div className="header-with-line">
                            <span className="header-line" />
                            <span>or</span>
                            <span className="header-line" />
                        </div>
                        <input
                            id="chooseFile"
                            className="invisible"
                            accept=".csv"
                            type="file"
                            multiple="false"
                            onChange={this.create} />
                        <button
                            className={cx({
                                btn: true,
                                "btn-link": this.state.creating,
                                "btn-primary": !this.state.creating,
                                "center-block": true,
                                "button-import": true
                            })}
                            disabled={this.state.creating}
                            onClick={this.import}>
                            {importLabel}
                        </button>
                    </div>
                </div>
            </ContentPage>
        );
    },

    import: function() {
        $("#chooseFile").click();
    },

    displayError: function(error) {
        console.log("Could not create the BoM: ", error);
        AppDispatcher.dispatch({
            action: {
                type: "show-alert"
            },
            alert: {
                type: "danger",
                message:
                    "This is embarrassing. It seems something went wrong while creating the BoM"
            }
        });

        this.setState({
            creating: null
        });

    },

    create: function(event) {
        var files = event.target.files || [];
        var file = files[0];

        this.setState({
            creating: file ? "import" : "new"
        });

        BomActions
            .create({file: file, product: this.props.product, onUpdate: this.onProgressUpdate})
            .then(function(bom) {
                this.transitionTo("bomDashboard", { bomId: bom.id, productId: this.props.product.id });
            }.bind(this))
            .catch(this.displayError);
    },

    onProgressUpdate: function(percent) {
        this.setState({importProgress: percent});
    }
});
