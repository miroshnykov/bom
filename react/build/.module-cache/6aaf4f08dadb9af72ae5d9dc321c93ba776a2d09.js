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

    CUSTOM_FIELDSET: 1,
    FULL_FIELDSET: 2,
    SIMPLE_FIELDSET: 3,
    SOURCING_FIELDSET: 4,
    ASSEMBLY_FIELDSET: 5,

    //TODO update field ids to use constants
    FIELDSETS: [
        {
            id: 2,
            name: "Full View",
            fieldIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
        },
        {
            id: 3,
            name: "Simple View",
            fieldIds: [1, 2, 3, 4]
        },
        {
            id: 4,
            name: "Sourcing View",
            fieldIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18]
        },
        {
            id: 5,
            name: "Assembly View",
            fieldIds: [1, 2, 3, 4, 5, 6, 10, 11, 12, 13]
        }
    ],

    CUSTOM_FIELD: {
        id: "_custom",
        name: "New Column",
        type: undefined
    },

    SELECT_FIELD: {
        id: "_select",
        name: "Select an attribute",
        type: undefined
    },
};
