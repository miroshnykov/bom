var ApiConstants = require("../constants/ApiConstants");
var ExtendedModel = require("../utils/ExtendedModel");

var ProductModel = ExtendedModel.extend({
    companyId: undefined,

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

        resp = _.omit(resp, function(value, key, object) {
            return _.isString(key) && key.slice(0,1) === "_";
        });
        return resp;
    },

    // Company

    setCompany: function(companyId) {
        this.companyId = companyId;
    },

    getCompany: function() {
        return this.companyId;
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
