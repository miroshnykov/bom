"use strict";

var React = require("react");
var BomFieldInput = require("components/BomFieldInput.jsx");
var TypeConstants = require("constants/TypeConstants");

var Button = require("react-bootstrap").Button;
var ButtonToolbar = require("react-bootstrap").ButtonToolbar;
var Glyphicon = require("react-bootstrap").Glyphicon;

var cx = require("react/lib/cx");

var BomField = React.createClass({

    propTypes: {
        index: React.PropTypes.number.isRequired,
        header: React.PropTypes.object.isRequired,
        field: React.PropTypes.object,
        onAddColumn: React.PropTypes.func.isRequired,
        onEditColumn: React.PropTypes.func.isRequired,
        readonly: React.PropTypes.bool
    },

    render: function() {
        var header = this.props.header;
        var attribute = this.props.header ? this.props.header.attribute : undefined;
        var field = this.props.field;

        return (
            <th className={cx({
                "bom-field": true,
                "compact": field && field.get("typeId") === TypeConstants.BOOLEAN,
                "editing": false,
                "readonly": this.isReadOnly() })} >
                <div className="btn-add-column-wrapper btn-add-column-left btn-circle">
                    <Button
                        className="btn-circle btn-add-column"
                        bsStyle="primary"
                        onClick={this.onAddColumnBefore} >
                        <Glyphicon
                            glyph="plus" />
                    </Button>
                </div>
                <div className="btn-add-column-wrapper btn-add-column-right btn-circle">
                    <Button
                        className="btn-circle btn-add-column"
                        bsStyle="primary"
                        onClick={this.onAddColumnAfter} >
                        <Glyphicon
                            glyph="plus" />
                    </Button>
                </div>
                <div className="btn-group column-name">
                    {header.name}
                </div>
                <ButtonToolbar>
                    <Button className="btn-nobg" onClick={this.onEditColumn} disabled={this.isReadOnly()} >
                        <Glyphicon glyph="pencil" />
                    </Button>
                </ButtonToolbar>
            </th>
        );
    },

    isReadOnly: function() {
        var attribute = this.props.header ? this.props.header.attribute : undefined;
        return this.props.readonly || (attribute && attribute.isStateSending());
    },

    onAddColumnBefore: function(event) {
        this.props.onAddColumn(this.props.index);
    },

    onAddColumnAfter: function(event) {
        this.props.onAddColumn(this.props.index+1);
    },

    onEditColumn: function(index) {
        this.props.onEditColumn(this.props.index);
    },

});

module.exports = BomField;
