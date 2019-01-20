"use strict";

var keyMirror = require("keymirror");

var ActionConstants = keyMirror({
    //BoM actions
    FETCH_BOM: null,
    CREATE_BOM: null,
    UPDATE_BOM_NAME: null,
    DESTROY_BOM: null,
    ADD_BOM_ITEM: null,
    REMOVE_BOM_ITEMS: null,
    UPDATE_BOM_ITEM: null,
    SELECT_BOM_ITEM: null,
    UNSELECT_BOM_ITEMS: null,
    ADD_BOM_COLUMN: null,
    SET_BOM_COLUMN: null,
    SET_VISIBLE_BOM_COLUMNS: null,
    HIDE_BOM_COLUMN: null,
    IMPORT_BOM_FILE: null,
    IMPORT_PRODUCT: null,
    IMPORT_NEW_BOM: null,
    IMPORT_UPDATE_BOM: null,
    EXPORT_BOM_ITEMS: null,
    RETRY_EXPORT_BOM_ITEMS: null,
    FETCH_BOM_ITEM_COMMENTS: null,
    CREATE_BOM_ITEM_COMMENT: null,
    UPDATE_BOM_ITEM_COMMENT: null,
    DESTROY_BOM_ITEM_COMMENT: null,
    FETCH_BOM_COMMENTS: null,
    CREATE_BOM_COMMENT: null,
    UPDATE_BOM_COMMENT: null,
    DESTROY_BOM_COMMENT: null,

    //Product actions
    CREATE_PRODUCT: null,
    DESTROY_PRODUCT: null,
    UPDATE_PRODUCT_NAME: null,
    FETCH_PRODUCT_COMMENTS: null,
    CREATE_PRODUCT_COMMENT: null,
    UPDATE_PRODUCT_COMMENT: null,
    DESTROY_PRODUCT_COMMENT: null,

    //Change actions
    SYNC_CHANGES: null,
    FETCH_PRODUCT_CHANGES: null,
    FETCH_BOM_CHANGES: null,
    FETCH_ITEM_CHANGES: null,

    //User actions
    INIT_USER: null,
    UPDATE_USER: null,
    VALIDATE_USER: null,

    //Company actions
    SELECT_COMPANY: null,

    //Bom View actions
    CREATE_BOM_VIEW: null,
    UPDATE_BOM_VIEW: null,
    DESTROY_BOM_VIEW: null
});

module.exports = ActionConstants;
