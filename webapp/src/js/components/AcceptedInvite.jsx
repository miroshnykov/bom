"use strict";

var backboneMixin = require("backbone-react-component");
var React = require("react");

module.exports = React.createClass({
    mixins: [backboneMixin],

    render: function() {
        return (
            <li className="list-group-item">
                <div className="row">
                    <div className="col-md-12">
                        <h5 className="list-group-item-heading">
                            {this.getModel().get("firstName") + " " + this.getModel().get("lastName")}
                        </h5>
                        <p className="list-group-item-text">{this.getModel().get("email")}</p>
                    </div>
                </div>
            </li>
        );
    }
});


