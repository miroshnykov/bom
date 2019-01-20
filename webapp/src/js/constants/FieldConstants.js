"use strict";

module.exports = {
    //default fields
    SKU: 1,
    ID: 2,
    QUANTITY: 3,
    DESCRIPTION: 4,
    TYPE: 5,
    VALUE: 6,
    VOLT: 7,
    TOLERANCE: 8,
    TEMP_COEFF: 9,
    PACKAGE: 10,
    DESIGNATORS: 11,
    MFG: 12,
    MPN: 13,
    SUPPLIER: 14,
    SPN: 15,
    PRICE: 16,
    MOQ: 17,
    LEAD_TIME: 18,
    LINK: 19,
    ROHS: 20,

    //extra columns, not visible by default, but available
    SMT: 21,
    DNI: 22,
    BUILD_OPTION: 23,
    SIDE: 24,
    CATEGORY: 25,
    COMMENT: 26,
    AVL_NOTES: 27,
    TOTAL_PRICE: 28,

    // TODO rename fieldset to view
    CUSTOM_FIELDSET: "_custom_view",
    FULL_FIELDSET: 1,
    SIMPLE_FIELDSET: 2,
    SOURCING_FIELDSET: 3,
    ASSEMBLY_FIELDSET: 4,

    CUSTOM_FIELD: {
        id: "_custom",
        name: "New Attribute",
        type: undefined
    },

    SELECT_FIELD: {
        id: "_select",
        name: "Select an attribute",
        type: undefined
    }
};
