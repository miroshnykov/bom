var React = require("react");

var Profile = React.createClass({displayName: "Profile",

  /**
   * @return {object}
   */
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("div", {className: "content col-md-8"}, 
          React.createElement("div", {className: "wrapper"}
          )
        )
      )
    );
  }

});

module.exports = Profile;
