"use strict";

var Backbone = require("backbone");
var UserInviteModel = require("models/UserInviteModel");

module.exports = Backbone.Collection.extend({

 	model: UserInviteModel,

	url: function() {
		return require("utils/BaseUrl").buildUrl("invite");
    },

    comparator: function(first, second) {
    	return (second.get("id") || 0) - (first.get("id") || 0);
	},

    getNewInvite: function(){
		if(!this.newInvite) {
			this.buildNewInvite();
		}
		return this.newInvite;
    },

    buildNewInvite: function() {
    	this.newInvite = new UserInviteModel();
		this.newInvite.on("sync", function() {
			this.add(this.newInvite.clone());
			var attrs = {
				firstName: this.newInvite.get("firstName"),
				lastName: this.newInvite.get("lastName"),
				email: this.newInvite.get("email")
			};
			this.newInvite.clear();
			this.newInvite.set(attrs);
			this.newInvite.set("state", this.newInvite.STATE_SUCCESS);
		}.bind(this));
    }

});
