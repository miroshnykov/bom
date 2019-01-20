var ApiConstants = require("../constants/ApiConstants");
var TypeConstants = require("../constants/TypeConstants");
var ExtendedModel = require("../utils/ExtendedModel");
var BomItemCollection = require("../collections/BomItemCollection");
var BomAttributeCollection = require("../collections/BomAttributeCollection");

var BomModel = ExtendedModel.extend({
    companyId: undefined,

    urlRoot: function() {
        return ApiConstants.PATH_PREFIX + "/" + this.getCompany() + "/bom";
    },

    defaults: function() {
        return {
            bomIds: []
        };
    },

    constructor: function() {
        this.setAssociation("items", new BomItemCollection());
        this.setAssociation("attributes", new BomAttributeCollection());
        ExtendedModel.apply(this, arguments);
    },

    initialize: function() {
        this.listenTo(this.getItems(), "all", function(event) { this.trigger(event + ":items") });
        this.listenTo(this.getAttributes(), "all", function(event) { this.trigger(event + ":attributes") });
    },

    setCompany: function(companyId) {
        this.companyId = companyId;
        this.getItems().setCompany(companyId);
        this.getAttributes().setCompany(companyId);
    },

    getCompany: function() {
        return this.companyId;
    },

    parse: function(resp, options) {
        //if bom objects, then pluck their ids
        if (!resp.bomIds && resp.children) {
            resp.bomIds = _.pluck(resp.children, "id");
            delete resp.children;
        }

        //BomModel.attributes could be a Collection, not an attribute
        if (!resp.attributes && resp.bomFields) {
            resp.attributes = resp.bomFields;
            delete resp.bomFields;
        }

        // Parse each attributes
        // _.each(resp.attributes, function(attribute) {
        //     if (attribute.field) {
        //         // Fold fieldId if passed as Field object
        //         if (!attribute.fieldId) {
        //             attribute.fieldId = attribute.field.id;
        //         }

        //         delete attribute.field;
        //     }
        // });

        //BomModel.items could be a Collection, not an attribute
        if (!resp.items && resp.bomItems) {
            resp.items = resp.bomItems;
            delete resp.bomItems;
        }

        //parse each item embedded entities (i.e. bomItemFields)
        // _.each(resp.items, function(item) {

        //     if (item.bomItemFields) {
        //         if (!item.values) {
        //             item.values = item.bomItemFields;
        //         }

        //         delete item.bomItemFields;
        //     }

        //     _.each(item.values, function(value) {
        //         if (value.bomField) {
        //             if (!value.bomFieldId) {
        //                 value.bomFieldId = value.bomField.id;
        //             }

        //             delete value.bomField;
        //         }

        //         //convert the content to the correct type
        //         switch(value.fieldId) {
        //             case TypeConstants.TEXT:
        //                 //nothing to do, already a string
        //                 break;
        //             case TypeConstants.NUMBER:
        //                 if (_.isNaN(value.content = parseFloat(value.content))) {
        //                     delete value.content;
        //                 }
        //                 break;
        //             case TypeConstants.BOOLEAN:
        //                 value.content = value.content === "1";
        //                 break;
        //         }
        //     });

        //     delete item.bomItemFields;
        // });

        //remove attributes starting with underscore (e.g. links)
        resp = _.omit(resp, function(value, key, object) {
            return _.isString(key) && key.slice(0,1) === "_";
        });

        return resp;
    },

    set: function(key, val, options) {
        var attr, attrs, method, model, wasNew, associations;

        if (key == null) return this;

        if (typeof key === 'object') {
            attrs = key;
            options = val;
        } else {
            (attrs = {})[key] = val;
        }

        options || (options = {});
        method = options.reset ? 'reset' : 'set';

        associations = {};

        for (attr in attrs) {
            val = attrs[attr];

            switch(attr) {
                case "items":
                    this.getItems()[method](val, options);
                    delete attrs[attr];
                    break;

                case "attributes":
                    this.getAttributes()[method](val, options);
                    delete attrs[attr];
                    break;
            }
        }

        wasNew = this.isNew();
        model = ExtendedModel.prototype.set.apply(this, [attrs, options]);

        // If the model is newly created, set the association's bom id
        if (model && wasNew !== model.isNew()) {
            model.getItems().setBom( model.id );
            model.getAttributes().setBom( model.id );
        }

        return model;
    },

    // Attributes

    getAttribute: function(attributeId) {
        // if (!attributeId) {
        //     return;
        // }

        // return _.find(this.get("attributes"), function(result) {
        //     return attributeId === result.id || attributeId === result.cid;
        // });
        return this.getAttributes().get(attributeId);
    },

    getAttributes: function() {
        // return _.sortBy(this.get("attributes"), function(result) {
        //     return result.position;
        // });
        return this.getAssociation("attributes");
    },

    getVisibleAttributes: function() {
        return this.getAttributes().where({
            visible: true
        });
    },

    hasVisibleAttributes: function() {
        return !!this.getAttributes().findWhere({
            visible: true
        });
    },

    getAttributeForField: function(fieldId) {
        return this.getAttributes().findWhere({
            fieldId: fieldId
        });
    },

    addAttribute: function(attribute, options) {
        var numVisible;

        if (!attribute) return;
        attribute = _.clone(attribute);

        //make sure the position attribute is within range
        if (attribute.visible) {
            numVisible = this.getVisibleAttributes().length;

            //if position is not set or too big, set to be last
            if (attribute.position === undefined ||
                attribute.position === -1 ||
                attribute.position > numVisible) {
                attribute.position = numVisible;
            }
        } else if (attribute.position > 0) {
            attribute.position = -1;
        }

        // If the new attribute is visible, adjust position of others above it
        if (attribute.visible) {
            this.getAttributes().each(function(result) {
                if (result.get("position") >= attribute.position) {
                    result.increase();
                }
            });
        }

        return this.getAttributes().add(attribute, options);
    },

    setAttribute: function(attribute, options) {
        // TODO override BomAttributeCollection to keep positions in line
        var numVisible;
        var model;

        var oldAttribute;
        var oldVisible;
        var oldPosition;

        if (!attribute) return;
        attribute = _.clone(attribute);

        //make sure the position attribute is within range
        if (attribute.visible) {
            numVisible = this.getVisibleAttributes().length;

            //if position is not set or too big, set to be last
            if (attribute.position === undefined ||
                attribute.position === -1 ||
                attribute.position > numVisible) {
                attribute.position = numVisible;
            }
        } else if (attribute.position > 0) {
            attribute.position = -1;
        }

        oldAttribute = this.getAttribute(attribute.id || attribute.cid);
        oldVisible = oldAttribute.get("visible");
        oldPosition = oldAttribute.get("position");

        // If the attribute became visible, increase the position of attributes above it
        if (attribute.visible && !oldVisible) {

            this.getAttributes().each(function(result) {
                if (result.get("position") >= attribute.position) {
                    result.increase();
                }
            });
        }
        // If the attribute was already visible, but it's position changed
        else if (attribute.visible && attribute.position !== oldPosition) {

            if (attribute.position > oldPosition) {
                this.getAttributes().each(function(result) {
                    if (result.get("position") > oldPosition &&
                        result.get("position") <= attribute.position) {
                        result.decrease();
                    }
                });
            }
            else {
                this.getAttributes().each(function(result) {
                    if (result.get("position") >= attribute.position &&
                        result.get("position") < oldPosition) {
                        result.increase();
                    }
                });
            }

        }
        // If attribute became not visible
        else if (!attribute.visible && attribute.visible) {
            this.getAttributes().each(function(result) {
                if (result.get("position") >= oldPosition) {
                    result.decrease();
                }
            });
        }

        return oldAttribute.set(attribute, options);
    },

    setVisibleAttributes: function(visibleAttributes) {
        // Parse visibleAttributes in case we have new or changed attributes
        // TODO maybe do this in a separate method instead of just calling this one
        var visibleAttributes = visibleAttributes.map(function(result) {
            var oldAttribute;
            var newAttribute;

            if (_.isObject(result)) {
                oldAttribute = this.getAttribute(result.id || result.cid);

                if (oldAttribute) {

                    //if field ids don't match, look for an existing match
                    //TODO need to prevent this from happening
                    if (oldAttribute.get("fieldId") !== result.fieldId) {
                        newAttribute = this.getAttributeForField(result.fieldId);
                        if (!newAttribute) {
                            newAttribute = this.addAttribute({
                                fieldId: result.fieldId,
                                name: result.name
                            });
                        }
                    }
                    //if the field ids match, then update the column
                    else {
                        newAttribute = this.setAttribute(result);
                    }

                    return newAttribute.id || newAttribute.cid;

                } else if (result.fieldId) {

                    newAttribute = this.getAttributeForField(result.fieldId);
                    if (!newAttribute) {
                        newAttribute = this.addAttribute({
                            fieldId: result.fieldId,
                            name: result.name
                        });
                    }

                    return newAttribute.id || newAttribute.cid;

                } else {
                    return;
                }
            } else {
                return result;
            }
        }, this);

        this.getAttributes().each(function(result) {
            var position = _.indexOf(visibleAttributes, result.id || result.cid);
            result.set({
                position: position,
                visible: position !== -1
            });
        });
    },

    // fixFieldId: function(cid, id) {
    //     var attributes = this.get("attributes").map(_.clone);

    //     _.each(attributes, function(result) {
    //         if (result.fieldId === cid) {
    //             result.fieldId = id;
    //         }
    //     });

    //     this.set({
    //         "attributes": attributes
    //     });
    // },

    // showColumn: function(columnId) {
    //   var column = _.clone(this.getAttribute(columnId));
    //   column.visible = true;
    //   this.setAttribute(column);
    // },

    hideAttribute: function(attributeId) {
        //return this.getAttributes().hide(attributeId);

        var attribute = this.getAttribute(attributeId);
        var position;

        if (!attribute) { return ; }
        if (!attribute.get("visible")) { return; }

        position = attribute.get("position");

        // Hide the attribute
        attribute.set({
            visible: false,
            position: -1
        })

        // Adjust the position of the other attributes
        this.getAttributes().each(function(attribute) {
            if (attribute.get("position") >= position) {
                attribute.decrease();
            }
        });

        return attribute;

        //TODO this needs to update the position attribute
        // var attribute = this.getAttribute(attributeId);
        // var position;

        // if (!attribute) { return ; }
        // if (!attribute.get("visible")) { return; }

        // position = attribute.get("position");

        // // Hide the attribute
        // attribute.set({
        //     visible: false,
        //     position: -1
        // })

        // // Adjust the position of the other attributes
        // this.getAttributes().each(function(attribute) {
        //     if (attribute.get("position") >= position) {
        //         attribute.decrease();
        //     }
        // });

        // var column = this.getColumn(columnId);

        // if (!column || !column.visible) {
        //     return;
        // }

        // column = _.extend({}, column, {
        //     visible: false
        // });

        // return this.setAttribute(column);
    },

    removeColumn: function(attributeId) {
        // var attributes = this.get("attributes").map(_.clone);

        // var attribute = this.getColumn(columnId);
        // if (!attribute) { return; }

        // Remove all item values for this attribute
        this.getItems().removeValuesForAttribute(attributeId);

        // Remove the attribute
        this.getAttributes().remove(attributeId);
        // attributes = _.filter(attributes, function(result) {
        //     return result.id !== columnId && result.cid !== columnId;
        // });

        // this.set({
        //     "attributes": attributes
        // });
    },

    // Children BoMs

    getBoms: function() {
      return this.get("bomIds");
    },

    setBoms: function(bomIds) {
        this.set({
            "bomIds": bomIds
        });
    },

    attachBom: function(id) {
        var bomIds;

        if (!id) { return; }

        bomIds = _.clone(this.getBoms());
        bomIds.push(id);
        this.setBoms(bomIds);
    },

    detachBom: function(id) {
        var bomIds = this.getBoms();

        bomIds = bomIds.filter(function(result) {
            return result != id;
        });

        this.setBoms(bomIds);
    },

    fixChildBomId: function(cid, id) {
        if (!id) {
            return;
        }

        var childIds = this.getBoms().map(function(result) {
            return result === cid ? id : result;
        });

        this.set({
            "bomIds": childIds
        });
    },

    // BoM Items

    getItem: function(id) {
        //TODO include the Component model if component_id is defined?
        // return _.find(this.get("items"), function(result) {
        //     return id === result.id || id === result.cid;
        // });
        return this.getItems().get(id);
    },

    getItems: function() {
        //TODO include the Component model if component_id is defined
        //return _.sortBy(this.get("items"), "position");
        return this.getAssociation("items");
    },

    addItem: function(attributes, options) {
        attributes = attributes || {};

        if (attributes.position === undefined) {
            attributes.position = this.getItems().length;
        }

        return this.getItems().add(attributes, options);

        // TODO adjust position of other items
        // TODO override BomItemCollection to keep positions in line
    },

    setItem: function(attributes, options) {
        attributes = attributes || {};
        // var items = this.getItems().map(_.clone);
        // var oldItem;

        // if (!item) return;

        // options = options ? options : {};
        // options.merge = options.merge === undefined ? true : options.merge;

        // if (!(item.id || item.cid)) {
        //     item.cid = _.uniqueId('c');
        // }

        // oldItem = this.getItem(item.id || item.cid);
        // if (oldItem) {
        //     items = items.map(function(result) {
        //         if ((item.id && result.id === item.id) || (item.cid && result.cid === item.cid)) {
        //             if (!options.merge) {
        //                 return item;
        //             } else {
        //                 return _.extend({}, result, item);
        //             }
        //         } else {
        //             return _.clone(result);
        //         }
        //     });
        // } else {
        //     items.push(_.clone(item));
        // }

        // this.set({
        //     "items": items
        // });

        // TODO adjust position of other items
        // TODO override BomItemCollection to keep positions in line

        var item = this.getItem(attributes.id || attributes.cid);
        if (!item) { return; }

        return item.set(attributes, options);
    },

    removeItem: function(id) {
        // var removed = this.removeItems([id]);
        // if (removed) {
        //     return removed[0];
        // }
        return this.getItems().remove(id);

        // TODO adjust position of other items
        // TODO override BomItemCollection to keep positions in line
    },

    removeItems: function(ids) {
        // var items = this.getItems();
        // var removed;

        // //get the items to remove
        // removed = _.filter(items, function(result) {
        //     return _.indexOf(ids, result.id || result.cid) !== -1;
        // });

        // if (removed.length) {
        //     //remove items
        //     items = _.filter(items, function(result) {
        //         return _.indexOf(ids, result.id || result.cid) === -1;
        //     });

        //     //adjust position of items after each removed item
        //     _.each(removed.reverse(), function(removedItem) {
        //         _.each(items, function(item) {
        //             if (item.position > removedItem.position) {
        //                 item.position -= 1;
        //             }
        //         });
        //     });

        //     this.set({
        //         "items": items
        //     });
        // }

        // return removed;
        return this.getItems().remove(ids);

        // TODO adjust position of other items
        // TODO override BomItemCollection to keep positions in line
    },

    // removeAllItems: function() {
    //     this.set({
    //         "items": []
    //     });
    // },

    // removeItemValuesForAttribute: function(attributeId) {
    //     var items = this.getItems();

    //     _.each( items, function( item ) {
    //         item.values = _.filter(item.values, function(value) {
    //             return value.bomFieldId !== attributeId;
    //         });
    //     });

    //     this.set({
    //         "items": items
    //     });
    // },

    // BoM Item Fields

    // getItemFieldIds: function() {
    //     var items = this.get("items");
    //     var item;
    //     var field;
    //     var fields = [];

    //     for (var cindex in items) {
    //         item = items[cindex];
    //         for (var findex in item.values) {
    //             field = item.values[findex];
    //             if (!_.contains(fields, field.id || field.cid)) {
    //                 fields.push(field.id);
    //             }
    //         }
    //     }

    //     return fields;
    // },

    // getItemField: function(itemId, bomFieldId) {
    //     var item = this.getItem(itemId);
    //     return _.find(item.values, function(result) {
    //         return bomFieldId === result.id || bomFieldId === result.cid;
    //     });
    // },

    // getItemValueForField: function(itemId, fieldId) {
    //     //TODO what if there are more than one
    //     var item;
    //     var attribute;
    //     var value;

    //     item = this.getItem(itemId);
    //     if (!item) return;

    //     attribute = _.find(this.get("attributes"), function(result) {
    //         return result.fieldId === fieldId;
    //     });
    //     if (!attribute) return;

    //     return item.getValueForAttribute(attribute.id || attribue.cid);
    //     // return item.getValues().findForAttribute(attribute)
    // },

    getItemValueContentForField: function(itemId, fieldId) {
        var item;
        var attribute;
        var value;

        item = this.getItem(itemId);
        if (!item) return;

        attribute = this.getAttributes().findWhere({
            fieldId: fieldId
        });
        // attribute = _.find(this.get("attributes"), function(result) {
        //     return result.fieldId === fieldId;
        // });
        if (!attribute) return;

        // return item.getValues().findForAttribute(attribute)
        value = item.getValueForAttribute(attribute.id || attribue.cid);
        if (!value) return;

        //return value.get("content");
        return value.content;
    }

});

module.exports = BomModel;
