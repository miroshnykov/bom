var BomUtils = require("../utils/BomUtils");
var BabyParse = require("babyparse");

var BomImporter = {
    detectCSV: function(content) {
        var options = {};
        var preview;

        // Parse preview to get value of first row
        preview = BabyParse.parse(content, _.extend({}, options, {preview: 1, header: true}));

        // Clean up fields
        // Because of bug in parsing library that adds an empty field if last character is delimiter
        headers = _.clone(preview.meta.fields);
        if (_.last(headers) === "") {
            headers.pop();
        }

        // Check that headers are all string and not empty
        options.header = (headers.length > 0) && _.every(headers, function(result) {
            return isNaN(result);
        });

        // Get the autodetected delimiter
        options.delimiter = preview.meta.delimiter;

        return options;
    },

    detectCSVFromFile: function(file) {
        return BomUtils.readFileAsText(file).then(function(result) {
            return this.detectCSV(result);
        }.bind(this));
    },

    import: function(content, options) {
        var firstline;
        var preview;
        var results;

        options = options || {};

        // Skip empty line by default
        if (options.skipEmptyLines === undefined) {
            options.skipEmptyLines = true;
        }

        return BabyParse.parse(content, options);
    },

  //   import: function(body, options) {
  //   var lines;
  //   var columns;
  //   var cleanLines;
  //   var cleanColumns;
  //   var emptyCol;
  //   var bom;

  //   lines = body.match(/[^\r\n]+/g);
  //   if (!lines.length) {
  //     throw(new Error("Empty file."));
  //   }

  //   //TODO assume we have column headers for now, detect later
  //   //TODO assume ; separators (Eagle), need to ask or auto-detect later
  //   columns = lines.shift().split(";");

  //   //remove end double quotes if any
  //   columns = columns.map(function(result) {
  //     if (result.charAt(0) === '"' && result.charAt(result.length-1) === '"') {
  //       return result.substr(1, result.length-2).trim();
  //     }
  //     else {
  //       return result;
  //     }
  //   });

  //   //parse the items
  //   lines = lines.map(function(result) {
  //     var line = result.split(";");
  //     line = line.map(function(result) {
  //       if (result.charAt(0) === '"' && result.charAt(result.length-1) === '"') {
  //         return result.substr(1, result.length-2).trim();
  //       }
  //       else {
  //         return result;
  //       }
  //     });
  //     return line;
  //   });

  //   //clean up empty lines
  //   lines = lines.filter(function(result) {
  //     for (var key in result) {
  //       if (result[key]) {
  //         return true;
  //       }
  //     }
  //     return false;
  //   });

  //   //clean up empty columns
  //   cleanColumns = [];
  //   cleanLines = lines.map(function(result) { return []; });

  //   for (var colKey in columns) {
  //     emptyCol = !columns[colKey];

  //     //if the header is empty, check if the values are empty too
  //     if (emptyCol) {
  //       for (var lineKey in lines) {
  //         if (lines[lineKey][colKey]) {
  //           emptyCol = false;
  //           break;
  //         }
  //       }
  //     }

  //     //if the column header is empty
  //     if (!emptyCol) {
  //       cleanColumns.push(columns[colKey]);
  //       for (var lineKey in lines) {
  //         cleanLines[lineKey].push( lines[lineKey][colKey] );
  //       }
  //     }
  //   }

  //   //TODO
  //   //make sure that items have a value for each column

  //   bom = {
  //     attributes: cleanColumns,
  //     items: cleanLines
  //   };

  //   return bom;
  // }
};

module.exports = BomImporter;
