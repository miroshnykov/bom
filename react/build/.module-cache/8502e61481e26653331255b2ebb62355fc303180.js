var React = require("react");
var Glyphicon = require("react-bootstrap").Glyphicon;
var Button = require("react-bootstrap").Button;
var ButtonToolbar = require("react-bootstrap").ButtonToolbar;

var RevisionActions = require("../actions/RevisionActions");

var cx = require("react/lib/cx");

var RevisionList = React.createClass({displayName: "RevisionList",

  propTypes: {
    allRevisions: React.PropTypes.object.isRequired
  },

  /**
   * @return {object}
   */
  render: function() {
    var syncing = this.props.allRevisions.isSyncing();
    var synced = this.props.allRevisions.isSynced();
    var syncBtnText;

    if (syncing) { syncBtnText = "Syncing..."; }
    else if (synced) { syncBtnText = "Synced"; }
    else { syncBtnText = "Sync"; }

    return (
      React.createElement("div", {id: "revision-list"}, 
        React.createElement(ButtonToolbar, null, 
          React.createElement("h3", {className: "pull-left"}, "History"), 
          React.createElement(Button, {
            className: cx({
              "disabled": syncing || synced
            }), 
            bsStyle: "primary", 
            bsSize: "small", 
            onClick: this._onSync}, 
            syncBtnText
          )
        ), 
        React.createElement("ul", null, 
        
          this.props.allRevisions.map(function(revision) {
            var iconClass = "pull-right glyphicon";

            if (revision.isSyncing()) {
              iconClass += " glyphicon-refresh glyphicon-spin";
            }
            else if (revision.isSynced()) {
              iconClass += " glyphicon-ok-circle alert-success";
            }
            else if (revision.triedSyncing()) {
              iconClass += " glyphicon-ban-circle alert-danger";
            }

            return (
              React.createElement("li", {key: revision.cid}, 
                React.createElement("div", null, 
                  React.createElement("span", null, revision.get("name")), 
                  React.createElement("span", {className: iconClass, "aria-hidden": "true"})
                )
              )
            );
          })
        
        )
      )
    );
  },

  _onSync: function() {
    RevisionActions.sync();
  }

});

module.exports = RevisionList;
