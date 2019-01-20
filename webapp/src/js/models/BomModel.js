"use strict";

var _ = require("underscore");
var FieldConstants = require("constants/FieldConstants");
var TypeConstants = require("constants/TypeConstants");
var BaseModel = require("models/BaseModel");
var BomItemCollection = require("collections/BomItemCollection");
var BomAttributeCollection = require("collections/BomAttributeCollection");
var CommentCollection = require("collections/CommentCollection");
var FieldStore = require("stores/FieldStore");
var BomValidator = require("utils/BomValidator");
var ChangeCollection;

var statefulMixin = require("utils/StatefulMixin");

var BomModel = BaseModel.extend({
    mixins: [
        statefulMixin
    ],

    loaded: false,
    totalItems: undefined,
    changes: undefined,

    urlRoot: function() {
        return require("utils/BaseUrl").buildUrl("bom");
    },

    defaults: function() {
        return {
            bomIds: [],
            name: undefined
        };
    },

    constructor: function() {
        var comments = new CommentCollection();
        comments.setParent(this);
        this.setAssociation("comments", comments);

        this.setAssociation("items", new BomItemCollection());
        this.setAssociation("attributes", new BomAttributeCollection());

        BaseModel.apply(this, arguments);
    },

    initialize: function() {
        BaseModel.prototype.initialize.apply(this, arguments);

        this.listenTo(this.getItems(), "remove", this.validateItems);
        this.listenTo(this.getItems(), "add", function(item) {
            this.validateItems(item);
            this.listenTo(item.getValues(), "add change:content remove", function() {
                this.validateItems(item);
            });
        });
        this.listenTo(this, "change:name", function() { this.onChangeState(this.STATE_IDLE); });

        this.getAttributes().setBom( this );
        this.getItems().setBom( this );
        this.getItems().each(function(item) {
            this.listenTo(item.getValues(), "add change:content remove", function() {
                this.validateItems(item);
            });
        }, this);

        this.validateItems();
    },

    // Loading Associations

    setLoading: function(loading) {
        this._loading = loading;
    },

    setLoaded: function(loaded) {
        this.loaded = loaded;
        this.totalItems = undefined;
    },

    isLoaded: function() {
        return this.loaded;
    },

    getChanges: function() {
        ChangeCollection = require("collections/ChangeCollection");

        if (!this.changes) {
            this.changes = new ChangeCollection();
            this.changes.type = "bom";
            this.changes.entityId = this.id;
        }
        return this.changes;
    },

    parse: function(resp) {
        //TODO this should (deep) clone any array or object

        //if bom objects, then pluck their ids
        if (!resp.bomIds && resp.children) {
            resp.bomIds = _.pluck(resp.children, "id");
            delete resp.children;
        }

        if (!resp.attributes && resp.bomFields) {
            resp.attributes = resp.bomFields;
            delete resp.bomFields;
        }

        if (!resp.items && resp.bomItems) {
            resp.items = resp.bomItems;
            delete resp.bomItems;
        }

        return resp;
    },

    set: function(key, val, options) {
        var attr, attrs, method, wasNew;

        if (!key) { return this; }

        if (typeof key === "object") {
            attrs = key;
            options = val;
        } else {
            (attrs = {})[key] = val;
        }

        options = options || {};
        method = options.reset ? "reset" : "set";

        for (attr in attrs) {
            if (!attrs.hasOwnProperty(attr)) {
                continue;
            }
            val = attrs[attr];

            switch(attr) {
                case "items":
                    this.getItems()[method](val, options);
                    delete attrs[attr];
                    break;

                case "totalItems":
                    this.totalItems = val;
                    delete attrs[attr];
                    break;

                case "totalErrors":
                    this.totalErrors = val;
                    delete attrs[attr];
                    break;

                case "totalWarnings":
                    this.totalWarnings = val;
                    delete attrs[attr];
                    break;

                case "totalComments":
                    this.getComments().setTotalServerCount(val);
                    delete attrs[attr];
                    break;

                case "attributes":
                    this.getAttributes()[method](val, options);
                    delete attrs[attr];
                    break;
            }
        }

        wasNew = this.isNew();
        return BaseModel.prototype.set.apply(this, [attrs, options]);
    },

    fetch: function fetch() {
        this.setLoaded(true);
        return BaseModel.prototype.fetch.apply(this, arguments).then(undefined, function(error) {
            console.error(error);
            this.setLoaded(false);
        }.bind(this));
    },

    // Validation

    validateItems: function(items) {
        items = items || this.getItems().models;
        items = _.isArray(items) ? items : [items];

        _.each(items, function(item) {
            BomValidator.validateQuantityDesignators(item, this.getAttributes().findWhere({
                fieldId: FieldConstants.QUANTITY
            }), this.getAttributes().findWhere({
                fieldId: FieldConstants.DESIGNATORS
            }));

            BomValidator.validateNumericValues(item, this.getAttributes().filter(function(attribute) {
                var field = FieldStore.get( attribute.get("fieldId"));
                return field && field.get("typeId") === TypeConstants.NUMBER;
            }));

            BomValidator.validateVoltUnit(item, this.getAttributes().findWhere({
                fieldId: FieldConstants.VOLT
            }));

            BomValidator.validateUnitsForType(item, this.getAttributes().findWhere({
                fieldId: FieldConstants.TYPE
            }), this.getAttributes().findWhere({
                fieldId: FieldConstants.VALUE
            }));

            BomValidator.validatePrices(item, this.getAttributes().filter(function(attribute) {
                var field = FieldStore.get( attribute.get("fieldId"));
                return field && (field.id === FieldConstants.PRICE || field.id === FieldConstants.TOTAL_PRICE);
            }));
        }, this);

        BomValidator.validateUniqueAttributeBuildOption(this.getItems().models, this.getAttributes().findWhere({
            fieldId: FieldConstants.MPN
        }), this.getAttributes().findWhere({
            fieldId: FieldConstants.BUILD_OPTION
        }));

        BomValidator.validateUniqueAttributeBuildOption(this.getItems().models, this.getAttributes().findWhere({
            fieldId: FieldConstants.SKU
        }), this.getAttributes().findWhere({
            fieldId: FieldConstants.BUILD_OPTION
        }));

        BomValidator.validateUniqueAttributeBuildOption(this.getItems().models, this.getAttributes().findWhere({
            fieldId: FieldConstants.SPN
        }), this.getAttributes().findWhere({
            fieldId: FieldConstants.BUILD_OPTION
        }));

        BomValidator.validateUniqueDesignators(this.getItems().models, this.getAttributes().findWhere({
            fieldId: FieldConstants.DESIGNATORS
        }));

        BomValidator.validateMpnSpnMatch(this.getItems().models, this.getAttributes().findWhere({
            fieldId: FieldConstants.MPN
        }), this.getAttributes().findWhere({
            fieldId: FieldConstants.SPN
        }));
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

        if (!attributes) {
            return;
        }
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
        var attribute;
        var oldVisible;
        var oldPosition;

        if (!attributes) {
            return;
        }
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
        visibleAttributes = visibleAttributes.map(function(result) {
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

        this.trigger("change");
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
        });

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

    setColumn: function(attribute) {
        var oldAttribute = this.getAttribute(attribute.id);
        if (!oldAttribute) { return; }

        oldAttribute.set({
            name: attribute.name
        });

        return oldAttribute;
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

    // BoM Items

    getItem: function(id) {
        return this.getItems().get(id);
    },

    getItems: function() {
        return this.getAssociation("items");
    },

    getItemCount: function() {
        return this.totalItems !== undefined ? this.totalItems : this.getItems().length;
    },

    addItem: function(attributes, options) {
        var item;

        attributes = attributes || {};

        if (attributes.position === undefined) {
            attributes.position = this.getItems().length;
        }

        item = this.getItems().add(attributes, options);
        if (!item) { return; }

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
        if (!item) { return; }

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

    getItemValueForField: function(itemId, fieldId) {
        var item;
        var attribute;

        item = this.getItem(itemId);
        if (!item) {
            return;
        }

        attribute = this.getAttributes().findWhere({
            fieldId: fieldId
        });
        if (!attribute) {
            return;
        }

        return item.getValueForAttribute(attribute.id || attribute.cid);
    },

    getItemValueContentForField: function(itemId, fieldId) {
        var value = this.getItemValueForField(itemId, fieldId);
        if (!value) {
            return;
        }

        return value.get("content");
    },

    // Comments

    getComments: function() {
        return this.getAssociation("comments");
    }
});

module.exports = BomModel;
