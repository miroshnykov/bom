"use strict";

var _ = require("underscore");

var StatefulMixin = {

    state: undefined,

    STATE_IDLE: "idle",
    STATE_SENDING: "sending",
    STATE_ERROR: "error",
    STATE_SUCCESS: "success",

    initialize: function() {
        this.listenTo(this, "request", _.partial(this.onChangeState, this.STATE_SENDING));
        this.listenTo(this, "sync", _.partial(this.onChangeState, this.STATE_SUCCESS));
        this.listenTo(this, "error", _.partial(this.onChangeState, this.STATE_ERROR));
        this.state = this.STATE_IDLE;
    },

    onChangeState: function(state) {
        state = state || this.STATE_IDLE;
        if (this.state === state) { return; }
        this.state = state;
        this.trigger("change:state", this);
    },

    isStateIdle: function() {
        return this.state === this.STATE_IDLE;
    },

    isStateSending: function() {
        return this.state === this.STATE_SENDING;
    },

    isStateSuccess: function() {
        return this.state === this.STATE_SUCCESS;
    },

    isStateError: function() {
        return this.state === this.STATE_ERROR;
    }
};

module.exports = StatefulMixin;
