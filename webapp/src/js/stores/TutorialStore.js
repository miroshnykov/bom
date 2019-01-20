"use strict";

var _ = require("underscore");
var ActionConstants = require("constants/ActionConstants");
var AppDispatcher = require("dispatcher/AppDispatcher");
var Backbone = require("backbone");
var UserStore = require("stores/UserStore");

var tutorialSequence = [
	"tutorial",
	"help"
];

function getHints() {
	return UserStore.current.get("hints") || {};
}

var TutorialStore = _.extend({
	show: function(name) {
		return !(getHints()[name]);
	},

	showHint: function(name) {
		if(name !== this.currentStep()) {
			return false;
		}

		return this.show(name);
	},

	showTutorial: function() {
		return this.showHint("tutorial");
	},

	completedTutorial: function() {
		return !(this.show("tutorial"));
	},

	currentStep: function() {
		var hints = getHints();
		return _.find(tutorialSequence, function(hint) {
			return !(hints[hint] || false);
		});
	},

	dismiss: function(name) {
		var hints = _.clone(getHints());
		hints[name] = true;
		UserStore.current.save({hints: hints});
	}
}, Backbone.Events);

TutorialStore.token =
	AppDispatcher.register(function(event) {
		var action = event.action;
		switch (action.type) {
	    	case ActionConstants.DISMISS_HINT:
	    		TutorialStore.dismiss(action.attributes.name);
	    		TutorialStore.trigger("dismissHint", action.attributes.name);
	        	break;
	        case ActionConstants.COMPLETE_TUTORIAL:
	        	TutorialStore.dismiss("tutorial");
	        	TutorialStore.trigger("tutorialComplete");
	        	break;
    	}
	});

module.exports = TutorialStore;
