"use strict";

var keyMirror = require("keymirror");

var ActionConstants = keyMirror({
    // Activity Actions
    LOAD_STREAM:             null,
    UNLOAD_STREAM:           null,

    //BoM actions
    ADD_BOM_ITEM:            null,
    CREATE_BOM:              null,
    DESTROY_BOM:             null,
    EXPORT_BOM_ITEMS:        null,
    RETRY_EXPORT_BOM_ITEMS:  null,
    SET_BOM_COLUMN:          null,
    SET_VISIBLE_BOM_COLUMNS: null,
    UPDATE_BOM:              null,

    //Product actions
    CREATE_PRODUCT:          null,
    UPDATE_PRODUCT_NAME:     null,

    //File actions
    LOAD_FILES: null,
    UNLOAD_FILES: null,

    //Bom View actions
    CREATE_BOM_VIEW:         null,
    UPDATE_BOM_VIEW:         null,
    DESTROY_BOM_VIEW:        null,

    //Tutorial Actions
    DISMISS_HINT:            null,
    COMPLETE_TUTORIAL:       null
});

module.exports = ActionConstants;
