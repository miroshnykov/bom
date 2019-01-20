"use strict";

var cx = require("react/lib/cx");
var React = require("react");

module.exports = React.createClass({

    propTypes: {
      title: React.PropTypes.string.isRequired,
      saveLabel: React.PropTypes.string.isRequired,
      dismissLabel: React.PropTypes.string,
      backdrop: React.PropTypes.string,
      onConfirm: React.PropTypes.func,
      className: React.PropTypes.string,
      disableConfirm: React.PropTypes.bool
    },

    render: function() {
        var dismissHeader = null;
        var dismissFooter = null;

        if(this.props.dismissLabel) {
            dismissHeader = (
                <button type="button" className="close" data-dismiss="modal" tabIndex="-1">
                    <span aria-hidden="true">&times;</span>
                </button>);
            dismissFooter = (
                <button type="button" className="btn btn-default" data-dismiss="modal" tabIndex="2">
                    {this.props.dismissLabel}
                </button>);
        }

        return (
            <div className={cx("modal", "fade", this.props.className)} id="modal" data-backdrop={this.props.backdrop}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            {dismissHeader}
                            <h4 className="modal-title">{this.props.title}</h4>
                        </div>
                        <div className="modal-body">
                            {this.props.children}
                        </div>
                        <div className="modal-footer">
                            {dismissFooter}
                            <button
                                type="button"
                                id="modalConfirm"
                                className={cx({
                                    btn: true,
                                    "btn-primary": true,
                                    disabled: this.props.disableConfirm
                                })}
                                data-dismiss="modal"
                                tabIndex="1"
                                disabled={this.props.disableConfirm}
                                onClick={this.props.onConfirm}>
                                {this.props.saveLabel}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

