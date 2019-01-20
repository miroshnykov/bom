/* global Pusher:false */
"use strict";

var _ = require("underscore");
var Backbone = require("backbone");
var BomEvent = require("events/BomEvent");
var BomItemEvent = require("events/BomItemEvent");
var ChangeEvent = require("events/ChangeEvent");
var CommentEvent = require("events/CommentEvent");
var config = require("config");
var ProductEvent = require("events/ProductEvent");
var UserEvent = require("events/UserEvent");
var FileEvent = require("events/FileEvent");

module.exports = _.extend({
    pusher: new Pusher(config.pusher.key, { encrypted: true, authEndpoint: "/api/auth/pusher" }),
    subscribed: [],

    start: function() {
        this.listenTo(Backbone, UserEvent.EVENT_LOG_IN,  this.onLogin);
        this.listenTo(Backbone, UserEvent.EVENT_LOG_OUT, this.stop);

        if(config.debug) {
            Pusher.log = function(message) {
                if (window.console && window.console.log) {
                    window.console.log(message);
                }
            };
        }
    },

    stop: function() {
        _.each(this.subscribed, function(name) {
            this.pusher.unsubscribe(name);
        }.bind(this));
        this.subscribed = [];
    },

    onLogin: function(event) {
        this.validateUserEvent(event);

        if(event.companyToken){
            this.subscribeToCompany(event.companyToken);
        }
    },

    subscribeToCompany: function(companyToken) {
        if(_.contains(this.subscribed, "private-company-" + companyToken)) {
            return;
        }

        var channel = this.pusher.subscribe("private-company-" + companyToken);

        channel.bind("change-create", function(data) {
            if(!data) { return; }
            this.send(ChangeEvent.EVENT_ALL, new ChangeEvent(data));
        }.bind(this));

        this.subscribeToProduct(channel);
        this.subscribeToBom(channel);
        this.subscribeToBomItem(channel);
        this.subscribeToComment(channel);
        this.subscribeToFile(channel);

        this.subscribed.push("private-company-" + companyToken);
    },

    subscribeToBom: function(channel) {
        channel.bind("bom-create", function(data) {
            if(!data) { return; }
            this.send(BomEvent.EVENT_CREATE, new BomEvent(data));
        }.bind(this));

        channel.bind("bom-update", function(data) {
            if(!data) { return; }
            this.send(BomEvent.EVENT_UPDATE, new BomEvent(data));
        }.bind(this));

        channel.bind("bom-delete", function(data) {
            if(!data) { return; }
            this.send(BomEvent.EVENT_DELETE, new BomEvent(data));
        }.bind(this));
    },

    subscribeToBomItem: function(channel) {
        channel.bind("bomitem-create", function(data) {
            if(!data) { return; }
            this.send(BomItemEvent.EVENT_CREATE, new BomItemEvent(data));
        }.bind(this));

        channel.bind("bomitem-update", function(data) {
            if(!data) { return; }
            this.send(BomItemEvent.EVENT_UPDATE, new BomItemEvent(data));
        }.bind(this));

        channel.bind("bomitem-delete", function(data) {
            if(!data) { return; }
            this.send(BomItemEvent.EVENT_DELETE, new BomItemEvent(data));
        }.bind(this));
    },

    subscribeToComment: function(channel) {
        channel.bind("comment-create", function(data) {
            if(!data) { return; }
            this.send(CommentEvent.EVENT_CREATE, new CommentEvent(data));
        }.bind(this));

        channel.bind("comment-update", function(data) {
            if(!data) { return; }
            this.send(CommentEvent.EVENT_UPDATE, new CommentEvent(data));
        }.bind(this));

        channel.bind("comment-delete", function(data) {
            if(!data) { return; }
            this.send(CommentEvent.EVENT_DELETE, new CommentEvent(data));
        }.bind(this));
    },

    subscribeToProduct: function(channel) {
        channel.bind("product-create", function(data) {
            if(!data) { return; }
            this.send(ProductEvent.EVENT_CREATE, new ProductEvent(data));
        }.bind(this));

        channel.bind("product-update", function(data) {
            if(!data) { return; }
            this.send(ProductEvent.EVENT_UPDATE, new ProductEvent(data));
        }.bind(this));

        channel.bind("product-delete", function(data) {
            if(!data) { return; }
            this.send(ProductEvent.EVENT_DELETE, new ProductEvent(data));
        }.bind(this));
    },

    subscribeToFile: function(channel) {
        channel.bind("file-create", function(data) {
            if(!data) { return; }
            this.send(FileEvent.EVENT_CREATE, new FileEvent(data));
        }.bind(this));

        channel.bind("file-update", function(data) {
            if(!data) { return; }
            this.send(FileEvent.EVENT_UPDATE, new FileEvent(data));
        }.bind(this));

        channel.bind("file-delete", function(data) {
            if(!data) { return; }
            this.send(FileEvent.EVENT_DELETE, new FileEvent(data));
        }.bind(this));
    },

    validateUserEvent: function(event) {
        if(!(event instanceof UserEvent)) {
            throw new TypeError("Event is not a UserEvent");
        }
    },

    send: function(type, event) {
        Backbone.trigger(type, _.extend(event, {eventIsLocal: false}));
    }

}, Backbone.Events);
