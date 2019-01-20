/*global jest:false, expect: false, Backbone:true, $:true*/
"use strict";

jest.dontMock("components/DropdownButton.jsx");

describe("DropdownButton", function() {
  var React = require("react/addons");
  var TestUtils = React.addons.TestUtils;
  var Button = require("react-bootstrap").Button;
  var ButtonGroup = require("react-bootstrap").ButtonGroup;
  var MenuItem = require("react-bootstrap").MenuItem;
  var DropdownMenu = require("react-bootstrap").DropdownMenu;

  var DropdownButton = require("components/DropdownButton.jsx");

  var instance;

  it("renders button correctly", function() {
    instance = TestUtils.renderIntoDocument(
      <DropdownButton id="test" icon="caret">
        <MenuItem eventKey="1">MenuItem 1 content</MenuItem>
        <MenuItem eventKey="2">MenuItem 2 content</MenuItem>
      </DropdownButton>
    );

    var button = TestUtils.findRenderedComponentWithType(instance, Button).getDOMNode();

    //check the ButtonGroup
    expect(instance.getDOMNode().className).toMatch(/\bbtn-group\b/);
    expect(instance.getDOMNode().className).not.toMatch(/\bopen\b/);
    expect(instance.getDOMNode().id).toEqual("test");

    //check the Button
    expect(button.id).toBe("test" + "-button");
    expect(button.className).toMatch(/\bbtn\b/);
    expect(button.className).toMatch(/\bdropdown-toggle\b/);
    expect(button.nodeName).toBe("BUTTON");
    expect(button.type).toBe("button");
    expect(button.lastChild.className).toMatch(/\bfa-caret\b/);
  });

  it("renders menu correctly", function() {
    instance = TestUtils.renderIntoDocument(
      <DropdownButton>
        <MenuItem eventKey="1">MenuItem 1 content</MenuItem>
        <MenuItem eventKey="2">MenuItem 2 content</MenuItem>
      </DropdownButton>
    );

    //check the menu and its MenuItems
    var menu = TestUtils.findRenderedComponentWithType(instance, DropdownMenu);
    var allMenuItems = TestUtils.scryRenderedComponentsWithType(menu, MenuItem);
    expect(allMenuItems.length).toEqual(2);
    expect(menu.props["aria-labelledby"]).toEqual("dropdown-menu-button");
    expect(menu.props.pullRight).toBe(false);
  });

  it("renders menu with pullRight when pullRight property is set to true", function() {
    instance = TestUtils.renderIntoDocument(
      <DropdownButton pullRight>
        <MenuItem eventKey="1">MenuItem 1 content</MenuItem>
        <MenuItem eventKey="2">MenuItem 2 content</MenuItem>
      </DropdownButton>
    );

    //check the menu's pullRight property
    var menu = TestUtils.findRenderedComponentWithType(instance, DropdownMenu);
    expect(menu.props.pullRight).toBe(true);
  });

  it("doesn't render glypicon if glyphicon property is undefined", function() {
    instance = TestUtils.renderIntoDocument(
      <DropdownButton>
        <MenuItem eventKey="1">MenuItem 1 content</MenuItem>
        <MenuItem eventKey="2">MenuItem 2 content</MenuItem>
      </DropdownButton>
    );

    //check that no glyphicon is included
    var button = TestUtils.findRenderedComponentWithType(instance, Button).getDOMNode();
    expect(button.children.length).toBe(0);
  });

  it("uses default ids if id property is undefined", function() {
    instance = TestUtils.renderIntoDocument(
      <DropdownButton>
        <MenuItem eventKey="1">MenuItem 1 content</MenuItem>
        <MenuItem eventKey="2">MenuItem 2 content</MenuItem>
      </DropdownButton>
    );

    //check the ButtonGroup
    expect(instance.getDOMNode().id).toEqual("dropdown-menu");

    //check the Button
    var button = TestUtils.findRenderedComponentWithType(instance, Button).getDOMNode();
    expect(button.id).toBe("dropdown-menu-button");
  });

  it("opens when clicked", function() {
    instance = TestUtils.renderIntoDocument(
      <DropdownButton>
        <MenuItem eventKey="1">MenuItem 1 content</MenuItem>
        <MenuItem eventKey="2">MenuItem 2 content</MenuItem>
      </DropdownButton>
    );

    //check the ButtonGroup after a click on the Button
    TestUtils.SimulateNative.click(instance.refs.dropdownButton.getDOMNode());
    expect(instance.getDOMNode().className).toMatch(/\bopen\b/);
  });

  it("calls MenuItem onSelect with correct arguments when MenuItem is clicked", function() {
    var callback = jest.genMockFunction();

    instance = TestUtils.renderIntoDocument(
      <DropdownButton>
        <MenuItem eventKey="1">MenuItem 1 content</MenuItem>
        <MenuItem eventKey="2" href="testHref" target="testTarget" onSelect={callback}>MenuItem 2 content</MenuItem>
      </DropdownButton>
    );


    var menuItems = TestUtils.scryRenderedComponentsWithType(instance, MenuItem);
    expect(menuItems.length).toBe(2);
    TestUtils.SimulateNative.click(
      TestUtils.findRenderedDOMComponentWithTag(menuItems[1], 'a')
    );

    //check the callback and that the menu closed
    expect(callback).toBeCalledWith("2", "testHref", "testTarget");
    expect(instance.state.open).toBe(false);
  });

  it("closes menu when MenuItem without onSelect is clicked", function() {
    instance = TestUtils.renderIntoDocument(
      <DropdownButton>
        <MenuItem eventKey="1">MenuItem 1 content</MenuItem>
        <MenuItem eventKey="2">MenuItem 2 content</MenuItem>
      </DropdownButton>
    );

    //get the menuitems and click the second one
    var menuItems = TestUtils.scryRenderedComponentsWithType(instance, MenuItem);
    expect(menuItems.length).toBe(2);
    TestUtils.SimulateNative.click(
      TestUtils.findRenderedDOMComponentWithTag(menuItems[1], 'a')
    );

    //check that the menu is closed
    expect(instance.getDOMNode().className).not.toMatch(/\bopen\b/);
  });

  it("closes menu on click", function() {
    instance = TestUtils.renderIntoDocument(
      <DropdownButton>
        <MenuItem eventKey="1">MenuItem 1 content</MenuItem>
        <MenuItem eventKey="2">MenuItem 2 content</MenuItem>
      </DropdownButton>
    );

    //open the menu
    instance.setDropdownState(true);

    //generate a click
    var evt = document.createEvent('HTMLEvents');
    evt.initEvent('click', true, true);
    document.documentElement.dispatchEvent(evt);

    //check that it closed
    expect(instance.getDOMNode().className).not.toMatch(/\bopen\b/);
  });
});
