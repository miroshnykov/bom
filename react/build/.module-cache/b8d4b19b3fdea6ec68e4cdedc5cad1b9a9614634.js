var React = require("react");
var Navigation = require("react-router").Navigation;

var Dashboard = React.createClass({displayName: "Dashboard",
    mixins: [Navigation],

    propTypes: {
        allProducts: React.PropTypes.object.isRequired
    },

    componentWillMount: function() {
        var product;

        if (!this.props.allProducts.length) {
            this.replaceWith("welcome");
        }
        else {
            product = this.props.allProducts.last();
            this.replaceWith("product", {productId: product.id || product.cid});
        }
    },

    /**
     * @return {object}
     */
    render: function() {
        return (
            React.createElement("div", null, 
                React.createElement("div", {className: "content col-md-8"}, 
                    React.createElement("div", {className: "wrapper"}
                    )
                )
            )
        );
    }

});

module.exports = Dashboard;
