"use strict";

var React = require("react");
var backboneMixin = require("backbone-react-component");

var Spinner = require("components/Spinner.jsx");
var FileItem = require("components/FileItem.jsx");

module.exports = React.createClass({
    mixins: [backboneMixin],

    render: function() {
        var files = this.getCollection();

        return (
            <div className="col-md-12">
                <div className="form-group hidden">
                    <form ref="fileForm" action="#" method="post" encType="multipart/form-data">
                        <input type="file" ref="fileInput" className="invisible" onChange={this.onChangeFile} />
                    </form>
                </div>
                {this.state.isLoading || !files.isEmpty() ?
                    this.renderList(files) :
                    this.renderEmpty()}
            </div>
        );
    },

    renderEmpty: function() {
        return (
            <div className="text-center text-muted placeholder">
                No files are attached. Click <a href="#" onClick={this.onAdd}>here</a> to add one.
            </div>
        );
    },

    renderList: function(files) {
        var more;

        if (files.isLoading()) {
            more = (
                <div className="row text-center">
                    <Spinner className="spinner-dark" />
                </div>);
        }

        return (
            <div>
                {files.map(function(file) {
                    return (<FileItem key={file.id || file.cid} model={file} />);
                }, this)}
                {more}
            </div>
        );
    },

    onAdd: function(event) {
        if (event) {
            event.preventDefault();
        }

        $(React.findDOMNode(this.refs.fileForm))[0].reset();
        $(React.findDOMNode(this.refs.fileInput)).trigger("click");
    },

    onChangeFile: function(event) {
        this.getCollection().add({}).save({
            file: event.target.files[0]
        });
    }
});
