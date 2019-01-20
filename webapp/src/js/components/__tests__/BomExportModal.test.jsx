/*global jest:false, expect: false, Backbone:true, $:true*/
"use strict";

jest.dontMock("components/modals/BomExport.jsx");

Backbone = require("backbone");

xdescribe("BomExportModal", function() {
    var React = require("react/addons");
    var TestUtils = React.addons.TestUtils;
    var stubRouterContext = require("utils/stubRouterContext");

    var BomExportModal = require("components/modals/BomExport.jsx");
    var BomExportStore;

    var onDownload;
    var onCancel;
    var container;
    var instance;

    beforeEach(function() {
        var Wrapper;

        BomExportStore = require("stores/BomExportStore");

        onDownload = jest.genMockFunction();
        onCancel = jest.genMockFunction();

        Wrapper = stubRouterContext(BomExportModal, {
            onDownload: onDownload,
            onCancel: onCancel
        });

        try {
            instance = TestUtils.renderIntoDocument(<Wrapper />);
        } catch (e) {
            console.error("error: ", e);
        }
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
});
