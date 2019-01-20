var React = require("react");
var Navigation = require("react-router").Navigation;

var Table = require("react-bootstrap").Table;
var Button = require("react-bootstrap").Button;
var ButtonToolbar = require("react-bootstrap").ButtonToolbar;
var Glyphicon = require("react-bootstrap").Glyphicon;

var BomItem = require("../components/BomItem.react");
var TextInput = require("../components/TextInput.react");
var BomActions = require("../actions/BomActions");

var BomSection = React.createClass({displayName: "BomSection",
    mixins: [Navigation],

    propTypes: {
        bom: React.PropTypes.object.isRequired,
        headers: React.PropTypes.array.isRequired,
        allFields: React.PropTypes.object.isRequired,
        selectedItemIds: React.PropTypes.array.isRequired,
        readonly: React.PropTypes.bool
    },

    getInitialState: function() {
        return {
            isEditing: false,
            isAdding: false
        };
    },

    /**
    * @return {object}
    */
    render: function() {
        var bom = this.props.bom;
        var allFields = this.props.allFields;
        var newItem;

        return (
            React.createElement("tbody", null, 
                bom.getItems().map(function(result) {
                    return React.createElement(BomItem, {
                        key: result.id || result.cid, 
                        bom: bom, 
                        item: result, 
                        headers: this.props.headers, 
                        allFields: allFields, 
                        selected: this._isSelected(result.id || result.cid), 
                        readonly: this._isReadOnly()});
                }, this), 
                newItem
            )
        );
    },

    _isSelected: function(id) {
        return _.indexOf(this.props.selectedItemIds, id) !== -1;
    },

    _isReadOnly: function() {
        var bom = this.props.bom;
        return this.props.readonly || (bom && (bom.isNew() || bom.isDirty()));
    }

});

module.exports = BomSection;
