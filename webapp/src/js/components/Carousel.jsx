"use strict";

var _ = require("underscore");
var cx = require("react/lib/cx");
var Navigation = require("react-router").Navigation;
var React = require("react");

module.exports = React.createClass({

    getInitialState: function() {
        return {
            activeIndex: 0
        };
    },

    propTypes: {
        onComplete: React.PropTypes.func
    },

    renderIndicators: function() {
        return _.map(this.props.children, function (child, index) {
            var isActive = this.active === index;
            return (
                <li
                    key={index}
                    className={cx({active: isActive})}>
                    <span
                        data-slide-to={index}
                        className={cx({
                            "cursor-pointer": true,
                            fa: true,
                            "fa-circle-thin": !isActive,
                            "fa-circle": isActive
                        })} />
                </li>
            );
        }, {active: this.state.activeIndex, onClick: this.onClick});
    },

    renderImages: function() {
        return _.map(this.props.children, function (child, index) {
            return (
                <div className="carousel-image">
                    <img
                        src={child.props.imageSource}
                        className={cx({visible: index === this.active})}/>
                </div>
            );
        }, {active: this.state.activeIndex});
    },

    render: function() {
        return (
            <div className="bom-carousel">
                <div className="carousel-content" role="listbox">
                    <div className="carousel-images">
                        {this.renderImages()}
                    </div>
                    {this.props.children[this.state.activeIndex]}
                </div>

                <div className="carousel-controls">
                    <a
                        className={cx({
                            previous: true,
                            disabled: this.state.activeIndex === 0,
                            "cursor-default": this.state.activeIndex === 0
                        })}
                        role="button"
                        onClick={this.onClick}
                        data-slide="prev">
                        <span className="fa fa-chevron-left arrow" data-slide="prev" aria-hidden="true" />
                    </a>
                    <ul className="indicators fa-ul" onClick={this.onClick}>
                        {this.renderIndicators()}
                    </ul>
                    <a
                        className={cx({
                            next: true,
                            disabled: this.state.activeIndex === (this.props.children.length - 1),
                            "cursor-default": this.state.activeIndex === (this.props.children.length - 1)
                        })}
                        role="button"
                        onClick={this.onClick}
                        data-slide="next">
                        <span className="fa fa-chevron-right arrow" data-slide="next" aria-hidden="true" />
                    </a>
                </div>
            </div>
        );
    },

    onClick: function(event) {
        var index = null;
        if(event.target.dataset.slideTo) {
            index = +event.target.dataset.slideTo;
            this.setState({activeIndex: index});
        } else if(event.target.dataset.slide) {
            index = this.state.activeIndex;

            if(event.target.dataset.slide === "next" && this.props.children.length > (index + 1)) {
                this.setState({activeIndex: ++index});
            } else if(event.target.dataset.slide === "prev" &&  index > 0) {
                this.setState({activeIndex: --index});
            }
        }

        if(this.props.onComplete && index && (index+1) === this.props.children.length) {
            this.props.onComplete();
        }
    }
});
