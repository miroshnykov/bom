"use strict";

var _ = require("underscore");
var React = require("react");
var _string = require("underscore.string");
var Button = require("react-bootstrap").Button;
var ButtonToolbar = require("react-bootstrap").ButtonToolbar;
var Glyphicon = require("react-bootstrap").Glyphicon;
var Link = require("react-router").Link;
var Modal = require("components/modals/Modal.jsx");
var moment = require("moment");
var backboneMixin = require("backbone-react-component");

var AppDispatcher = require("dispatcher/AppDispatcher");
var ValidatedInput = require("components/forms/ValidatedInput.jsx");
var InputConstants = require("constants/InputConstants");
var Spinner = require("components/Spinner.jsx");
var Toggle = require("react-toggle");

var cx = require("react/lib/cx");

require("underscore.inflection");

var CommentItem = React.createClass({
    mixins: [backboneMixin],

    propTypes: {
        alert: React.PropTypes.bool,
        embedded: React.PropTypes.bool,
        isEditing: React.PropTypes.bool,
        readonly: React.PropTypes.bool
    },

    getInitialState: function() {
        return {
            isEditing: this.props.isEditing,
            errors: {}
        };
    },

    componentWillMount: function() {
        var defaultValue = this.props.alert ? "warning" : "comment";
        var category = this.getModel().get("category") || defaultValue;
        this.setState({
            category: category
        });
    },

    render: function() {
        var comment = this.getModel();
        var body = comment.get("body");
        var bodyElement;

        var header = this.renderHeader();

        if (this.state.isEditing) {
            bodyElement = (
                <div>
                    <form ref="form" onSubmit={this.onSave} onReset={this.onCancel} autoComplete="off">
                        {header}
                        <ValidatedInput
                            ref="body"
                            name="body"
                            value={body}
                            type="textarea"
                            rows={_.max([_.min([_string(body).lines().length, 10]), 2])}
                            autoComplete="off"
                            disabled={this.props.readonly || comment.isStateSending()}
                            shortcuts={{
                                "mod+enter": this.onSave
                            }}
                            placeholder={"New " + (this.props.alert ? "problem" : "comment") + "..."}
                            errorLabel={this.state.errors.body || this.state.errors.save}
                            displayFeedback={!!this.state.errors.body || !!this.state.errors.save}
                            onChange={this.onChange} />
                        <div className="form-group">
                            { comment.isNew() ? this.renderShortcut() : this.renderAuthorDate() }
                            <div className="btn-toolbar pull-right">
                                <button
                                    type="submit"
                                    className={cx({
                                        "btn": true,
                                        "btn-primary": true,
                                        "pull-right": true,
                                        "disabled": !this.canSubmit()
                                    })}
                                    disabled={!this.canSubmit()}
                                    value="submit">{this.renderSubmitButtonText()}</button>
                                <button
                                    type="reset"
                                    className={cx({
                                        "btn": true,
                                        "btn-default": true,
                                        "pull-right": true,
                                        "invisible": comment.isNew()
                                    })}
                                    value="cancel">Cancel</button>
                            </div>
                        </div>
                    </form>
                </div>
            );
        }
        else {
            bodyElement = (
                <div>
                    <p>{
                        _string(body).lines().map(function(line, index){
                            return (<span key={index}>{line}<br /></span>);
                        })
                    }</p>
                    {this.renderAuthorDate()}
                </div>
            );
        }

        var icon = null;
        if(this.props.alert) {
            icon = (
               <td className="icon-cell">
                    <span className={cx({
                            fa: true,
                            "fa-exclamation-triangle": this.state.category === "warning",
                            "fa-exclamation-circle": this.state.category === "error",
                            "fa-comment-o": this.state.category === "comment",
                            "text-warning": this.state.category === "warning",
                            "text-danger": this.state.category === "error",
                            icon: true
                        })} />
                </td>
            );
        }

        return (
            <tr>
                {icon}
                <td>{bodyElement}</td>
                {this.renderActions()}
            </tr>)
    },

    renderHeader: function() {
        if (!this.props.alert) { return null; }

        return (
            <div className="comment-item-header">
                <div className="pull-right">
                    <div className="btn-group btn-group-sm">
                        <button
                            type="button"
                            className={cx({
                                btn: true,
                                "btn-danger": this.state.category === "error",
                                "btn-warning": this.state.category === "warning",
                                "dropdown-toggle": true
                            })}
                            data-toggle="dropdown">
                            {_.titleize(this.state.category)} <span className="caret"></span>
                        </button>
                        <ul className="dropdown-menu">
                            <li>
                                <a onClick={this.onSetCategory} href="#">
                                    Warning
                                </a>
                            </li>
                            <li>
                                <a onClick={this.onSetCategory} href="#">
                                    Error
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>);
    },

    renderCancelBtn: function() {

    },

    onSetCategory: function(event) {
        event.preventDefault();

        this.setState({
            category: event.target.text.toLowerCase()
        });
    },

    canSubmit: function() {
        return !this.props.readonly &&
            _.isEmpty( _.omit(this.state.errors, "save") ) &&
            !this.getModel().isStateSending();
    },

    renderShortcut: function() {
        return <span><code>{InputConstants.MOD_ALIAS}</code> + <code>enter</code> to submit</span>;
    },

    renderAuthorDate: function() {
        var comment = this.getModel();
        var author = comment.authorName();
        var date = comment.has("createdAt") ? moment.unix(comment.get("createdAt")).calendar() : "N/A";

        return (
            <span>
                <small>
                    {author} &ndash; {date}
                </small>
            </span>);
    },

    renderActions: function() {
        var comment = this.getModel();

        return (
            <td className="actions compact">
                <Button
                    className={cx({
                        "btn-nobg": true,
                        "invisible": comment.isNew()
                    })}
                    bsStyle="default"
                    bsSize="small"
                    disabled={this.props.readonly || comment.isStateSending()}
                    onClick={this.onEdit} >
                    <Glyphicon
                        bsSize="small"
                        glyph="pencil" />
                </Button>
                <Button
                    className={cx({
                        "btn-nobg": true,
                        "invisible": comment.isNew()
                    })}
                    bsStyle="danger"
                    bsSize="small"
                    disabled={this.props.readonly || comment.isStateSending()}
                    onClick={this.onRemove} >
                    <Glyphicon
                        bsSize="small"
                        glyph="remove" />
                </Button>
            </td>);
    },

    renderSubmitButtonText: function() {
        if(this.getModel().isStateSending()) {
            return (<Spinner />);
        } else {
            return "Submit";
        }
    },

    onEdit: function(event) {
        this.setState({
            isEditing: true
        }, function() {
            this.refs.body.focus();
            this.refs.body.select();
        }.bind(this));
    },

    onChange: function(event) {
        var value = {}
        value[event.target.name] = event.target.value;

        this.setState({
            errors: this.getModel().preValidate(value) || {}
        });
    },

    onSave: function(event) {
        if (event) {
            event.preventDefault();
        }

        var comment = this.getModel();
        var body = this.refs.body.state.value || "";
        body = body.trim();

        if (comment.get("body") === body && comment.get("category") === this.state.category) {
            this.setState({
                isEditing: this.props.isEditing
            });
            return;
        }

        comment.save({ body: body, category: this.state.category }, { wait: true }).then(function(comment) {
            this.setState({
                isEditing: this.props.isEditing
            });

            this.refs.body.clear();
        }.bind(this), function(error) {
            this.setState({
                errors: _.isEmpty(error.getValidationErrors()) ? { save: error.message } : error.getValidationErrors()
            });
        }.bind(this));
    },

    onCancel: function(event) {
        if (event) {
            event.preventDefault();
        }

        this.setState({
            isEditing: false
        });
    },

    onRemove: function(event) {
        if(this.props.embedded) {
            this.onRemoveConfirm();
            return;
        }

        AppDispatcher.dispatch({
            action: {
                type: "show-modal"
            },
            modal: (
                <Modal
                    title="Delete Comment"
                    saveLabel="Confirm"
                    dismissLabel="Cancel"
                    onConfirm={this.onRemoveConfirm}>
                    Are you sure you want to permanently delete this comment?
                </Modal>)
        });
   },

    onRemoveConfirm: function() {
        this.getModel().destroy();
    }
});

module.exports = CommentItem;
