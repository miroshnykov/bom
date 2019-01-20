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
            var value = _.findWhere(item.values, {
                bomFieldId: attribute.id || attribute.cid
            });

            return React.createElement("td", {className: attribute.status, key: attribute.id || attribute.cid}, value ? value.content : "")
        });

        return (
            React.createElement("tr", null, values)
        );
    }

});

module.exports = BomImportItem;
