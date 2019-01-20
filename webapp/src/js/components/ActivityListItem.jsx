"use strict";

var moment     = require("moment");
var Navigation = require("react-router").Navigation;
var React      = require("react");
var UserStore  = require("stores/UserStore");

module.exports = React.createClass({
    mixins: [Navigation],

    propTypes: {
        item: React.PropTypes.object.isRequired
    },

    render: function() {
        var item = this.props.item;
        var author = UserStore.get(item.get("author"));
        var time = moment.unix(item.get("createdAt")).fromNow();
        return (
            <div className="row activity-list-item">
                <div className="col-xs-12 col-md-3 col-lg-2">
                    <div className="display-name text-uppercase">{author.getDisplayName()}</div>
                    <small className="text-muted">{time}</small>
                    <img className="img-thumbnail" src={author.getAvatarUrl()} />
                </div>
                <div className="col-xs-8 col-md-6 col-lg-7">
                    <div className="text-uppercase">
                        {this.getLabel(item.get("type"))}:
                    </div>
                    <div className="description">
                        {item.get("description")}
                    </div>
                </div>
                <div className="col-xs-4 col-md-3 col-lg-3">
                    <a className="item-link cursor-pointer" onClick={this.goToProduct}>
                        <span className="fa fa-male" />
                        {item.get("targetProductName")}
                    </a>
                    <a className="item-link cursor-pointer" onClick={this.goToBom}>
                        <span className="fa fa-wrench" />
                        {item.get("targetBomName")}
                    </a>
                    <a className="item-link cursor-pointer" onClick={this.gotToItem}>
                        <span className="fa fa-square-o" />
                        item
                    </a>
                </div>
            </div>
        );
    },

    getLabel: function(type) {
        switch(type) {
            case "bomComment":      return "BoM Comment";
            case "bomCreated":      return "BoM Created";
            case "bomDeleted":      return "BoM Deleted";
            case "bomError":        return "BoM Errors";
            case "itemComment":     return "Item Comment";
            case "itemError":       return "Item Errors";
            case "productComment":  return "Product Comment";
            case "quantityChanged": return "Item Qty Changed";
            default:                return "";
        }
    },

    goToProduct: function() {
        this.transitionTo('product', {productId: this.props.item.get("targetProductId")});
    },

    goToBom: function() {
        this.transitionTo('bomDashboard', {
            productId: this.props.item.get("targetProductId"),
            bomId: this.props.item.get("targetBomId")
        });
    },

    gotToItem: function() {
        // TODO
    }
});
