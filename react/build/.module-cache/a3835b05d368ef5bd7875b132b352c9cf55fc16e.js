var React = require("react");
var Navigation = require("react-router").Navigation;
var State = require("react-router").State;
var Button = require("react-bootstrap").Button;
var ButtonToolbar = require("react-bootstrap").ButtonToolbar;
var DropdownButton = require("react-bootstrap").DropdownButton;
var MenuItem = require("react-bootstrap").MenuItem;
var Alert = require("react-bootstrap").Alert;
var Input = require("react-bootstrap").Input;
var Panel = require("react-bootstrap").Panel;

var InputConstants = require('../constants/InputConstants');
var BomActions = require("../actions/BomActions");
var BomImporter = require("../utils/BomImporter");
var BomUtils = require("../utils/BomUtils");

var BomImport = React.createClass({displayName: "BomImport",
    mixins: [Navigation, State],

    propTypes: {},

    getInitialState: function() {
        return {
            alert: undefined,
            file: undefined
        };
    },

    componentDidMount: function() {
        this._addScroll();
    },

    componentWillUnmount: function() {
        this._removeScroll();
    },

    componentDidUpdate: function(nextProps) {
        $(this.getDOMNode()).getNiceScroll().resize();
    },

    _addScroll: function() {
        $(this.getDOMNode()).niceScroll({
            cursoropacitymax: 0.25,
            cursorwidth: "10px",
            railpadding: {
                top: 5,
                right: 1,
                left: 1,
                bottom: 5
            }
        });
    },

    _removeScroll: function() {
        $(this.getDOMNode()).getNiceScroll().remove();
    },

    /**
     * @return {object}
     */
    render: function() {
        var browseButton;
        var importAlert;
        var importOptions;

        // Create browse button
        browseButton = (
            React.createElement(Button, {
                bsStyle: "primary", 
                bsSize: "large", 
                onClick: this._onBrowse}, 
                "Browse"
            )
            );

        // Create alert component if needed
        if (this.state.alert) {
            importAlert = (
                React.createElement(Alert, {bsStyle: "danger"}, this.state.alert));
        }

        if (this.state.options) {
            importOptions = (React.createElement("div", {className: "bom-import-options clearfix"}, 
                    React.createElement("form", {className: "form-inline col-md-12"}, 
                        React.createElement("div", {className: "form-group"}, 
                            React.createElement("label", {className: "col-md-7 text-right", htmlFor: "header"}, "Your file includes column names"), 
                            React.createElement(DropdownButton, {onSelect: this._onSelectHeaders, id: "header", bsStyle: "default", title: this.state.options.header?"Yes":"No"}, 
                                this.state.options.header ? (React.createElement(MenuItem, {eventKey: "no"}, "No")) : (React.createElement(MenuItem, {eventKey: "yes"}, "Yes"))
                            )
                        ), 
                        React.createElement("div", {className: "form-group"}, 
                            React.createElement("label", {className: "col-md-7 text-right", htmlFor: "delimiter"}, "Your values are separated by"), 
                            React.createElement("input", {
                                id: "delimiter", 
                                type: "text", 
                                className: "form-control", 
                                value: this.state.options.delimiter, 
                                onChange: this._onChangeDelimiter, 
                                onKeyDown: this._onKeyDownDelimiter})
                        ), 
                        React.createElement("div", {className: "form-group"}, 
                            React.createElement("label", {className: "col-md-7 text-right", htmlFor: "encoding"}, "Your file is encoded as"), 
                            React.createElement(DropdownButton, {onSelect: this._onSelectEncoding, id: "encoding", bsStyle: "default", title: this._getEncodingFromLabel(this.state.options.encoding)}, 
                                React.createElement(MenuItem, {eventKey: "utf-8"}, this._getEncodingFromLabel("utf-8")), 
                                React.createElement(MenuItem, {eventKey: "ascii"}, this._getEncodingFromLabel("ascii")), 
                                React.createElement(MenuItem, {eventKey: "macintosh"}, this._getEncodingFromLabel("macintosh"))
                            )
                        )
                    )
                ));
        }

        return (
            React.createElement("div", {id: "bom-import", className: "scrollable content"}, 
                React.createElement("div", {className: "wrapper"}, 
                    React.createElement("div", {className: "col-lg-6 col-md-8 col-sm-12"}, 
                        React.createElement(Panel, {header: "How We Handle Imports", bsStyle: "info"}, 
                            React.createElement("p", null, "For manufacturing purposes, BoMs work best when they don't hvae any surprises in them, and conventions help keep things clear for both creators and manufacturers. For that reason, we'll suggest names for the columns in your BoM, which you can select from a drop-down menu. Or, you can keep the names you've got, it's totally up to you."), 
                            React.createElement("p", null, "If you don't already have an SKU or some kind of ID on each of your components, we'll autogenerate an ID for you."), 
                            React.createElement("p", null, "We don't change ANY of your existing component information without your approval.")
                        ), 

                        React.createElement("h1", null, "Import from CSV File"), 
                        React.createElement(Input, {
                            type: "text", 
                            value: this.state.file ? this.state.file.name : "", 
                            bsSize: "large", 
                            buttonAfter: browseButton, 
                            onClick: this._onBrowse, 
                            readOnly: true}), 
                        React.createElement(Input, {
                            type: "file", 
                            id: "importFileInput", 
                            className: "invisible", 
                            groupClassName: "hidden", 
                            label: "CSV file", 
                            labelClassName: "sr-only", 
                            onChange: this._onChangeImportFile}), 

                        importOptions, 

                        React.createElement("div", {className: "pull-right"}, 
                            importAlert, 
                            React.createElement(ButtonToolbar, null, 
                                React.createElement(Button, {
                                    bsStyle: "link", 
                                    bsSize: "large", 
                                    onClick: this.goBack}, 
                                    "Cancel"
                                ), 
                                React.createElement(Button, {
                                    bsStyle: "primary", 
                                    bsSize: "large", 
                                    onClick: this._onImport, 
                                    disabled: !this._canImport()}, 
                                    "Import"
                                )
                            )
                        )
                    )
                )
            )
        );
    },

    _getEncodingFromLabel: function(label) {
        switch (label) {
            case "utf-8":
                return "Unicode (UTF-8)";
                break;

            case "ascii":
                return "Windows (ANSI)";
                break;

            case "macintosh":
                return "Macintosh";
                break;

            default:
                return "Unicode (UTF-8)";
                break;
        }
    },

    _canImport: function() {
        if (!this.state.options ||
            this.state.options.header === undefined ||
            !this.state.options.delimiter) { return false; }
        return true;
    },

    _onBrowse: function() {
        //TODO use findDOMNode when updating react
        //React.findDOMNode( this.refs.importFileInput ).trigger("click");

        $(this.getDOMNode()).find("input#importFileInput").trigger("click");
    },

    _onChangeImportFile: function(event) {
        if (!BomUtils.isFileAPIEnabled()) {
            this.setState({
                alert: "Sorry, we don't support import in your browser, but we are working on it. Feel free to email us your BoM at bom@fabule.com."
            });
            return;
        }

        this.setState({
            alert: undefined,
            file: event.target.files[0]
        });

        // Auto-detect the CSV parameters
        BomImporter.detectCSVFromFile(event.target.files[0]).then(function(options) {
            this.setState({
                options: options
            });
        }.bind(this), function(error) {
            this.setState({
                alert: error.message
            });
        }.bind(this));
    },

    _onSelectHeaders: function(key) {
        this.setState({
            options: _.extend({}, this.state.options, { header: key === "yes"})
        })
    },

    _onSelectEncoding: function(key) {
        this.setState({
            options: _.extend({}, this.state.options, { encoding: key})
        })
    },

    _onChangeDelimiter: function(event) {
        this.setState({
            options: _.extend({}, this.state.options, { delimiter: event.target.value})
        })
    },

    _onKeyDownDelimiter: function(event) {
        if (event.keyCode === InputConstants.ENTER) {
            event.preventDefault();
        }
    },

    _onImport: function(event) {

        var productId;
        var bomId;

        if (this.props.params) {
            productId = this.props.params.productId;
            bomId = this.props.params.bomId;
        }

        BomActions.importFile(this.state.file, this.state.options).then(function(result) {

            this.transitionTo(this.getPath() + "/match");

        }.bind(this), function(error) {

            this.setState({
                alert: error.message
            });

        }.bind(this));
    }
});

module.exports = BomImport;
