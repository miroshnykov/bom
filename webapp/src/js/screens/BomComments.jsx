"use strict";

var React = require("react");
var Link = require("react-router").Link;
var State = require("react-router").State;

var CommentTable = require("components/CommentTable.jsx");
var ChangeConstants = require("constants/ChangeConstants");
var Scroll = require("components/Scroll.jsx");
var Breadcrumbs = require("components/Breadcrumbs.jsx");

var BomComments = React.createClass({
    mixins: [State],

    propTypes: {
        bom: React.PropTypes.object.isRequired
    },

    componentDidMount: function() {
        this.init();
    },

    componentDidUpdate: function() {
        this.init();
    },

    init: function() {
        if (this.props.bom.getComments().hasFetched() ||
            this.props.bom.getComments().isLoaded()) {
            return;
        }
    },

    render: function() {
        var bom = this.props.bom;

        return (
            <Scroll className="bom-comments">
                <div className="col-md-12">
                    <div className="btn-toolbar">
                        <Breadcrumbs>
                            <Link to="bom" params={this.getParams()}>{bom.get("name")}</Link>
                            Comments
                        </Breadcrumbs>
                    </div>
                </div>
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                    <CommentTable collection={bom.getComments()} />
                </div>
            </Scroll>
        );
    }
});

module.exports = BomComments;
