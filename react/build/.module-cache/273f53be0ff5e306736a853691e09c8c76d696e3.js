jest.dontMock("../Bom.react.js");
jest.dontMock("jquery-nicescroll");
jest.mock("../../stores/BomStore");
jest.mock("../../stores/ProductStore");
jest.mock("../../stores/FieldStore");
jest.mock("../../stores/FieldTypeStore");
jest.mock("../../stores/SelectedBomItemStore");
jest.mock("../../models/BomModel");
jest.mock("../../models/ProductModel");
jest.mock("../../actions/BomActions");

jQuery = $ = require("jquery");

// Append script to fix niceScroll bug that fails outside of a document
var script = document.createElement( "script" );
script.type = "text/javascript";
script.src = "workaround";
$("head").append( script );

require("jquery-nicescroll");

Backbone = require("backbone");
Backbone.$ = $;

_ = require("underscore");

describe("Bom.react", function() {
    var React = require("react/addons");
    var TestUtils = React.addons.TestUtils;
    var stubRouterContext = require("../../utils/stubRouterContext.react");

    var BomStore;
    var ProductStore;
    var FieldStore = require("../../stores/FieldStore");
    var FieldTypeStore = require("../../stores/FieldTypeStore");
    var SelectedBomItemStore;
    var BomModel = require("../../models/BomModel");
    var ProductModel = require("../../models/ProductModel");
    var BomActions = require("../../actions/BomActions");
    var Bom = require("../Bom.react");

    var container;
    var instance;

    beforeEach(function() {
        var Wrapper;

        BomActions.exportItems.mockClear();

        BomStore = require("../../stores/BomStore");
        BomStore.getDescendantBomsOfBom = jest.genMockFunction().mockReturnValue( [] );

        BomStore.get = jest.genMockFunction().mockImplementation(function() {
            var model = new BomModel();
            model.id = 1;
            model.getColumns = jest.genMockFunction().mockReturnValue( [] );
            model.getItems = jest.genMockFunction().mockReturnValue( [] );
            return model;
        });

        ProductStore = require("../../stores/ProductStore");
        ProductStore.get = jest.genMockFunction().mockImplementation(function() {
            var model = new ProductModel();
            model.id = 2;
            return model;
        });

        SelectedBomItemStore = require("../../stores/SelectedBomItemStore");
        SelectedBomItemStore.getItemIdsForBom = jest.genMockFunction().mockReturnValue( [] );

        Wrapper = stubRouterContext(Bom, {
            params: {
                bomId: 1,
                productId: 2
            },
            allBoms: BomStore,
            allProducts: ProductStore,
            allFields: FieldStore,
            allTypes: FieldTypeStore,
            allSelectedBomItems: SelectedBomItemStore
        });

        container = document.createElement('div');
        instance = React.render(React.createElement(Wrapper, null), container);
    });

    afterEach(function() {
        React.unmountComponentAtNode(container);
    });

    it("exports and opens modal the bom items when _onExport is called", function() {
        instance.refs.component._getColumnsForFieldSet = jest.genMockFunction().mockImplementation(function() {
            return [
                { name: "Attribute #1", fieldId: 1 },
                { name: "Attribute #2", fieldId: 2 }
            ];
        });

        instance.refs.component._getBom = jest.genMockFunction().mockImplementation(function() {
            var model = new BomModel();
            model.id = 1;
            model.getColumns = jest.genMockFunction().mockReturnValue( [] );
            model.getItems = jest.genMockFunction().mockReturnValue(
               [ { id: 1 }, { id: 2 }, { id: 3 } ]
            );
            return model;
        });

        instance.refs.component.setState = jest.genMockFunction();

        instance.refs.component._onExport();

        expect( BomActions.exportItems ).toBeCalledWith(
            [{ name: "Attribute #1", fieldId: 1 },
             { name: "Attribute #2", fieldId: 2 }],
            [ 1, 2, 3 ]
            //product name
        );
        expect( instance.refs.component.setState ).toBeCalledWith({
            isExportModalOpen: true
        });
    });

    it("does not export or open modal the bom items when _onExport is called if bom is not valid", function() {
        instance.refs.component._getBom = jest.genMockFunction().mockReturnValue( undefined );
        instance.refs.component._onExport();
        expect( BomActions.exportItems ).not.toBeCalled();
    });

    it("closes modal when _onCancelExport is called", function() {
        instance.refs.component.setState({
            isExportModalOpen: true
        });

        instance.refs.component._onCancelExport();
        expect( instance.refs.component.state.isExportModalOpen ).toBe( false );
    });

    it("closes modal when _onDownloadExport is called", function() {
        instance.refs.component.setState({
            isExportModalOpen: true
        });

        instance.refs.component._onDownloadExport();

        expect( instance.refs.component.state.isExportModalOpen ).toBe( false );
    });
});
