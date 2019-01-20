var React = require("react");
var Modal = require("react-bootstrap").Modal;
var ButtonToolbar = require("react-bootstrap").ButtonToolbar;
var Button = require("react-bootstrap").Button;
var SplitButton = require("react-bootstrap").SplitButton;
var MenuItem = require("react-bootstrap").MenuItem;
var Glyphicon = require("react-bootstrap").Glyphicon;
var TextInput = require("../components/TextInput.react");

var SaveViewModal = React.createClass({displayName: "SaveViewModal",

  propTypes: {
    onCancel: React.PropTypes.func.isRequired,
    onSave: React.PropTypes.func.isRequired,
    onDelete: React.PropTypes.func,
    columns: React.PropTypes.array.isRequired,
    view: React.PropTypes.object,
    allViews: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
        columns: this.props.columns.map(_.clone),
        name: this.props.view ? this.props.view.get("name") : undefined,
        view: this.props.view
    };
  },

  /**
   * @return {object}
   */
  render: function() {
    var columns = this.state.columns;
    var deleteBtn;

    if (this.state.view && this.props.onDelete) {
        deleteBtn = (
            React.createElement(Button, {className: "pull-left", bsStyle: "danger", onClick: this._onDelete}, "Delete"));
    }

    return (
        React.createElement(Modal, React.__spread({},  this.props, 
            {onRequestHide: this.props.onCancel, 
            bsStyle: "primary", 
            title: "Save Custom View", 
            animation: false, 
            className: "modal-save-view"}), 
            React.createElement("div", {className: "modal-body"}, 
                React.createElement("div", null, 
                    React.createElement("form", {className: "form-horizontal"}, 
                        React.createElement("div", {className: "form-group"}, 
                            React.createElement("label", {className: "control-label col-xs-2"}, 
                                React.createElement("span", null, "View")
                            ), 
                            React.createElement("div", {className: "col-xs-10"}, 
                                this._renderViewSelector(), 
                                React.createElement(TextInput, {
                                    ref: "name", 
                                    label: "Name", 
                                    placeholder: "Name", 
                                    value: this.state.name, 
                                    onSave: this._onSaveName, 
                                    onChange: this._onChangeName, 
                                    onCancel: this._onCancelName, 
                                    groupClassName: "name-group"})
                            )
                        ), 
                        React.createElement("div", {className: "form-group"}, 
                            React.createElement("label", {className: "control-label col-xs-2"}, 
                                React.createElement("span", null, "Columns")
                            ), 
                            React.createElement("div", {className: "col-xs-10"}, 
                                React.createElement("ul", {className: "list-unstyled control-content"}, 
                                columns.map(function(column, index) {
                                    return (
                                        React.createElement("li", {className: column.removed ? "removed" : undefined, key: column.fieldId}, 
                                            React.createElement("span", null, column.name), 
                                            React.createElement(ButtonToolbar, null, 
                                                React.createElement(Button, {
                                                    className: "btn-nobg", 
                                                    bsStyle: "default", 
                                                    onClick: this._onMoveColumnUp.bind(this, index)}, 
                                                    React.createElement(Glyphicon, {glyph: "triangle-top"})
                                                ), 
                                                React.createElement(Button, {
                                                    className: "btn-nobg", 
                                                    bsStyle: "default", 
                                                    onClick: this._onMoveColumnDown.bind(this, index)}, 
                                                    React.createElement(Glyphicon, {glyph: "triangle-bottom"})
                                                ), 
                                                column.removed ? (
                                                    React.createElement(Button, {
                                                        className: "btn-nobg", 
                                                        bsStyle: "default", 
                                                        onClick: this._onAddColumn.bind(this, index)}, 
                                                        React.createElement(Glyphicon, {glyph: "ok-circle"})
                                                    )) : (
                                                    React.createElement(Button, {
                                                        className: "btn-nobg", 
                                                        bsStyle: "danger", 
                                                        onClick: this._onRemoveColumn.bind(this, index)}, 
                                                        React.createElement(Glyphicon, {glyph: "remove-circle"})
                                                    )
                                                )
                                            )
                                        ));
                                }, this)
                                )
                            )
                        )
                    )
                )
            ), 
            React.createElement("div", {className: "modal-footer"}, 
                deleteBtn, 
                React.createElement(Button, {onClick: this.props.onCancel}, "Close"), 
                React.createElement(Button, {bsStyle: "primary", onClick: this._onSave, disabled: !this._canSave()}, "Save")
            )
        )
        );
    },

    _renderViewSelector: function() {
        var allViews = this.props.allViews;
        var view = this.state.view;
        var title = view ? view.get("name") : "New View";
        var options;

        // Get the saved custom views (if any)
        options = allViews.getSaved().map(function(view) {
            return React.createElement(MenuItem, {key: view.id || view.cid, eventKey: view.id || view.cid}, view.get("name"))
        });

        if (!_.isEmpty(options)) {
            options.push(React.createElement(MenuItem, {key: "new-divider", divider: true}));

            // Add option to save a new view
            options.push(React.createElement(MenuItem, {
                key: "_new", 
                eventKey: "_new"}, "New View"));
        }

        return (
            React.createElement(SplitButton, {
                bsStyle: "default", 
                title: title, 
                onSelect: this._onSelectView}, 
                options
            ));
    },

    // View

    _onSelectView: function(id) {
        var view;

        if (id === "_new") {
            this.setState({
                view: undefined,
                name: ""
            })
        }
        else {
            view = this.props.allViews.get(id);
            if (!view) { return; }

            this.setState({
                view: view,
                name: view.get("name")
            });
        }
    },

    // Name

    _onCancelName: function() {},

    _onChangeName: function(name) {
        this.setState({name: name});
    },

    _onSaveName: function(name) {
        this.setState({name: name});
    },

    // Columns

    _onMoveColumnUp: function(index) {
        var columns;

        if (index < 1) { return; }

        columns = this.state.columns.map(_.clone);
        columns[index] = columns.splice(index-1, 1, columns[index])[0];
        this.setState({columns: columns});    },

    _onMoveColumnDown: function(index) {
        var columns;

        if (index >= this.state.columns.length-1) { return; }

        columns = this.state.columns.map(_.clone);
        columns[index] = columns.splice(index+1, 1, columns[index])[0];

        this.setState({columns: columns});
    },

    _onRemoveColumn: function(index) {
        var columns = this.state.columns.map(_.clone);
        columns[index].removed = true;
        this.setState({columns: columns});
    },

    _onAddColumn: function(index) {
        var columns = this.state.columns.map(_.clone);
        delete columns[index].removed;
        this.setState({columns: columns});
    },

    // View

    _canSave: function() {
        return !_.isEmpty(this.state.name) &&
            !_.isEmpty(_.filter(this.state.columns, function(column) {
                return !column.removed;
            }));
    },

    _onSave: function(event) {
        var columns = this.state.columns.map(_.clone);
        var view = this.state.view;

        columns = _.filter(columns, function(column) {
            return !column.removed;
        });

        this.props.onSave(this.state.name, _.pluck(columns, "fieldId"), view ? view.id || view.cid : undefined);
    },

    _onDelete: function(event) {
        if (!this.state.view || !this.props.onDelete) { return; }
        this.props.onDelete( this.state.view.id || this.state.view.cid );
    }

});

module.exports = SaveViewModal;
