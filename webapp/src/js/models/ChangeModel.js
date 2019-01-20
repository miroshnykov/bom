"use strict";

var ExtendedModel = require("utils/ExtendedModel");
var UserStore = require("stores/UserStore");

var ChangeModel = ExtendedModel.extend({
    _saving: false,
    _saved: false,
    _retries: 0,

    defaults: function() {
        return {
            visible: true
        };
    },

    changedByName: function() {
        if(UserStore.current.id === this.get("changedBy")) {
            return "me";
        }

        var user = UserStore.get(this.get("changedBy"));
        return user ? user.getDisplayName() : "N/A";
    },

    setSaving: function(saving) {
        this._saving = saving;
        if (saving) {
            this._saved = false;
            this._retries++;
        }
        this.trigger("change");
    },

    setSaved: function(saved) {
        this._saved = saved;
        this._saving = false;
        this.trigger("change");
    },

    isSaving: function() { return this._saving; },
    isSaved: function() { return this._saved || !this.isNew(); },
    triedSaving: function() { return !!this._retries; }
});

module.exports = ChangeModel;
