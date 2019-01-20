"use strict";

var _ = require("underscore");
var React = require("react");
var Glyphicon = require("react-bootstrap").Glyphicon;
var OverlayTrigger = require("react-bootstrap").OverlayTrigger;
var Tooltip = require("react-bootstrap").Tooltip;

var Checkbox = require("components/forms/Checkbox.jsx");
var BomItemField = require("components/BomItemField.jsx");
var BomAttributeModel = require("models/BomAttributeModel");
var InputConstants = require("constants/InputConstants");
var FieldStore = require("stores/FieldStore");

var BomItemToolbar = require("components/BomItemToolbar.jsx");
var AppDispatcher = require("dispatcher/AppDispatcher");
var CommentsModal = require("components/modals/Comments.jsx");

var cx = require("react/lib/cx");

var BomItem = React.createClass({

    propTypes: {
        bom: React.PropTypes.object.isRequired,
        item: React.PropTypes.object.isRequired,
        headers: React.PropTypes.array.isRequired,
        readonly: React.PropTypes.bool,
        sequence: React.PropTypes.number.isRequired
    },

    componentDidMount: function() {
        this.props.item.on("change:state", this.onChange);
        this.props.item.on("change:lastSelected", this.onChange);
        this.props.item.on("change:selectedAt", this.onChange);
        this.props.item.on("change:alerts", this.onChange);
        this.props.item.on("change:totalComments", this.onChange);
        this.props.item.on("change:totalWarnings", this.onChange);
        this.props.item.on("change:totalErrors", this.onChange);
        this.props.item.on("change:isApproved", this.onChange);
        this.props.item.getValues().on("add remove", this.onChange);
    },

    componentWillUnmount: function() {
        this.props.item.off("change:state", this.onChange);
        this.props.item.off("change:lastSelected", this.onChange);
        this.props.item.off("change:selectedAt", this.onChange);
        this.props.item.off("change:alerts", this.onChange);
        this.props.item.off("change:isApproved", this.onChange);
        this.props.item.off("change:totalComments", this.onChange);
        this.props.item.off("change:totalWarnings", this.onChange);
        this.props.item.off("change:totalErrors", this.onChange);
        this.props.item.getValues().off("add remove", this.onChange);
    },

    componentWillReceiveProps: function(nextProps) {
        if (this.props.item !== nextProps.item) {
            this.props.item.off("change:state", this.onChange);
            this.props.item.off("change:lastSelected", this.onChange);
            this.props.item.off("change:selectedAt", this.onChange);
            this.props.item.off("change:alerts", this.onChange);
            this.props.item.off("change:isApproved", this.onChange);
            this.props.item.off("change:totalComments", this.onChange);
            this.props.item.off("change:totalWarnings", this.onChange);
            this.props.item.off("change:totalErrors", this.onChange);
            this.props.item.getValues().off("add remove", this.onChange);

            nextProps.item.on("change:state", this.onChange);
            nextProps.item.on("change:lastSelected", this.onChange);
            nextProps.item.on("change:selectedAt", this.onChange);
            nextProps.item.on("change:alerts", this.onChange);
            nextProps.item.on("change:isApproved", this.onChange);
            nextProps.item.on("change:totalComments", this.onChange);
            nextProps.item.on("change:totalWarnings", this.onChange);
            nextProps.item.on("change:totalErrors", this.onChange);
            nextProps.item.getValues().on("add remove", this.onChange);
        }
    },

    onChange: function() {
        this.forceUpdate();
    },

    render: function() {
        var item = this.props.item;
        var bom = this.props.bom;
        var headers = this.props.headers;
        var icon;

        return (
          <tr className={cx({
                "bomitem": true,
                "selected": item.isSelected(),
                "last-selected": item.isSelected() && bom.getItems().getLastSelected() === item,
                "readonly": this.isReadOnly() })} >
            <td>
                <Checkbox checked={item.isSelected()} onClick={this.onSelect} />
            </td>
            <td>
                <BomItemToolbar
                    comments={item.get("totalComments")}
                    warnings={item.get("totalWarnings") + _.keys(item.get("alerts")).length}
                    errors={item.get("totalErrors")}
                    isApproved={item.get("isApproved")}
                    onClickComments={this.onClickComments}
                    onClickApprove={this.onClickApprove}
                    onClickAlerts={this.onClickAlerts}/>
            </td>
            <td className={cx({
                "readonly": this.isReadOnly(),
                "text-center": true })}>
                {this.props.sequence}
            </td>

            {headers.map(function(result, index) {
                var field = FieldStore.get(result.fieldId)
                var attribute = bom.getAttributeForField(result.fieldId);
                var value = attribute ? item.getValueForAttribute(attribute.id || attribute.cid) : undefined;
                return <BomItemField
                    ref={"value-" + result.fieldId}
                    key={result.fieldId}
                    value={value}
                    item={item}
                    field={field}
                    bom={bom}
                    readonly={this.isReadOnly()}
                    onNext={this.editNextValue}
                    onSave={this.onSaveValue} />;
            }, this)}

          </tr>
        );
    },

    onClickComments: function() {
        AppDispatcher.dispatch({
            action: {
                type: "show-modal"
            },
            modal: (<CommentsModal entity={this.props.item} title="BoM Item" />)
        });
    },

    onClickApprove: function() {
        var item = this.props.item;

        var isApproved = !item.get("isApproved");
        item.save({isApproved: isApproved});
    },

    onClickAlerts: function() {
        AppDispatcher.dispatch({
            action: {
                type: "show-modal"
            },
            modal: (<CommentsModal entity={this.props.item} title="BoM Item" alerts={true} />)
        });
    },

    isReadOnly: function() {
        var item = this.props.item;
        return this.props.readonly || (item && item.isStateSending());
    },

    onSelect: function(selected) {
        var item = this.props.item;

        if (this.isReadOnly()) { return; };

        item.setSelected( !item.isSelected() );
    },

    editNextValue: function(fieldId) {
        var next;
        var headers = this.props.headers;

        // get the value to the left of the value with field id
        var current = _.findIndex(headers, function(header) {
            return header.fieldId === fieldId;
        });

        if (!headers[current+1]) { return; }
        next = "value-" + headers[current+1].fieldId;

        if (this.refs[next]) {
            this.refs[next].setEditing(true);
        }
    },

    onSaveValue: function(newContent, fieldId) {
        var bom = this.props.bom;
        var item = this.props.item;
        var field = FieldStore.get(fieldId)
        var attribute = bom.getAttributeForField(fieldId);
        var value = attribute ? item.getValueForAttribute(attribute.id || attribute.cid) : undefined;

        if (value) {
            value.save({
                content: newContent,
            });
        }
        else if (attribute && attribute.isNew()) {
            item.getValues().listenToOnce(attribute, "change:id", function(attribute) {
                this.create({
                    content: newContent,
                    bomFieldId: attribute.id
                });
            });
        }
        else if (attribute) {
            item.getValues().create({
                content: newContent,
                bomFieldId: attribute.id
            });
        }
        else if (bom) {
            attribute = bom.getAttributes().add({
                fieldId: field.id,
                name: field.get("name")
            });

            item.getValues().createForAttribute({
                content: newContent
            }, attribute).then(function() {
                this.forceUpdate();
            }.bind(this));
        }
    },

    getHeaderForField: function(fieldId) {
        return _.findWhere(this.props.headers, {
            fieldId: fieldId
        });
    }

});

module.exports = BomItem;
