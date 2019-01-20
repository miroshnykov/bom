var keyMirror = require("keymirror");

var ActionConstants = keyMirror({
    //BoM actions
    FETCH_ALL_BOMS: null,
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

    //Component actions
    FETCH_ALL_COMPONENTS: null,

    //Field actions
    FETCH_ALL_FIELDS: null,

    //Product actions
    FETCH_ALL_PRODUCTS: null,
    CREATE_PRODUCT: null,
    DESTROY_PRODUCT: null,
    UPDATE_PRODUCT_NAME: null,

    //Change actions
    FETCH_ALL_CHANGES: null,
    SYNC_CHANGES: null,

    //Type actions
    FETCH_ALL_FIELDTYPES: null,

    //User actions
    FETCH_USER: null,
    UPDATE_USER: null,
    VALIDATE_USER: null,

    //Company actions
    SELECT_COMPANY: null,

    //Bom View actions
    FETCH_ALL_BOM_VIEWS: null,
    CREATE_BOM_VIEW: null,
    UPDATE_BOM_VIEW: null,
    DESTROY_BOM_VIEW: null
});

module.exports = ActionConstants;
