var React = require("react");
var Table = require("react-bootstrap").Table;

var BomImportItem = React.createClass({displayName: "BomImportItem",

    propTypes: {
        item: React.PropTypes.object.isRequired,
        attributes: React.PropTypes.array.isRequired
    },

    /**
    * @return {object}
    */
    render: function() {
        var item = this.props.item;
        var attributes = this.props.attributes;

        var values = attributes.map(function(attribute) {
            var value = item.getValueForAttribute(attribute.id);
            return React.createElement("td", {className: attribute.status, key: attribute.id}, value ? value.get("content") : "")
        });

        return (
            React.createElement("tr", null, values)
        );
    }

});

module.exports = BomImportItem;
