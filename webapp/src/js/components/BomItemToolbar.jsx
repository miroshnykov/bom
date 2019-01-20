"use strict";

var _ = require("underscore");
var cx = require("react/lib/cx");
var React = require("react");

require("underscore.inflection");

module.exports = React.createClass({

    propTypes: {
        comments: React.PropTypes.number,
        errors: React.PropTypes.number,
        warnings: React.PropTypes.number,
        isApproved: React.PropTypes.bool,
        onClickAlerts: React.PropTypes.func,
        onClickApprove: React.PropTypes.func,
        onClickComments: React.PropTypes.func
    },

    render: function() {
        var commentCount = this.props.comments || 0;
        var warningCount = this.props.warnings || 0;
        var errorCount   = this.props.errors   || 0;

        var commentTooltip =
            commentCount + _.pluralize(" comment", commentCount);

        var alertTooltip =
            warningCount + _.pluralize(" warning", warningCount) +
            " and " + errorCount + _.pluralize(" error", errorCount);

        var canToggleApprove =
            this.props.onClickApprove && !errorCount && !warningCount;

        var approveTooltip = null;
        if(canToggleApprove) {
            approveTooltip = "Toggle approval of item";
        } else if(this.props.onClickApprove) {
            approveTooltip = "Please clear problems before approving";
        }

        return (
            <div className="bom-item-toolbar">
                <span
                    title={commentTooltip}
                    onClick={this.props.onClickComments}
                    className={cx({
                        "cursor-pointer": this.props.onClickComments,
                        fa: true,
                        "fa-comment-o": !commentCount,
                        "fa-comment": commentCount,
                        faded: !commentCount
                    })}/>
                <span
                    title={alertTooltip}
                    onClick={this.props.onClickAlerts}
                    className={cx({
                        "cursor-pointer": this.props.onClickAlerts,
                        fa: true,
                        "fa-exclamation-triangle": true,
                        faded: !warningCount && !errorCount,
                        error: !!errorCount,
                        warning: !errorCount && !!warningCount
                    })}/>
                <span
                    title={approveTooltip}
                    onClick={this.onClickApprove}
                    className={cx({
                        "cursor-pointer": canToggleApprove,
                        fa: true,
                        "fa-check": true,
                        faded: !this.props.isApproved,
                        success: this.props.isApproved
                    })}/>
            </div>);
    },

    onClickApprove: function() {
        if(this.props.warnings || this.props.errors || !this.props.onClickApprove){
            return;
        }

        this.props.onClickApprove();
    }

});
