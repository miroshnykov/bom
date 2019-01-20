"use strict";

var _ = require("underscore");
var React = require("react");
var ButtonToolbar = require("react-bootstrap").ButtonToolbar;
var Button = require("react-bootstrap").Button;
var SplitButton = require("react-bootstrap").SplitButton;
var MenuItem = require("react-bootstrap").MenuItem;
var Glyphicon = require("react-bootstrap").Glyphicon;
var TextInput = require("components/TextInput.jsx");
var BomViewStore = require("stores/BomViewStore");
var Modal = require("components/modals/Modal.jsx");

var SaveViewModal = React.createClass({

  propTypes: {
    onConfirm: React.PropTypes.func.isRequired,
    columns: React.PropTypes.array.isRequired,
    view: React.PropTypes.object
  },

  getInitialState: function() {
    return {
        columns: this.props.columns.map(_.clone),
        name: this.props.view ? this.props.view.get("name") : undefined,
        view: this.props.view
    };
  },

  render: function() {
    var columns = this.state.columns;

    return (
        <Modal
            dismissLabel="Cancel"
            saveLabel="Save"
            title="Custom View"
            className="save-view-modal"
            disableConfirm={!this.state.name}
            onConfirm={this._onSave}
            >
            <div className="modal-body">
                <div>
                    <form className="form-horizontal">
                        <div className="form-group">
                            <label className="control-label col-xs-2">
                                <span>View</span>
                            </label>
                            <div className="col-xs-10">
                                {this._renderViewSelector()}
                                <TextInput
                                    ref="name"
                                    label="Name"
                                    placeholder="Name"
                                    value={this.state.name}
                                    onSave={this._onSaveName}
                                    onChange={this._onChangeName}
                                    onCancel={this._onCancelName}
                                    groupClassName="name-group" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="control-label col-xs-2">
                                <span>Columns</span>
                            </label>
                            <div className="col-xs-10">
                                <ul className="list-unstyled control-content">
                                {columns.map(function(column, index) {
                                    return (
                                        <li className={column.removed ? "removed" : undefined} key={column.fieldId}>
                                            <span>{column.name}</span>
                                            <ButtonToolbar>
                                                <Button
                                                    className="btn-nobg"
                                                    bsStyle="default"
                                                    onClick={this._onMoveColumnUp.bind(this, index)} >
                                                    <Glyphicon glyph="triangle-top" />
                                                </Button>
                                                <Button
                                                    className="btn-nobg"
                                                    bsStyle="default"
                                                    onClick={this._onMoveColumnDown.bind(this, index)} >
                                                    <Glyphicon glyph="triangle-bottom" />
                                                </Button>
                                                {column.removed ? (
                                                    <Button
                                                        className="btn-nobg"
                                                        bsStyle="default"
                                                        onClick={this._onAddColumn.bind(this, index)} >
                                                        <Glyphicon glyph="ok-circle" />
                                                    </Button>) : (
                                                    <Button
                                                        className="btn-nobg"
                                                        bsStyle="danger"
                                                        onClick={this._onRemoveColumn.bind(this, index)} >
                                                        <Glyphicon glyph="remove-circle" />
                                                    </Button>
                                                )}
                                            </ButtonToolbar>
                                        </li>);
                                }, this)}
                                </ul>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
        );
    },

    _renderViewSelector: function() {
        var view = this.state.view;
        var title = view ? view.get("name") : "New View";
        var options;

        // Get the saved custom views (if any)
        options = BomViewStore.getSaved().map(function(view) {
            return <MenuItem key={view.id || view.cid} eventKey={view.id || view.cid}>{view.get("name")}</MenuItem>
        });

        if (!_.isEmpty(options)) {
            options.push(<MenuItem key="new-divider" divider />);

            // Add option to save a new view
            options.push(<MenuItem
                key="_new"
                eventKey="_new">{"New View"}</MenuItem>);
        }

        return (
            <SplitButton
                bsStyle="default"
                title={title}
                onSelect={this._onSelectView}>
                {options}
            </SplitButton>);
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
            view = BomViewStore.get(id);
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

        this.props.onConfirm(this.state.name, _.pluck(columns, "fieldId"), view ? view.id || view.cid : undefined);
    }

});

module.exports = SaveViewModal;
