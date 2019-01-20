/*global jest:false, expect: false, Backbone:true, $:true*/
"use strict";

jest.dontMock("../BomExportModal.react.js");
jest.mock("../../stores/BomExportStore");

Backbone = require("backbone");

describe("BomExportModal.react", function() {
    var React = require("react/addons");
    var TestUtils = React.addons.TestUtils;
    var stubRouterContext = require("../../utils/stubRouterContext.react");

    var BomExportModal = require("../BomExportModal.react");
    var BomExportStore;

    var onDownload;
    var onCancel;
    var container;
    var instance;

    beforeEach(function() {
        var Wrapper;

        BomExportStore = require("../../stores/BomExportStore");

        onDownload = jest.genMockFunction();
        onCancel = jest.genMockFunction();

        Wrapper = stubRouterContext(BomExportModal, {
            onDownload: onDownload,
            onCancel: onCancel
        });

        container = document.createElement('div');
        instance = React.render(React.createElement(Wrapper, null), container);
    });

    afterEach(function() {
        React.unmountComponentAtNode(container);
    });

    it("registers for BomExportStore events when mounting", function() {
        expect( instance.refs.component.state.allExportBoms.on ).toBeCalledWith( "add change remove", instance.refs.component._onChange );
    });

    it("unregisters from BomExportStore events when unmounting", function() {
        var on = instance.refs.component.state.allExportBoms.on;
        var _onChange = instance.refs.component._onChange;
        React.unmountComponentAtNode(container);
        expect( on ).toBeCalledWith( "add change remove", _onChange );
    });

    // it("renders as expected", function() {
        // TODO
    // });

    it("calls onDownload when download button is clicked", function() {
        var footer;
        var downloadBtn;

        instance.refs.component.state.allExportBoms.last = jest.genMockFunction().mockImplementation(function() {
            return {
                get: function(attribute) {
                    switch(attribute) {
                        case "status":
                            return "ready";
                        case "url":
                            return "https://some.test.com";
                    }
                }
            };
        });

        instance.refs.component.forceUpdate();

        footer = TestUtils.findRenderedDOMComponentWithClass(instance, "modal-footer");
        downloadBtn = footer.getDOMNode().children[1];
        TestUtils.Simulate.click(downloadBtn);

        expect( onDownload ).toBeCalled();
    });

    it("does not call onDownload when download button is clicked but no exported bom is available", function() {
        var footer;
        var downloadBtn;

        instance.refs.component.state.allExportBoms.last = jest.genMockFunction().mockImplementation(function() {
            return;
        });

        instance.refs.component.forceUpdate();

        footer = TestUtils.findRenderedDOMComponentWithClass(instance, "modal-footer");
        downloadBtn = footer.getDOMNode().children[1];
        TestUtils.Simulate.click(downloadBtn);

        expect( onDownload ).not.toBeCalled();
    });

    it("does not call onDownload when download button is clicked but exported bom has no url", function() {
        var footer;
        var downloadBtn;

        instance.refs.component.state.allExportBoms.last = jest.genMockFunction().mockImplementation(function() {
            return {
                get: function(attribute) {
                    return;
                }
            };
        });

        instance.refs.component.forceUpdate();

        footer = TestUtils.findRenderedDOMComponentWithClass(instance, "modal-footer");
        downloadBtn = footer.getDOMNode().children[1];
        TestUtils.Simulate.click(downloadBtn);

        expect( onDownload ).not.toBeCalled();
    });

    it("calls onCancel when cancel button is clicked", function() {
        var footer = TestUtils.findRenderedDOMComponentWithClass(instance, "modal-footer");
        var cancelBtn = footer.getDOMNode().children[0];
        TestUtils.Simulate.click(cancelBtn);

        expect( onCancel ).toBeCalled();
    });

    // it("retries export when export button is clicked", function() {
        //TODO
    // });

});
