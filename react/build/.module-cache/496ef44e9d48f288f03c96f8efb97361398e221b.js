var ApiConstants = require("../constants/ApiConstants");
var TypeConstants = require("../constants/TypeConstants");
var ExtendedModel = require("../utils/ExtendedModel");

var BomModel = ExtendedModel.extend({
    urlRoot: function() {
        return ApiConstants.PATH_PREFIX + "/" + this.get("companyId") + "/bom";
    },

    defaults: function() {
        return {
            bomIds: [],
            attributes: [],
            items: []
        };
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
        _.each(resp.attributes, function(attribute) {
            if (attribute.field) {
                // Fold fieldId if passed as Field object
                if (!attribute.fieldId) {
                    attribute.fieldId = attribute.field.id;
                }

                delete attribute.field;
            }
        });

        //BomModel.items could be a Collection, not an attribute
        if (!resp.items && resp.bomItems) {
            resp.items = resp.bomItems;
            delete resp.bomItems;
        }

        //parse each item embedded entities (i.e. bomItemFields)
        _.each(resp.items, function(item) {

            if (item.bomItemFields) {
                if (!item.values) {
                    item.values = item.bomItemFields;
                }

                delete item.bomItemFields;
            }

            _.each(item.values, function(value) {
                if (value.bomField) {
                    if (!value.bomFieldId) {
                        value.bomFieldId = value.bomField.id;
                    }

                    delete value.bomField;
                }

                //convert the content to the correct type
                switch(value.fieldId) {
                    case TypeConstants.TEXT:
                        //nothing to do, already a string
                        break;
                    case TypeConstants.NUMBER:
                        if (_.isNaN(value.content = parseFloat(value.content))) {
                            delete value.content;
                        }
                        break;
                    case TypeConstants.BOOLEAN:
                        value.content = value.content === "1";
                        break;
                }
            });

            delete item.bomItemFields;
        });

        //remove attributes starting with underscore (e.g. links)
        resp = _.omit(resp, function(value, key, object) {
            return _.isString(key) && key.slice(0,1) === "_";
        });

        return resp;
    },

    // Attributes

    getColumn: function(columnId) {
        if (!columnId) {
            return;
        }

        return _.find(this.get("attributes"), function(result) {
            //console.log(result);
            //console.log(columnId);
            return columnId === result.id || columnId === result.cid;
        });
    },

    getColumns: function() {
        return _.sortBy(this.get("attributes"), function(result) {
            return result.position;
        });
    },

    getVisibleColumns: function() {
        return _.where(this.getColumns(), {
            visible: true
        });
    },

    hasVisibleColumns: function() {
        return !!_.findWhere(this.getColumns(), {
            visible: true
        });
    },

    getColumnForField: function(fieldId) {
        return _.find(this.get("attributes"), function(result) {
            return result.fieldId === fieldId;
        });
    },

    setColumn: function(newColumn, options) {
        var columns;
        var oldColumn;
        var numVisibleColumns;

        //TODO handle visible and position attribute

        options = options ? options : {};

        if (!newColumn) return;
        newColumn = _.clone(newColumn);

        //make sure the position attribute is within range
        if (newColumn.visible) {
            numVisibleColumns = this.getVisibleColumns().length;

            //if position is not set or too big, set to be last
            if (newColumn.position === undefined ||
                newColumn.position === -1 ||
                newColumn.position > numVisibleColumns) {
                newColumn.position = numVisibleColumns;
            }
        } else if (newColumn.position > 0) {
            newColumn.position = -1;
        }

        //get the current columns
        columns = this.get("attributes").map(_.clone);

        //check if column is new
        if (!newColumn.id && !newColumn.cid) {
            newColumn.cid = _.uniqueId("c");
        }

        //get the column we are trying to update
        oldColumn = this.getColumn(newColumn.id || newColumn.cid);

        //if no old column, then we insert a new column
        if (!oldColumn) {
            //TODO might want to check if a column with the same field id already existss

            columns.push(newColumn);
        }
        //we found a column, so update its attributes
        else {
            columns = columns.map(function(result) {
                if ((result.id && (result.id === newColumn.id)) ||
                    (result.cid && (result.cid === newColumn.cid))) {
                    if (options.merge === false) {
                        return _.clone(newColumn);
                    } else {
                        return _.extend({}, result, newColumn);
                    }
                } else {
                    return _.clone(result);
                }
            });

            //reorder visible columns if needed
            if (oldColumn.visible !== newColumn.visible) {
                //check if we showed the column
                if (newColumn.visile) {
                    columns = columns.map(function(result) {
                        if (result.position >= newColumn.position) {
                            result.position += 1;
                        }
                        return result;
                    });
                }
                //or if we hid the column
                //moved each column after the change one backward by one
                else {
                    columns = columns.map(function(result) {
                        if (result.position > oldColumn.position) {
                            result.position -= 1;
                        }
                        return result;
                    });
                }
            }
        }

        this.set({
            "attributes": columns
        });

        return this.getColumn(newColumn.id || newColumn.cid);
    },

    setVisibleColumns: function(visibleColumns) {
        var columns;

        visibleColumns = visibleColumns.map(function(result) {
            var oldColumn;
            var newColumn;

            if (_.isObject(result)) {
                oldColumn = this.getColumn(result.id || result.cid);

                if (oldColumn) {
                    //if field ids don't match, look for an existing match
                    //TODO need to prevent this from happening
                    if (oldColumn.fieldId !== result.fieldId) {
                        newColumn = this.getColumnForField(result.fieldId);
                        if (!newColumn) {
                            newColumn = this.setColumn({
                                fieldId: result.fieldId,
                                name: result.name
                            });
                        }
                    }
                    //if the field ids match, then update the column
                    else {
                        newColumn = this.setColumn(result);
                    }

                    return newColumn.id || newColumn.cid;
                } else if (result.fieldId) {
                    newColumn = this.getColumnForField(result.fieldId);
                    if (!newColumn) {
                        newColumn = this.setColumn({
                            fieldId: result.fieldId,
                            name: result.name
                        });
                    }

                    return newColumn.id || newColumn.cid;
                } else {
                    return;
                }
            } else {
                return result;
            }
        }, this);

        columns = this.get("attributes").map(_.clone);
        _.each(columns, function(result) {
            result.position = _.indexOf(visibleColumns, result.id || result.cid);
            result.visible = result.position !== -1;
        });

        this.set({
            "attributes": columns
        });
    },

    fixFieldId: function(cid, id) {
        var attributes = this.get("attributes").map(_.clone);

        _.each(attributes, function(result) {
            if (result.fieldId === cid) {
                result.fieldId = id;
            }
        });

        this.set({
            "attributes": attributes
        });
    },

    // showColumn: function(columnId) {
    //   var column = _.clone(this.getColumn(columnId));
    //   column.visible = true;
    //   this.setColumn(column);
    // },

    hideColumn: function(columnId) {
        //TODO this needs to update the position attribute
        var column = this.getColumn(columnId);

        if (!column || !column.visible) {
            return;
        }

        column = _.extend({}, column, {
            visible: false
        });

        return this.setColumn(column);
    },

    removeColumn: function(columnId) {
        var attributes = this.get("attributes").map(_.clone);

        var attribute = this.getColumn(columnId);
        if (!attribute) { return; }

        // Remove all item values for this attribute
        this.removeItemValuesForAttribute(attribute.id || attribute.cid);

        // Remove the attribute
        attributes = _.filter(attributes, function(result) {
            return result.id !== columnId && result.cid !== columnId;
        });

        this.set({
            "attributes": attributes
        });
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
        return _.find(this.get("items"), function(result) {
            return id === result.id || id === result.cid;
        });
    },

    getItems: function() {
        //TODO include the Component model if component_id is defined
        return _.sortBy(this.get("items"), "position");
    },

    addItem: function(item) {
        if (!item) {
            item = {
                cid: _.uniqueId('c'),
                componentId: undefined,
                values: []
            };
        }

        if (item.position === undefined) {
            item.position = this.getItems().length;
        }

        this.setItem(item, {
            merge: false
        });
    },

    // addItemAt: function(index, item) {
    //   //TODO
    // },

    setItem: function(item, options) {
        var items = this.getItems().map(_.clone);
        var oldItem;

        if (!item) return;

        options = options ? options : {};
        options.merge = options.merge === undefined ? true : options.merge;

        if (!(item.id || item.cid)) {
            item.cid = _.uniqueId('c');
        }

        oldItem = this.getItem(item.id || item.cid);
        if (oldItem) {
            items = items.map(function(result) {
                if ((item.id && result.id === item.id) || (item.cid && result.cid === item.cid)) {
                    if (!options.merge) {
                        return item;
                    } else {
                        return _.extend({}, result, item);
                    }
                } else {
                    return _.clone(result);
                }
            });
        } else {
            items.push(_.clone(item));
        }

        this.set({
            "items": items
        });
    },

    setItems: function(items) {
        this.set({
            "items": items
        });
    },

    removeItem: function(id) {
        var removed = this.removeItems([id]);
        if (removed) {
            return removed[0];
        }
    },

    removeItems: function(ids) {
        var items = this.getItems();
        var removed;

        //get the items to remove
        removed = _.filter(items, function(result) {
            return _.indexOf(ids, result.id || result.cid) !== -1;
        });

        if (removed.length) {
            //remove items
            items = _.filter(items, function(result) {
                return _.indexOf(ids, result.id || result.cid) === -1;
            });

            //adjust position of items after each removed item
            _.each(removed.reverse(), function(removedItem) {
                _.each(items, function(item) {
                    if (item.position > removedItem.position) {
                        item.position -= 1;
                    }
                });
            });

            this.set({
                "items": items
            });
        }

        return removed;
    },

    removeAllItems: function() {
        this.set({
            "items": []
        });
    },

    removeItemValuesForAttribute: function(attributeId) {
        var items = this.getItems();

        _.each( items, function( item ) {
            item.values = _.filter(item.values, function(value) {
                return value.bomFieldId !== attributeId;
            });
        });

        this.set({
            "items": items
        });
    },

    // BoM Item Fields

    getItemFieldIds: function() {
        var items = this.get("items");
        var item;
        var field;
        var fields = [];

        for (var cindex in items) {
            item = items[cindex];
            for (var findex in item.values) {
                field = item.values[findex];
                if (!_.contains(fields, field.id || field.cid)) {
                    fields.push(field.id);
                }
            }
        }

        return fields;
    },

    getItemField: function(itemId, bomFieldId) {
        var item = this.getItem(itemId);
        return _.find(item.values, function(result) {
            return bomFieldId === result.id || bomFieldId === result.cid;
        });
    },

    getItemFieldForField: function(itemId, fieldId) {
        //TODO what if there are more than one
        var item;
        var bomField;
        var field;

        item = this.getItem(itemId);
        if (!item) return;

        bomField = _.find(this.get("attributes"), function(result) {
            return result.fieldId === fieldId;
        });
        if (!bomField) return;

        field = _.find(item.values, function(result) {
            return result.bomFieldId === bomField.id || result.bomFieldId === bomField.cid;
        });
        if (!field) return;

        return field;
    },

    //TODO getItemValueForAttribute(itemId, attributeId)
    getItemFieldValueForField: function(itemId, fieldId) {
        //TODO what if there are more than one
        var field = this.getItemFieldForField(itemId, fieldId);
        if (!field) return;

        return field.content;
    }

});

module.exports = BomModel;
