"use strict";

// Generate stub data
var BomData = {
    lastId: 7,

    // Load Mock Product Data Into localStorage
    init: function() {
        localStorage.setItem("boms", JSON.stringify({
            "count": 7,
            "total": 7,
            "_embedded": {
                "bom": [{
                    id: 1,
                    name: "BoM",
                    _embedded: {
                        bomIds: [2],
                        bomFields: [{
                                id: 1,
                                fieldId: 1,
                                name: "SKU",
                                visible: true
                            }, {
                                id: 2,
                                fieldId: 3,
                                name: "Quantity",
                                visible: true
                            }, {
                                id: 3,
                                fieldId: 4,
                                name: "Description",
                                visible: true
                            }, {
                                id: 4,
                                fieldId: 5,
                                name: "Type",
                                visible: true
                            }, {
                                id: 5,
                                fieldId: 6,
                                name: "Value"
                            }, {
                                id: 6,
                                fieldId: 2,
                                name: "DNI"
                            }, {
                                id: 7,
                                fieldId: 8,
                                name: "Designators",
                                visible: true
                            }, {
                                id: 8,
                                fieldId: 7,
                                name: "Volt"
                            }, {
                                id: 9,
                                fieldId: 13,
                                name: "Tolerance"
                            }, {
                                id: 10,
                                fieldId: 12,
                                name: "Temp. Coeff."
                            }, {
                                id: 11,
                                fieldId: 9,
                                name: "Package"
                            }, {
                                id: 12,
                                fieldId: 10,
                                name: "Mfg"
                            }, {
                                id: 13,
                                fieldId: 11,
                                name: "MPN"
                            }, {
                                id: 14,
                                fieldId: 14,
                                name: "Supplier"
                            }, {
                                id: 15,
                                fieldId: 15,
                                name: "Price"
                            }, {
                                id: 16,
                                fieldId: 16,
                                name: "Leadtime"
                            }, {
                                id: 17,
                                fieldId: 17,
                                name: "MOQ"
                            },
                            //{ id: 18, fieldId: 18, name: "SPN" }
                        ],
                        bomItems: [{
                            "id": 1,
                            "componentId": 1,
                            //"mpn": null,
                            //"spn": null,
                            _embedded: {
                                "bomItemFields": [{
                                    id: 1,
                                    bomFieldId: 2,
                                    value: 2
                                }, {
                                    id: 2,
                                    bomFieldId: 6,
                                    value: false
                                }, {
                                    id: 3,
                                    bomFieldId: 7,
                                    value: "C1, C3, C7, C10, C11, C14"
                                }, {
                                    id: 4,
                                    bomFieldId: 1,
                                    value: "CP000001"
                                }, {
                                    id: 5,
                                    bomFieldId: 3,
                                    value: "Ceramic Capacitor 1uF 25V X5R 10% Tolerance 0603SMT"
                                }, {
                                    id: 6,
                                    bomFieldId: 4,
                                    value: "Capacitor, Ceramic"
                                }, {
                                    id: 7,
                                    bomFieldId: 5,
                                    value: "1uF"
                                }, {
                                    id: 8,
                                    bomFieldId: 8,
                                    value: "25V"
                                }, {
                                    id: 9,
                                    bomFieldId: 9,
                                    value: "10%"
                                }, {
                                    id: 10,
                                    bomFieldId: 10,
                                    value: "X5R"
                                }, {
                                    id: 11,
                                    bomFieldId: 11,
                                    value: "0603"
                                }, {
                                    id: 12,
                                    bomFieldId: 12,
                                    value: "Murata Electronics"
                                }, {
                                    id: 13,
                                    bomFieldId: 13,
                                    value: "xxxx5943"
                                }, {
                                    id: 14,
                                    bomFieldId: 14,
                                    value: "Digikey"
                                }, {
                                    id: 15,
                                    bomFieldId: 15,
                                    value: 0.005
                                }, {
                                    id: 16,
                                    bomFieldId: 16,
                                    value: "4 wks"
                                }, {
                                    id: 17,
                                    bomFieldId: 17,
                                    value: 500
                                }]
                            }
                        }, {
                            "id": 2,
                            "componentId": 2,
                            _embedded: {
                                "bomItemFields": [{
                                        id: 18,
                                        bomFieldId: 2,
                                        value: 1
                                    }, {
                                        id: 19,
                                        bomFieldId: 6,
                                        value: false
                                    }, {
                                        id: 20,
                                        bomFieldId: 3,
                                        value: "Just a part."
                                    }, {
                                        id: 21,
                                        bomFieldId: 12,
                                        value: "Yageo"
                                    }, {
                                        id: 22,
                                        bomFieldId: 14,
                                        value: "Digikey"
                                    },
                                    //{ id: 23, bomFieldId: 18, value: "yyy34992" },
                                    {
                                        id: 24,
                                        bomFieldId: 15,
                                        value: 0.008
                                    }, {
                                        id: 25,
                                        bomFieldId: 16,
                                        value: "3 wks"
                                    }, {
                                        id: 26,
                                        bomFieldId: 17,
                                        value: 600
                                    }
                                ]
                            }
                        }, {
                            "id": 3,
                            "componentId": 3
                        }]
                    },
                }, {
                    id: 2,
                    name: "PCB #1",
                    _embedded: {
                        bomFields: [{
                            id: 19,
                            fieldId: 1,
                            name: "SKU"
                        }, {
                            id: 20,
                            fieldId: 3,
                            name: "Quantity"
                        }, {
                            id: 21,
                            fieldId: 4,
                            name: "Description"
                        }, {
                            id: 22,
                            fieldId: 5,
                            name: "Type"
                        }, {
                            id: 23,
                            fieldId: 6,
                            name: "Value"
                        }],
                        bomItems: [{
                            "id": 8,
                            "componentId": 7,
                            "_embedded": {
                                "bomItemFields": [{
                                    id: 27,
                                    bomFieldId: 21,
                                    value: "Some item description."
                                }]
                            }
                        }]
                    }
                }, {
                    id: 3,
                    name: "BoM",
                    _embedded: {
                        bomIds: [4, 5],
                        bomFields: [{
                            id: 24,
                            fieldId: 1,
                            name: "SKU"
                        }, {
                            id: 25,
                            fieldId: 3,
                            name: "Quantity"
                        }, {
                            id: 26,
                            fieldId: 4,
                            name: "Description"
                        }, {
                            id: 27,
                            fieldId: 5,
                            name: "Type"
                        }, {
                            id: 28,
                            fieldId: 6,
                            name: "Value"
                        }],
                        bomItems: [{
                            "id": 4,
                            "componentId": 4,
                        }, {
                            "id": 5,
                            "componentId": 5,
                        }, {
                            "id": 6,
                            "componentId": 6,
                        }, ]
                    }
                }, {
                    id: 4,
                    name: "Main PCB",
                    _embedded: {
                        fields: ["sku", "quantity", "description", "type", "value", "volt"],
                        bomFields: [{
                            id: 29,
                            fieldId: 1,
                            name: "SKU"
                        }, {
                            id: 30,
                            fieldId: 3,
                            name: "Quantity"
                        }, {
                            id: 31,
                            fieldId: 4,
                            name: "Description"
                        }, {
                            id: 32,
                            fieldId: 5,
                            name: "Type"
                        }, {
                            id: 33,
                            fieldId: 6,
                            name: "Value"
                        }, {
                            id: 34,
                            fieldId: 7,
                            name: "Volt"
                        }, ],
                        bomItems: [{
                            "id": 7,
                            "componentId": 7,
                        }]
                    }
                }, {
                    id: 5,
                    name: "Daughter PCB",
                    _embedded: {
                        bomFields: [{
                            id: 35,
                            fieldId: 1,
                            name: "SKU"
                        }, {
                            id: 36,
                            fieldId: 3,
                            name: "Quantity"
                        }, {
                            id: 37,
                            fieldId: 4,
                            name: "Description"
                        }, {
                            id: 38,
                            fieldId: 5,
                            name: "Type"
                        }, {
                            id: 39,
                            fieldId: 6,
                            name: "Value"
                        }, {
                            id: 40,
                            fieldId: 8,
                            name: "Designators"
                        }, ],
                        bomItems: []
                    }
                }, {
                    id: 6,
                    name: "BoM",
                    _embedded: {
                        bomFields: [{
                            id: 41,
                            fieldId: 1,
                            name: "SKU"
                        }, {
                            id: 42,
                            fieldId: 3,
                            name: "Quantity"
                        }, {
                            id: 43,
                            fieldId: 4,
                            name: "Description"
                        }, {
                            id: 44,
                            fieldId: 5,
                            name: "Type"
                        }, {
                            id: 45,
                            fieldId: 6,
                            name: "Value"
                        }],
                        bomItems: []
                    }
                }]
            }
        }));
    }
};

// Mock jQuery requests
// $.mockjax({
//     url: new RegExp("^" + ApiConstants.PATH_PREFIX + "\/[0-9]+\/bom$"),
//     type: "POST",
//     //status: 500,
//     responseTime: 0,
//     response: function(settings) {
//         var data = JSON.parse(settings.data);
//         this.responseText = _.extend({
//             id: ++BomData.lastId
//         }, data);
//     }
// });

// $.mockjax({
//     url: new RegExp("^" + ApiConstants.PATH_PREFIX + "\/[0-9]+\/bom$"),
//     type: "GET",
//     responseTime: 0,
//     responseText: JSON.parse(localStorage.getItem("boms"))
// });

// $.mockjax({
//     url: new RegExp("^" + ApiConstants.PATH_PREFIX + "/[0-9]+/bom/*$"),
//     type: "PUT",
//     //status: 500,
//     responseTime: 0,
//     response: function(settings) {
//         var data = JSON.parse(settings.data);
//         this.responseText = data;
//     }
// });

// $.mockjax({
//     url: new RegExp("^" + ApiConstants.PATH_PREFIX + "/[0-9]+/bom/*$"),
//     type: "DELETE",
//     responseText: {}
// });

module.exports = BomData;
