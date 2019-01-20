var AppDispatcher = require("../dispatcher/AppDispatcher");
var ActionConstants = require("../constants/ActionConstants");
var ApiConstants = require("../constants/ApiConstants");

var ExtendedModel = require("../utils/ExtendedModel");
var ExtendedCollection = require("../utils/ExtendedCollection");

var Component = ExtendedModel.extend({
  urlRoot: ApiConstants.PATH_PREFIX + "/component"
});

var ComponentCollection = ExtendedCollection.extend({
  model: Component,
  url: ApiConstants.PATH_PREFIX + "/component",

  initialize: function () {
    this.dispatchToken = AppDispatcher.register(this.dispatchCallback.bind(this));
  },

  parse: function(resp, options) {
    options.count = resp && resp.count ? resp.count : 0;
    options.total = resp && resp.total ? resp.total : 0;

    return resp && resp._embedded ? resp._embedded.components : undefined;
  },

  dispatchCallback: function (payload) {
    var action = payload.action;
    switch(action.type) {

      case ActionConstants.FETCH_ALL_COMPONENTS:
        this.fetch().then(function(collection) {
          //console.log(collection);
          action.resolve(collection);
        }, function(error) {
          console.log(error);
          action.reject(error);
        });
        break;

      // case ComponentConstants.COMPONENT_UPDATE_FIELD:
      //   componentId = action.componentId;
      //   fieldId = action.fieldId;

      //   value = {}
      //   value[fieldId] = action.value;

      //   for (var key in _components) {
      //     if (_components[key].id === componentId) {
      //       update(componentId, value);
      //     }
      //   }

      //   ComponentStore.emitChange();
      //   break;

      // case ComponentConstants.COMPONENT_SELECT:
      //   id = action.id;

      //   if (id && _components[id]) {
      //     //TODO should this just be a state in the view
      //     _components[id].selected = !_components[id].selected;
      //     ComponentStore.emitChange();
      //   }
      //   break;

      // case ComponentConstants.COMPONENT_DESTROY:
      //   var ids = action.ids;

      //   for(var key in ids) {
      //     destroy(ids[key]);
      //   }

      //   ComponentStore.emitChange();
      //   break;

      // case BomConstants.BOM_CREATE:
      //   //TODO should this be a separate action after the BOM_CREATE was successful?
      //   if (action.bom) {
      //     AppDispatcher.waitFor([BomStore.dispatchToken]);

      //     for(var compKey in action.bom.components) {
      //       component = create(action.tempId);

      //       updates = {};
      //       for(var colKey in action.bom.columns) {
      //         if (action.bom.columns[colKey].field) {
      //           updates[action.bom.columns[colKey].field.id] = action.bom.components[compKey][colKey];
      //         }
      //       }
      //       update(component.id, updates);
      //     }

      //     ComponentStore.emitChange();
      //   }
      //   break;

      default:
        // do nothing
    }
  }

});

var ComponentStore = new ComponentCollection();

module.exports = ComponentStore;
