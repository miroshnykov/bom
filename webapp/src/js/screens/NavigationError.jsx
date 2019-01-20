"use strict";

var React = require("react");
var State = require("react-router").State;

var SimplePage = require("components/SimplePage.jsx");

var NavigationErrorModel = require("models/NavigationErrorModel");

module.exports = React.createClass({
    mixins: [State],

    propTypes: {
        statusCode: React.PropTypes.string
    },

    render: function() {
        var match = /\/error\/(\d+)/.exec(this.getPath());
        var statusCode = match && match.length > 1 ? match[1] : 404;
        var model = new NavigationErrorModel({statusCode: statusCode});

        return (
            <SimplePage>
                <div className="panel panel-default">
                    <div className="panel-body text-center">
                        <h1>{model.getTitle()}</h1>
                        <div>
                            <span className="fa fa-exclamation-triangle font-12x text-warning" aria-hidden="true" />
                        </div>
                        <h4>
                            {model.description}
                        </h4>
                        <h5>
                            <a href="/">Go back to main page</a>
                        </h5>
                    </div>
                </div>
            </SimplePage>
        );
    }

});
