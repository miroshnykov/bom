var BomUtils = {
    isFileAPIEnabled: function() {
        return !!window.FileReader;
    },

    readFileAsText: function(file, encoding) {
        encoding = encoding || "utf-8";

        if (!BomUtils.isFileAPIEnabled()) {
            //TODO api call to submit file and wait for response
            return Promise.reject(new Error("File API not found"));
        }

        return new Promise(function(resolve, reject) {
            var reader = new FileReader();

            reader.onload = function(event) {
                resolve(event.target.result);
            };

            reader.onerror = function(event) {
                reject(event.target.error);
            };

            reader.readAsText(file, encoding);
        });
    },

    getUTCDate: function(date) {
        date = date || new Date();

        return date.getUTCFullYear() +
            "-" + ("0" + date.getUTCMonth()).slice(-2) +
            "-" + ("0" + date.getUTCDate()).slice(-2) +
            " " + ("0" + date.getUTCHours()).slice(-2) +
            ":" + ("0" + date.getUTCMinutes()).slice(-2) +
            ":" + ("0" + date.getUTCSeconds()).slice(-2);
    },

    getLocalDate: function(date) {
        date = date || new Date();

        return date.getFullYear() +
            "-" + ("0" + date.getMonth()).slice(-2) +
            "-" + ("0" + date.getDate()).slice(-2) +
            " " + ("0" + date.getHours()).slice(-2) +
            ":" + ("0" + date.getMinutes()).slice(-2) +
            ":" + ("0" + date.getSeconds()).slice(-2);
    }
};

module.exports = BomUtils;
