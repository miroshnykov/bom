var ApiConstants = require("../constants/ApiConstants");
var ExtendedModel = require("../utils/ExtendedModel");

var ProductModel = ExtendedModel.extend({
    companyId: undefined,
    _loadingChanges: false,
    _hasLoadedChanges: false,

    urlRoot: function() {
        return ApiConstants.PATH_PREFIX + "/" + this.getCompany() + "/product";
    },

    defaults: function() {
        return {
            bomIds: []
        };
    },

    parse: function(resp, options) {
        //if bom objects, then pluck their ids
        if (!resp.bomIds && resp.boms) {
            resp.bomIds = _.pluck(resp.boms, "id");
            delete resp.boms;
        }

        delete resp.totalChanges;

        resp = _.omit(resp, function(value, key, object) {
            return _.isString(key) && key.slice(0,1) === "_";
        });

        return resp;
    },

    // set: function(key, val, options) {
    //     var attr, attrs, method, model;

    //     if (key == null) return this;

    //     if (typeof key === 'object') {
    //         attrs = key;
    //         options = val;
    //     } else {
    //         (attrs = {})[key] = val;
    //     }

    //     options || (options = {});
    //     method = options.reset ? 'reset' : 'set';

    //     for (attr in attrs) {
    //         val = attrs[attr];

    //         switch(attr) {
    //             case "totalChanges":
    //                 this._unloadedChanges = val;
    //                 delete attrs[attr];
    //                 break;
    //         }
    //     }

    //     return ExtendedModel.prototype.set.apply(this, [attrs, options]);
    // },

    // Company

    setCompany: function(companyId) {
        this.companyId = companyId;
    },

    getCompany: function() {
        return this.companyId;
    },

    // Changes

    isLoadingChanges: function() {
        return this._loadingChanges;
    },

    setLoadingChanges: function(loading) {
        this._loadingChanges = loading;
        if (loading) {
            this._hasLoadedChanges = true;
        }
        this.trigger("update");
    },

    hasLoadedChanges: function() {
        return this._hasLoadedChanges;
    },

    // decUnloadedChangeCount: function(count) {
    //     this._unloadedChanges -= count;
    //     this.trigger("change");
    // },

    // getUnloadedChangeCount: function() {
    //     return this._unloadedChanges;
    // },

    // Children BoMs

    getBoms: function() {
      return this.get("bomIds");
    },

    setBoms: function(bomIds) {
        this.set({
            "bomIds": bomIds
        });
    },

    isParentOfBom: function(bomId) {
        return _.contains(this.getBoms(), bomId);
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
});

module.exports = ProductModel;
