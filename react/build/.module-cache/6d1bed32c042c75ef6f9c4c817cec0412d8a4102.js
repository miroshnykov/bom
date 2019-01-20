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
        fields: React.PropTypes.array.isRequired,
        allFields: React.PropTypes.object.isRequired,
        selectedIds: React.PropTypes.array.isRequired,
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
        // var nameElement;
        var newItem;

        // if (this.state.isEditing && !this.props.readonly) {
        //     nameElement = (
        //         <TextInput
        //             wrapperClassName="col-md-2"
        //             label="Name"
        //             onSave={this._onSaveName}
        //             value={bom.get("name")} />);
        // }
        // else {
        //     nameElement = (<div>
        //         <h2>{this.props.name ? this.props.name : bom.get("name")}</h2>
        //         <ButtonToolbar>
        //             <Button
        //                 className="btn-nobg"
        //                 onClick={this._onEditName} >
        //                 <Glyphicon glyph="pencil" />
        //             </Button>
        //             <Button
        //                 className="btn-nobg"
        //                 onClick={this._onAddItem} >
        //                 <Glyphicon glyph="plus" />
        //             </Button>
        //         </ButtonToolbar>
        //     </div>);
        // }

        //TODO sort components here?

        return (
            React.createElement("tbody", null, 
                bom.getItems().map(function(result) {
                    return React.createElement(BomItem, {
                        key: result.id || result.cid, 
                        bom: bom, 
                        item: result, 
                        fields: this.props.fields, 
                        allFields: allFields, 
                        selected: this._isSelected(result.id || result.cid), 
                        readonly: this.props.readonly});
                }, this), 
                newItem
            )
        );
    },

    _isSelected: function(id) {
        return _.indexOf(this.props.selectedIds, id) !== -1;
    },

    // _onEditName: function(event) {
    //     if (this.props.readonly) { return; }

    //     this.setState({isEditing: true});
    // },

    // _onSaveName: function(name) {
    //     if (name !== this.props.bom.get("name")) {
    //       BomActions.updateName(this.props.bom.id, name);
    //     }
    //     this.setState({isEditing: false});
    // },

    // _onAddItem: function(event) {
    //     if (this.props.readonly) { return; }

    //     //TODO
    //     //if one or more items are selected, insert after last selected item (lowest one)

    //     BomActions.addItem(this.props.bom.id || this.props.bom.cid);
    // }

    // _onImport: function(event) {
    //     var product = this.props.product;
    //     var bom = this.props.bom;
    //     var items = bom.getItems();

    //     if (items.length) {
    //         if (confirm("This BoM contains " + items.length + " item" + (items.length>1?"s":"") + ". All items will be deleted and replaced by your import. Are you sure you want to import in this BoM?")) {
    //             this.transitionTo("bomImport", {
    //                 productId: product.id || product.cid, bomId: bom.id || bom.cid
    //             });
    //         }
    //     }
    //     else {
    //         this.transitionTo("bomImport", {
    //             productId: product.id || product.cid, bomId: bom.id || bom.cid
    //         });
    //     }
    // },

});

module.exports = BomSection;
