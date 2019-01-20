"use strict";

var keyMirror = require("keymirror");

var ChangeConstants = keyMirror({
    NUMBER: null,
    BOM_ID: null,
    BOM_NAME: null,
    ITEM_ID: null,
    ITEM_SKU: null,
    CHANGED_BY: null,
    DETAILS: null,
    DATE: null,
    STATUS: null
});

module.exports = ChangeConstants;
