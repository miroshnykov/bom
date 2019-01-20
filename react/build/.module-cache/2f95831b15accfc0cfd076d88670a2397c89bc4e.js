jest.dontMock("../Header.react.js");
jest.dontMock("../../models/UserModel");
jest.mock("../../stores/RevisionStore");

Backbone = require("backbone");

describe("Header.react", function() {
  var React = require("react/addons");
  var TestUtils = React.addons.TestUtils;
  var stubRouterContext = require("../../utils/stubRouterContext.react");
  var DropdownButton = require("../DropdownButton.react");
  var MenuItem = require("react-bootstrap").MenuItem;

  var Header = require("../Header.react");
  var UserModel = require("../../models/UserModel");
  var RevisionStore = require("../../stores/RevisionStore");

  //number of MenuItem in the user menu
  var USER_MENUITEMS = 2;

  var instance;

  afterEach(function() {
    if (instance && TestUtils.isCompositeComponent(instance) && instance.isMounted()) {
      React.unmountComponentAtNode(instance.getDOMNode().parent);
    }
  });

  //TODO need to udpate this with latest header changes

  // it("renders header correctly", function() {
  //   var user = new UserModel({
  //     id: 1,
  //     email: "test@fabule.com",
  //     firstname: "Firstname",
  //     lastname: "Lastname"
  //   });

  //   var Wrapper = stubRouterContext(Header, {user: user, allRevisions: RevisionStore});

  //   instance = TestUtils.renderIntoDocument(
  //     <Wrapper />
  //   );

  //   expect(instance.getDOMNode().lastChild.firstChild.textContent).toMatch(/^Salut, $/);
  //   expect(instance.getDOMNode().lastChild.children[1].textContent).toMatch(/^Firstname$/);
  //   expect(TestUtils.findRenderedComponentWithType(instance, DropdownButton)).toBeDefined();
  // });

  // it("shows profile when Profile MenuItem is clicked", function() {
  //   var user = new UserModel({
  //     id: 1,
  //     email: "test@fabule.com",
  //     firstname: "Firstname",
  //     lastname: "Lastname"
  //   });

  //   var Wrapper = stubRouterContext(Header, {user: user});

  //   instance = TestUtils.renderIntoDocument(
  //     <Wrapper />
  //   );

  //   instance._renderedComponent.transitionTo = jest.genMockFunction();

  //   var menuItems = TestUtils.scryRenderedComponentsWithType(instance, MenuItem);
  //   expect(menuItems.length).toBe(USER_MENUITEMS);

  //   TestUtils.SimulateNative.click(
  //     TestUtils.findRenderedDOMComponentWithTag(menuItems[0], 'a')
  //   );
  //   expect(instance._renderedComponent.transitionTo).toBeCalledWith("profile");
  // });

  // it("signs out when Sign Out MenuItem is clicked", function() {
  //   var user = new UserModel({
  //     id: 1,
  //     email: "test@fabule.com",
  //     firstname: "Firstname",
  //     lastname: "Lastname"
  //   });

  //   var Wrapper = stubRouterContext(Header, {user: user});

  //   instance = TestUtils.renderIntoDocument(
  //     <Wrapper />
  //   );

  //   instance._renderedComponent.transitionTo = jest.genMockFunction();

  //   var menuItems = TestUtils.scryRenderedComponentsWithType(instance, MenuItem);
  //   expect(menuItems.length).toBe(USER_MENUITEMS);

  //   TestUtils.SimulateNative.click(
  //     TestUtils.findRenderedDOMComponentWithTag(menuItems[1], 'a')
  //   );
  //   expect(window.location.href).toMatch(/user\/signout\/$/);
  // });

  // it("gets correct display name when user's firstname not set but lastname is set", function() {
  //   var user = new UserModel({
  //     id: 1,
  //     email: "test@fabule.com",
  //     firstname: undefined,
  //     lastname: "Lastname"
  //   });

  //   var Wrapper = stubRouterContext(Header, {user: user});

  //   instance = TestUtils.renderIntoDocument(
  //     <Wrapper />
  //   );

  //   expect(instance.getDOMNode().lastChild.children[1].textContent).toMatch(/^Lastname$/);
  // });

  // it("gets correct display name when user's firstname and lastname are not set but email is set", function() {
  //   var user = new UserModel({
  //     id: 1,
  //     email: "test@fabule.com",
  //     firstname: undefined,
  //     lastname: undefined
  //   });

  //   var Wrapper = stubRouterContext(Header, {user: user});

  //   instance = TestUtils.renderIntoDocument(
  //     <Wrapper />
  //   );

  //   expect(instance.getDOMNode().lastChild.children[1].textContent).toMatch(/^test$/);
  // });

  // it("gets correct default display name when user's firstname, lastname and email are not set", function() {
  //   var user = new UserModel({
  //     id: 1,
  //     email: undefined,
  //     firstname: undefined,
  //     lastname: undefined
  //   });

  //   var Wrapper = stubRouterContext(Header, {user: user});

  //   instance = TestUtils.renderIntoDocument(
  //     <Wrapper />
  //   );

  //   expect(instance.getDOMNode().lastChild.children[1].textContent).toMatch(/^Partner$/);
  // });
});
