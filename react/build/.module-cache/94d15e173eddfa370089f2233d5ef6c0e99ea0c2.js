var React = require("react");
var Glyphicon = require('react-bootstrap').Glyphicon;
var OverlayTrigger = require('react-bootstrap').OverlayTrigger;
var Tooltip = require('react-bootstrap').Tooltip;

var BomItemField = require("../components/BomItemField.react");
var BomActions = require("../actions/BomActions");
var BomAttributeModel = require("../models/BomAttributeModel");

var cx = require("react/lib/cx");

var BomItem = React.createClass({displayName: "BomItem",

    propTypes: {
        bom: React.PropTypes.object.isRequired,
        item: React.PropTypes.object.isRequired,
        headers: React.PropTypes.array.isRequired,
        allFields: React.PropTypes.object.isRequired,
        selected: React.PropTypes.bool.isRequired,
        readonly: React.PropTypes.bool
    },

    /**
     * @return {object}
     */
    render: function() {
        var bom = this.props.bom;
        var item = this.props.item;
        var headers = this.props.headers;
        var allFields = this.props.allFields;
        var icon;

        // Only show when syncing as we are not saving until the first value
        if (item.isSyncing()) {
            icon = React.createElement(Glyphicon, {
              className: "glyphicon-spin", 
              bsSize: "small", 
              bsStyle: "default", 
              glyph: "repeat"});
        }
        else if (!item.isValid()) {
            icon = (
                React.createElement(OverlayTrigger, {placement: "top", overlay: 
                    React.createElement(Tooltip, null, 
                        item.getValidationErrorMessages().map(function(msg, index) {
                            return React.createElement("div", {key: index}, msg)
                        })
                    )}, 
                    React.createElement(Glyphicon, {
                        bsSize: "small", 
                        bsStyle: "warning", 
                        glyph: "warning-sign"})
                ));
        }

        return (
          React.createElement("tr", {className: cx({
                "active": this.props.selected,
                "readonly": this._isReadOnly() }), 
              onClick: this._onSelect}, 

            React.createElement("td", {className: cx({
                "readonly": this._isReadOnly(),
                "text-center": true })}, 
                icon
            ), 

            headers.map(function(result, index) {
              return React.createElement(BomItemField, {
                key: result.fieldId, 
                value: bom.getItemValueForField(item.id || item.cid, result.fieldId), 
                field: allFields.get(result.fieldId), 
                readonly: this._isReadOnly(), 
                onSave: this._saveValue});
            }, this)

          )
        );
    },

    _isReadOnly: function() {
        var item = this.props.item;
        return this.props.readonly || (item && item.isSyncing());
    },

    _onSelect: function() {
        BomActions.selectItem(
            this.props.bom.id || this.props.bom.cid,
            this.props.item.id || this.props.item.cid,
            !this.props.selected);
    },

    _saveValue: function(fieldId, content) {
        var header;
        var attribute = this.props.bom.getAttributeForField(fieldId)

        // If an attribute doesn't exist, pass the values to create a new one
        if (!attribute) {
            // Get the header for this field id (to find its name)
            header = this._getHeaderForField(fieldId);
            if (!header) { return; }

            attribute = {
                fieldId: fieldId,
                name: header.name
            }
        }

        BomActions.updateItem(
            this.props.bom.id || this.props.bom.cid,
            this.props.item.id || this.props.item.cid,
            attribute,
            content);

        this.forceUpdate();
    },

    _getHeaderForField: function(fieldId) {
        return _.findWhere(this.props.headers, {
            fieldId: fieldId
        });
    }

});

module.exports = BomItem;
