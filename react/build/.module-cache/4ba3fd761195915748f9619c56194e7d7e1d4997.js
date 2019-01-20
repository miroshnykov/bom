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
        this.listenTo(this.getItems(), "add", function(model, collection, options) { this.trigger("add:items", model, collection, options); });
        this.listenTo(this.getItems(), "change", function(collection, options) { this.trigger("change:items", collection, options); });
        this.listenTo(this.getItems(), "remove", function(model, collection, options) { this.trigger("remove:items", model, collection, options); });
        this.listenTo(this.getItems(), "reset", function(collection, options) { this.trigger("reset:items", collection, options); });
        this.listenTo(this.getItems(), "sync", function(collection, resp, options) { this.trigger("sync:items", collection, resp, options); });

        this.listenTo(this.getAttributes(), "add", function(model, collection, options) { this.trigger("add:attributes", model, collection, options); });
        this.listenTo(this.getAttributes(), "change", function(collection, options) { this.trigger("change:attributes", collection, options); });
        this.listenTo(this.getAttributes(), "remove", function(model, collection, options) { this.trigger("remove:attributes", model, collection, options); });
        this.listenTo(this.getAttributes(), "reset", function(collection, options) { this.trigger("reset:attributes", collection, options); });
        this.listenTo(this.getAttributes(), "sync", function(collection, resp, options) { this.trigger("sync:attributes", collection, resp, options); });
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
        //TODO this should (deep) clone any array or object

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

        //BomModel.items could be a Collection, not an attribute
        if (!resp.items && resp.bomItems) {
            resp.items = resp.bomItems;
            delete resp.bomItems;
        }

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
                    this.getItems()[method](val, _.extend({}, options, { silent: true }));
                    delete attrs[attr];
                    break;

                case "attributes":
                    this.getAttributes()[method](val, _.extend({}, options, { silent: true }));
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
        return this.getAttributes().get(attributeId);
    },

    getAttributes: function() {
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

    addAttribute: function(attributes, options) {
        var numVisible;

        if (!attributes) return;
        attributes = _.clone(attributes);

        //make sure the position attribute is within range
        if (attributes.visible) {
            numVisible = this.getVisibleAttributes().length;

            //if position is not set or too big, set to be last
            if (attributes.position === undefined ||
                attributes.position === -1 ||
                attributes.position > numVisible) {
                attributes.position = numVisible;
            }
        } else if (attributes.position > 0) {
            attributes.position = -1;
        }

        // If the new attribute is visible, adjust position of others above it
        if (attributes.visible) {
            this.getAttributes().each(function(result) {
                if (result.get("position") >= attributes.position) {
                    result.increase();
                }
            });
        }

        return this.getAttributes().add(attributes, options);
    },

    setAttribute: function(attributes, options) {
        // TODO override BomAttributeCollection to keep positions in line
        var numVisible;
        var model;
        var attribute;
        var oldVisible;
        var oldPosition;

        if (!attributes) return;
        attributes = _.clone(attributes);

        //make sure the position attribute is within range
        if (attributes.visible) {
            numVisible = this.getVisibleAttributes().length;

            //if position is not set or too big, set to be last
            if (attributes.position === undefined ||
                attributes.position === -1 ||
                attributes.position > numVisible) {
                attributes.position = numVisible;
            }
        } else if (attributes.position > 0) {
            attributes.position = -1;
        }

        attribute = this.getAttribute(attributes.id || attributes.cid);
        oldVisible = attribute.get("visible");
        oldPosition = attribute.get("position");

        attribute.set(attributes, options);

        // If the attribute became visible, increase the position of attributes above it
        if (attributes.visible && !oldVisible) {

            this.getAttributes().each(function(result) {
                if (!result.is(attribute) &&
                    result.get("position") >= attributes.position) {
                    result.increase();
                }
            });
        }
        // If the attribute was already visible, but it's position changed
        else if (attributes.visible && attributes.position !== oldPosition) {

            if (attributes.position > oldPosition) {
                this.getAttributes().each(function(result) {
                    if (!result.is(attribute) &&
                        result.get("position") > oldPosition &&
                        result.get("position") <= attributes.position) {
                        result.decrease();
                    }
                });
            }
            else {
                this.getAttributes().each(function(result) {
                    if (!result.is(attribute) &&
                        result.get("position") >= attributes.position &&
                        result.get("position") < oldPosition) {
                        result.increase();
                    }
                });
            }

        }
        // If attribute became not visible
        else if (!attributes.visible && attributes.visible) {
            this.getAttributes().each(function(result) {
                if (!result.is(attribute) &&
                    result.get("position") >= oldPosition) {
                    result.decrease();
                }
            });
        }

        return attribute;
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
        this.getAttributes().each(function(result) {
            if (result.get("position") >= position) {
                result.decrease();
            }
        });

        return attribute;
    },

    removeColumn: function(attributeId) {
        var attribute = this.getAttribute(attributeId);
        if (!attribute) { return ; }

        // Remove all item values for this attribute
        this.getItems().removeValuesForAttribute(attributeId);

        // Remove the attribute
        this.getAttributes().remove(attributeId);

        // Adjust the position of the other attributes
        this.getAttributes().each(function(result) {
            if (result.get("position") >= attribute.get("position")) {
                result.decrease();
            }
        });

        return attribute;
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

    fixChildBomId: function(bom) {
        if (bom.isNew()) { return; }

        var childIds = this.getBoms().map(function(result) {
            return result === bom.cid ? bom.id : result;
        });

        this.set({
            "bomIds": childIds
        });
    },

    // BoM Items

    getItem: function(id) {
        return this.getItems().get(id);
    },

    getItems: function() {
        return this.getAssociation("items");
    },

    addItem: function(attributes, options) {
        var item;

        attributes = attributes || {};

        if (attributes.position === undefined) {
            attributes.position = this.getItems().length;
        }

        item = this.getItems().add(attributes, options);
        if (!item) { return; }

        // If the new attribute is visible, adjust position of others above it
        this.getItems().each(function(result) {
            if (!result.is(item) && result.get("position") >= attributes.position) {
                result.increase();
            }
        });

        return item;
    },

    setItem: function(attributes, options) {
        var item;
        var oldPosition;

        attributes = attributes || {};

        item = this.getItem(attributes.id || attributes.cid);
        if (!item) { return }

        oldPosition = item.get("position");

        item = item.set(attributes, options);
        if (!item) { return; }

        // If the attribute was already visible, but it's position changed
        if (attributes.position !== oldPosition) {

            if (attributes.position > oldPosition) {
                this.getAttributes().each(function(result) {
                    if (!result.is(item) &&
                        result.get("position") > oldPosition &&
                        result.get("position") <= attributes.position) {
                        result.decrease();
                    }
                });
            }
            else {
                this.getAttributes().each(function(result) {
                    if (!result.is(item) &&
                        result.get("position") >= attributes.position &&
                        result.get("position") < oldPosition) {
                        result.increase();
                    }
                });
            }

        }

        return item;
    },

    removeItem: function(itemId) {
        var item = this.getItem(itemId);
        if (!item) { return ; }

        item = this.getItems().remove(itemId);

        // Adjust the position of the other attributes
        this.getItems().each(function(result) {
            if (result.get("position") >= item.get("position")) {
                result.decrease();
            }
        });

        return item;
    },

    removeItems: function(ids) {
        return ids.map(function(id) {
            return this.removeItem(id);
        }, this);
    },

    // BoM Item Values

    getItemValueContentForField: function(itemId, fieldId) {
        var item;
        var attribute;
        var value;

        item = this.getItem(itemId);
        if (!item) return;

        attribute = this.getAttributes().findWhere({
            fieldId: fieldId
        });

        if (!attribute) return;

        // return item.getValues().findForAttribute(attribute)
        value = item.getValueForAttribute(attribute.id || attribute.cid);
        if (!value) return;

        return value.get("content");
    }

});

module.exports = BomModel;
