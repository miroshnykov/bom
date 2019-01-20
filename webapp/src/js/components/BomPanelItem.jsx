"use strict";

var React = require("react");
var backboneMixin = require("backbone-react-component");

var BomActions = require("actions/BomActions");
var AppDispatcher = require("dispatcher/AppDispatcher");
var Modal = require("components/modals/Modal.jsx");
var BomPanelItemView = require("components/BomPanelItemView.jsx");

module.exports = React.createClass({
    mixins: [backboneMixin],

    propTypes: {
        productId: React.PropTypes.number.isRequired,
        onSave: React.PropTypes.func,
        onCancel: React.PropTypes.func
    },

    render: function() {
        var bom = this.getModel();

        return <BomPanelItemView
            name={bom.get("name")}
            itemCount={bom.getItemCount()}
            bomId={bom.id}
            productId={this.props.productId}
            onDelete={this.onDelete} />;
    },

    onDelete: function(event) {
        AppDispatcher.dispatch({
            action: {
                type: "show-modal"
            },
            modal: (
                <Modal
                    title="Delete BoM"
                    saveLabel="Confirm"
                    dismissLabel="Cancel"
                    onConfirm={this.onDeleteConfirm}>
                    Are you sure you want to permanently delete this BoM?
                </Modal>
            )
        });
   },

    onDeleteConfirm: function() {
        var bom = this.getModel();
        BomActions.destroy({bomId: bom.id});
    }
});
