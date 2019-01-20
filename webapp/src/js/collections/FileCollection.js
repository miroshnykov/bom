"use strict";

var _ = require("underscore");
var Backbone = require("backbone");

var FileModel = require("models/FileModel");
var BaseCollection = require("collections/BaseCollection");
var statefulMixin = require("utils/StatefulMixin");
var FileEvent = require("events/FileEvent");

module.exports = BaseCollection.extend({
    mixins: [
        statefulMixin
    ],

    model: FileModel,
    type: undefined,
    entityId: undefined,

    comparator: function(file) {
        return file.get("name").toLowerCase();
    },

    url: function() {
        return require("utils/BaseUrl").buildUrl("file");
    },

    initialize: function(attrs, options) {
        options = options || {};
        this.type = options.type;
        this.entityId = options.entityId || 0;

        this.listenTo(Backbone, FileEvent.EVENT_CREATE, this.onFileCreate);
        this.listenTo(Backbone, FileEvent.EVENT_UPDATE, this.onFileUpdate);
        this.listenTo(Backbone, FileEvent.EVENT_DELETE, this.onFileDelete);
        this.listenTo(this, "change:name", function() { this.sort(); });
    },

    fetch: function(options) {
        var data = {};
        data.type = this.type;
        data.entityId = this.entityId;

        options = options || {};
        options.data = _.extend({}, options.data, data);

        return BaseCollection.prototype.fetch.call(this, options);
    },

    onFileCreate: function(event) {
        if(!event.id ||
            event.type !== this.type || event.parentId !== this.entityId ||
            this.get(event.id)) {
            return;
        }

        this.add(event);
    },

    onFileUpdate: function(event) {
        if(!event.id || !this.get(event.id)) {
            return;
        }

        var file = this.get(event.id);
        file.set({
            name: event.name,
            size: event.size,
            status: event.status
        });
    },

    onFileDelete: function(event) {
        if(!event.id) { return; }
        this.remove(event.id);
    }
});
