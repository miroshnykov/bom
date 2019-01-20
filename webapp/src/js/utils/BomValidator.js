"use strict";

var _ = require("underscore");

var BomValidator = {
    NUMERIC_VALUES: "NUMERIC_VALUES",
    MATCH_QTY_DESIGNATORS: "MATCH_QTY_DESIGNATORS",
    UNIQUE_ATTR_BUILD_OPTION: "UNIQUE_ATTR_BUILD_OPTION",
    UNIQUE_DESIGNATORS: "UNIQUE_DESIGNATORS",
    MATCH_MPN_SPN: "MATCH_MPN_SPN",
    VOLT_UNITS: "VOLT_UNITS",
    TYPE_UNITS: "TYPE_UNITS",

    FLOAT_PATTERN: "[-+]?[0-9]+(?:\\.[0-9]+)?",
    PREFIXES_PATTERN: [
        "y", "Yocto", "yocto",
        "z", "Zepto", "zepto",
        "a", "Atto", "atto",
        "f", "Femto", "femto",
        "p", "Pico", "pico",
        "n", "Nano", "nano",
        "u", "\u03BC"/*µ as greek letter*/,"\u00B5"/*µ as micro sign*/, "Micro", "mc", "micro",
        "m", "Milli", "milli",
        "c", "Centi", "centi",
        "d", "Deci", "deci",
        "da", "Deca", "deca", "deka",
        "h", "Hecto", "hecto",
        "k", "kilo",
        "M", "Mega", "mega",
        "G", "Giga", "giga",
        "T", "Tera", "tera",
        "P", "Peta", "peta",
        "E", "Exa", "exa",
        "Z", "Zetta", "zetta",
        "Y", "Yotta", "yotta"
    ].join("|"),

    /**
     * Values for fields of type number should be numeric.
     */
    validateNumericValues: function(item, attributes) {
        _.each(attributes, function(attribute) {
            var ruleMessage = attribute.get("name") + " must be a numerical value";
            var ruleId = BomValidator.NUMERIC_VALUES + "::" + attribute.cid;

            var value = item.getValueForAttribute(attribute.id || attribute.cid);
            if (!value) {
                item.clearAlert(ruleId);
                return;
            }

            if (isNaN(+value.get("content"))) {
                item.setAlert(ruleId, ruleMessage);
                value.setAlert(ruleId, ruleMessage);
            }
            else {
                item.clearAlert(ruleId);
                value.clearAlert(ruleId);
            }
        }, this);
    },

    /**
     * Amount of designators should match the quantity.
     */
    validateQuantityDesignators: function(item, qtyAttribute, desigAttribute) {
        if (!qtyAttribute || !desigAttribute) { return; }

        var ruleMessage = desigAttribute.get("name") + " value does not match " + qtyAttribute.get("name");
        var qty = item.getValueForAttribute(qtyAttribute.id || qtyAttribute.cid);
        var desig = item.getValueForAttribute(desigAttribute.id || desigAttribute.cid);

        if (!qty || isNaN(qty.get("content")) || qty.get("content") === "" ||
            !desig || !desig.get("content")) {

            item.clearAlert(BomValidator.MATCH_QTY_DESIGNATORS);
            if (qty) {
                qty.clearAlert(BomValidator.MATCH_QTY_DESIGNATORS);
            }
            if (desig) {
                desig.clearAlert(BomValidator.MATCH_QTY_DESIGNATORS);
            }
            return;
        }

        if (parseInt(qty.get("content"), 10) !== desig.get("content").split(",").length) {
            item.setAlert(BomValidator.MATCH_QTY_DESIGNATORS, ruleMessage);
            qty.setAlert(BomValidator.MATCH_QTY_DESIGNATORS, ruleMessage);
            desig.setAlert(BomValidator.MATCH_QTY_DESIGNATORS, ruleMessage);
        }
        else {
            item.clearAlert(BomValidator.MATCH_QTY_DESIGNATORS, ruleMessage);
            qty.clearAlert(BomValidator.MATCH_QTY_DESIGNATORS, ruleMessage);
            desig.clearAlert(BomValidator.MATCH_QTY_DESIGNATORS, ruleMessage);
        }
    },

    /**
     * Validate that a given attribute and build option pair is unique.
     */
    validateUniqueAttributeBuildOption: function(items, dupAttribute, bldOptAttribute) {
        if (!dupAttribute) { return; }

        var ruleMessage = dupAttribute.get("name") + " values should be unique.";
        var ruleId = BomValidator.UNIQUE_ATTR_BUILD_OPTION + "::" + dupAttribute.cid;

        _.each(items, function(item) {
            var dup = item.getValueForAttribute(dupAttribute.id || dupAttribute.cid);
            if (!dup || (_.isString(dup.get("content")) && !dup.get("content").length)) {
                item.clearAlert(ruleId);
                if (dup) {
                    dup.clearAlert(ruleId);
                }
            }
        });

        // Get the list of items with the attribute value
        items = _.filter(items, function(item) {
            var dup = item.getValueForAttribute(dupAttribute.id || dupAttribute.cid);
            return dup && (!_.isString(dup.get("content")) || dup.get("content").length > 0);
        });

        items = _.groupBy(items, function(item) {
            var dup = item.getValueForAttribute(dupAttribute.id || dupAttribute.cid);
            return dup.get("content");
        });

        _.each(items, function(group) {

            var bldOptGroups = bldOptAttribute ?
                _.groupBy(group, function(item) {
                    var bldOpt = item.getValueForAttribute(bldOptAttribute.id || bldOptAttribute.cid);
                    return bldOpt ? bldOpt.get("content") : undefined;
                }) :
                [group];

            _.each(bldOptGroups, function(bldOptGroup) {
                var dup;

                if (bldOptGroup.length > 1) {
                    _.each(bldOptGroup, function(item) {
                        var dup = item.getValueForAttribute(dupAttribute.id || dupAttribute.cid);
                        item.setAlert(ruleId, ruleMessage);
                        dup.setAlert(ruleId, ruleMessage);
                    });
                } else {
                    dup = bldOptGroup[0].getValueForAttribute(dupAttribute.id || dupAttribute.cid);
                    bldOptGroup[0].clearAlert(ruleId);
                    dup.clearAlert(ruleId);
                }
            });
        });
    },

    /**
     * Designator values must be unique in a BoM.
     */
    validateUniqueDesignators: function(items, desigAttribute) {
        if (!desigAttribute) { return; }

        var ruleMessage = desigAttribute.get("name") + " values should be unique.";
        var allDesignators = [];
        var dupDesignators = [];

        _.each(items, function(item) {
            var desigs = item.getValueForAttribute(desigAttribute.id || desigAttribute.cid);
            if (!desigs) { return; }

            desigs = desigs.get("content").split(",");

            desigs = desigs.map(function(desig) {
                return desig.trim();
            });

            allDesignators = allDesignators.concat(desigs);
        });

        allDesignators = allDesignators.filter(function(desig) {
            return desig !== "";
        });

        allDesignators.sort();

        _.each(allDesignators, function(desig, index, list) {
            var desig2 = index < list.length-1 ? list[index+1] : null;

            if (desig === desig2) {
                dupDesignators.push(desig);
            }
        });

        dupDesignators = _.uniq(dupDesignators);

        _.each(items, function(item) {
            var desigs = item.getValueForAttribute(desigAttribute.id || desigAttribute.cid);
            if (!desigs) { return; }

            var desigsArray;
            desigsArray = desigs.get("content").split(",");
            desigsArray = desigsArray.map(function(desig) {
                return desig.trim();
            });

            if (!_.isEmpty(_.intersection(desigsArray, dupDesignators))) {
                item.setAlert(BomValidator.UNIQUE_DESIGNATORS, ruleMessage);
                desigs.setAlert(BomValidator.UNIQUE_DESIGNATORS, ruleMessage);
            }
            else {
                item.clearAlert(BomValidator.UNIQUE_DESIGNATORS);
                desigs.clearAlert(BomValidator.UNIQUE_DESIGNATORS);
            }
        });
    },

    /**
     * Matching MPN values should have matching SPN values.
     */
    validateMpnSpnMatch: function(items, mpnAttribute, spnAttribute) {
        if (!mpnAttribute || !spnAttribute) { return; }

        var ruleMessage = "Matching " + mpnAttribute.get("name") + " values should have matching " + spnAttribute.get("name") + " values.";

        _.each(items, function(item) {
            var mpn = item.getValueForAttribute(mpnAttribute.id || mpnAttribute.cid);
            var spn = item.getValueForAttribute(spnAttribute.id || spnAttribute.cid);
            if (!mpn || !spn) {
                item.clearAlert(BomValidator.MATCH_MPN_SPN);
                if (mpn) {
                    mpn.clearAlert(BomValidator.MATCH_MPN_SPN);
                }
                if (spn) {
                    spn.clearAlert(BomValidator.MATCH_MPN_SPN);
                }
            }
        });

        // Get the list of items with MPN and SPN
        items = _.filter(items, function(item) {
            return !!item.getValueForAttribute(mpnAttribute.id || mpnAttribute.cid) && !!item.getValueForAttribute(spnAttribute.id || spnAttribute.cid);
        });

        // Group by MPN
        items = _.groupBy(items, function(item) {
            var mpn = item.getValueForAttribute(mpnAttribute.id || mpnAttribute.cid);
            return mpn.get("content");
        });

        // Invalidate all non-matching values
        _.each(items, function(group) {
            var uniqSpn = _.uniq(group, false, function(item) {
                var spn = item.getValueForAttribute(spnAttribute.id || spnAttribute.cid);
                return spn.get("content");
            });

            if (uniqSpn.length > 1) {
                _.each(group, function(item) {
                    var mpn = item.getValueForAttribute(mpnAttribute.id || mpnAttribute.cid);
                    var spn = item.getValueForAttribute(spnAttribute.id || spnAttribute.cid);

                    item.setAlert(BomValidator.MATCH_MPN_SPN, ruleMessage);
                    mpn.setAlert(BomValidator.MATCH_MPN_SPN, ruleMessage);
                    spn.setAlert(BomValidator.MATCH_MPN_SPN, ruleMessage);
                });
            }
            else {
                _.each(group, function(item) {
                    var mpn = item.getValueForAttribute(mpnAttribute.id || mpnAttribute.cid);
                    var spn = item.getValueForAttribute(spnAttribute.id || spnAttribute.cid);

                    item.clearAlert(BomValidator.MATCH_MPN_SPN);
                    mpn.clearAlert(BomValidator.MATCH_MPN_SPN);
                    spn.clearAlert(BomValidator.MATCH_MPN_SPN);
                });
            }
        });
    },

    /**
     * Validate volt units.
     */
    validateVoltUnit: function(item, voltAttribute) {
        if (!voltAttribute) { return; }

        var volt = item.getValueForAttribute(voltAttribute.id || voltAttribute.cid);
        var ruleMessage = voltAttribute.get("name") + " value must use a voltage (e.g. 1 V, 0.5 mV) or a range (e.g. 0.5mV-1V).";
        var parsed;
        var valid1 = true;
        var valid2 = true;
        var unitless1;
        var units = ["V", "Volt", "volt", "Volts", "volts"];
        var unitsPattern = "(?:" + units.join("|") + ")?";
        var valuePattern = "(" + BomValidator.FLOAT_PATTERN + "\\s*(?:" + BomValidator.PREFIXES_PATTERN + ")?" + unitsPattern + ")";
        var separatorPattern = "(\\s*(?:-|to)?\\s*)?";

        if (!volt || volt.get("content") === "") {
            item.clearAlert(BomValidator.VOLT_UNITS);
            if (volt) {
                volt.clearAlert(BomValidator.VOLT_UNITS);
            }
            return;
        }

        parsed = RegExp("^" + valuePattern + separatorPattern + valuePattern + "?$").exec(volt.get("content"));
        if (!parsed) {
            item.setAlert(BomValidator.VOLT_UNITS, ruleMessage);
            volt.setAlert(BomValidator.VOLT_UNITS, ruleMessage);
            return;
        }

        unitless1 = RegExp(BomValidator.FLOAT_PATTERN).test(parsed[1]);
        valid1 = parsed[2] ?
            unitless1 || BomValidator.validateUnits(parsed[1], units) :
            BomValidator.validateUnits(parsed[1], units);

        if (parsed[3]) {
            valid2 = BomValidator.validateUnits(parsed[3], units);

            if (valid1 && valid2) {
                if (unitless1 && parseFloat(parsed[1]) > parseFloat(parsed[3])) {
                    ruleMessage = voltAttribute.get("name") + " range should start with the smaller value.";
                    item.setAlert(BomValidator.VOLT_UNITS, ruleMessage);
                    volt.setAlert(BomValidator.VOLT_UNITS, ruleMessage);
                    return;
                }
            }
        }
        // If second value is not present, but range separator is, then format is wrong
        else if (parsed[2]) {
            valid1 = false;
        }

        if (valid1 && valid2) {
            item.clearAlert(BomValidator.VOLT_UNITS);
            volt.clearAlert(BomValidator.VOLT_UNITS);
        }
        else {
            item.setAlert(BomValidator.VOLT_UNITS, ruleMessage);
            volt.setAlert(BomValidator.VOLT_UNITS, ruleMessage);
        }
    },

    /**
     * Validate units for the item's type.
     */
    validateUnitsForType: function(item, typeAttribute, valueAttribute) {
        if (!typeAttribute || !valueAttribute) { return; }

        var valid = true;
        var ruleMessage;
        var type = item.getValueForAttribute(typeAttribute.id || typeAttribute.cid);
        var value = item.getValueForAttribute(valueAttribute.id || valueAttribute.cid);

        if (!type || !_.isString(type.get("content")) || !value || value.get("content") === "") {
            item.clearAlert(BomValidator.TYPE_UNITS);
            if (value) {
                value.clearAlert(BomValidator.TYPE_UNITS);
            }
            return;
        }

        switch(type.get("content").toLowerCase()) {
            case "resistor":
                ruleMessage = valueAttribute.get("name") + " for type " + type.get("content") + " should use ohms (e.g. 1 ohm, 0.5 Ω).";
                valid = BomValidator.validateUnits(value.get("content"), ["Ohm", "ohm", "Ohms", "ohms", "\u03A9"/*Ω as greek letter*/,"\u2126"/*Ω as ohm sign*/, "R"]);
                break;

            case "capacitor":
                ruleMessage = valueAttribute.get("name") + " should use farads (e.g. 1 mF , 0.5 farad).";
                valid = BomValidator.validateUnits(value.get("content"), ["F", "Farad", "farad", "Farads", "farads"]);
                break;

            case "inductor":
                ruleMessage = valueAttribute.get("name") + " should use henries (e.g. 1 mH , 0.5 henry).";
                valid = BomValidator.validateUnits(value.get("content"), ["H", "Henry", "henry", "Henries", "henries", "Henrys", "henrys"]);
                break;
        }

        if (valid) {
            item.clearAlert(BomValidator.TYPE_UNITS);
            value.clearAlert(BomValidator.TYPE_UNITS);
        }
        else {
            item.setAlert(BomValidator.TYPE_UNITS, ruleMessage);
            value.setAlert(BomValidator.TYPE_UNITS, ruleMessage);
        }
    },

    /**
     * Validate prices.
     *
     * Valid:   1; 200; 3,000; 4.00; 5000,00; 6 000,00; $1.00, 300 RMB
     * Invalid: 1,0000.00; 2.00,; 300 RMB2, 5 $2.00
     */
    validatePrices: function(item, priceAttributes) {
        if (_.isEmpty(priceAttributes)) { return; }

        _.each(priceAttributes, function(attribute) {
            var price = item.getValueForAttribute(attribute.id);
            var ruleId = BomValidator.PRICE + "::" + attribute.id;
            var ruleMessage;

            if (!price || price.get("content") === "") {
                item.clearAlert(ruleId);
                if (price) {
                    price.clearAlert(ruleId);
                }
                return;
            }

            // Allow any number prefixed or suffixed by non-numerical characters
            if (/^[-+]?[^0-9,\.]*([0-9]{1,3}[,\s]([0-9]{3}[,\s])*[0-9]{3}|[0-9]+)([\.,][0-9]+)?[^0-9,\.]*$/.test(price.get("content"))) {
                item.clearAlert(ruleId);
                price.clearAlert(ruleId);
            }
            else {
                ruleMessage = attribute.get("name") + " should be a number prefixed or suffixed by an optional currency.";
                item.setAlert(ruleId, ruleMessage);
                price.setAlert(ruleId, ruleMessage);
            }
        });
    },

    /*
     * Validate ohm units.
     */
    validateUnits: function(value, units) {
        if (!_.isArray(units)) { return false; }

        var unitsPattern = "(" + units.join("|") + ")";
        return RegExp("^" + BomValidator.FLOAT_PATTERN + "\\s*(" + BomValidator.PREFIXES_PATTERN + ")?" + unitsPattern + "$").test(value);
    }
};

module.exports = BomValidator;
