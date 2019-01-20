"use strict";

var _ = require("underscore");
var React = require("react");
var Button = require("react-bootstrap").Button;
var Glyphicon = require("react-bootstrap").Glyphicon;

var CommentCollection = require("collections/CommentCollection");
var CommentTable = require("components/CommentTable.jsx");
var Modal = require("components/modals/Modal.jsx");
var Scroll = require("components/Scroll.jsx");
var BomItemModel = require("models/BomItemModel");

module.exports = React.createClass({

    propTypes: {
        alerts: React.PropTypes.bool,
        entity: React.PropTypes.object,
        title: React.PropTypes.string.isRequired
    },

    getInitialState: function() {
        return {
            comments: new CommentCollection()
        };
    },

    componentWillMount: function() {
        var comments = this.state.comments;
        comments.setParent(this.props.entity);
        this.setState({comments: comments});
    },

    render: function() {
        var title = this.props.title;
        title += " " + (this.props.alerts ? "Problems" : "Comments");
        return (
            <Modal
                title={title}
                saveLabel="Done">
                <Scroll>
                    <CommentTable
                        collection={this.state.comments}
                        embedded={true}
                        alerts={this.props.alerts}/>
                    {this.renderAutomatedAlerts()}
                </Scroll>
            </Modal>
        );
    },

    renderAutomatedAlerts: function() {
        if (!this.props.alerts) { return null; }
        if (!(this.props.entity instanceof BomItemModel)) { return null; }

        var alerts = this.props.entity.get("alerts");

        return (
            <table className="comment-table table table-striped table-bordered table-condensed table-hover table-fill">
                <tbody>
                {_.keys(alerts).map(function(alertId) {
                    var body = alerts[alertId];
                    return (
                        <tr>
                            <td className="icon-cell">
                                <span className="fa fa-exclamation-triangle text-warning icon" />
                            </td>
                            <td>
                                <div>
                                    <p>{body}</p>
                                    <span><small>&ndash; automated warning</small></span>
                                </div>
                            </td>
                            <td className="actions compact">
                                <Button
                                    className="btn-nobg invisible"
                                    bsStyle="default"
                                    bsSize="small"
                                    disabled={true}
                                    onClick={function() {}}>
                                    <Glyphicon bsSize="small" glyph="pencil" />
                                </Button>
                                <Button
                                    className="btn-nobg invisible"
                                    bsStyle="danger"
                                    bsSize="small"
                                    disabled={true}
                                    onClick={function() {}}>
                                    <Glyphicon bsSize="small" glyph="remove" />
                                </Button>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        );
    }
});
