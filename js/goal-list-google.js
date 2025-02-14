(function () {
    function getQueryParams() {
        var params = {};
        var search = window.location.search.substring(1);
        if (search) {
            search.split('&').forEach(function (part) {
                var item = part.split('=');
                params[decodeURIComponent(item[0])] = decodeURIComponent(item[1]);
            });
        }
        return params;
    }
    var params = getQueryParams();

    var spreadsheetId = params.google;
    if (!spreadsheetId) {
        console.error("No spreadsheet ID provided in query parameters.");
        window.otherSongs = [];
        window.centerSongs = [];
        window.goalListLoaded = true;
        return;
    }

    var gid = "0";
    var csvUrl = "https://docs.google.com/spreadsheets/d/" + spreadsheetId + "/export?format=csv&id=" + spreadsheetId + "&gid=" + gid;
    console.log("Fetching CSV from:", csvUrl);

    fetch(csvUrl)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Network response was not ok: " + response.statusText);
            }
            return response.text();
        })
        .then(function (csvText) {
            var rawLines = csvText.split(/\r?\n/);
            var lines = rawLines.map(function (line) {
                line = line.trim();
                if (line === "") return "";
                var parts = line.split(',');
                return parts[0].trim();
            });

            var nonEmptyLines = lines.filter(function (line) {
                return line !== "";
            });
            var separatorIndex = lines.findIndex(function (line) {
                return line === "";
            });

            if (separatorIndex === -1 || separatorIndex === lines.length - 1) {
                window.otherSongs = nonEmptyLines;
                window.centerSongs = nonEmptyLines;
            } else {
                window.otherSongs = lines.slice(0, separatorIndex).filter(function (line) {
                    return line !== "";
                });
                window.centerSongs = lines.slice(separatorIndex + 1).filter(function (line) {
                    return line !== "";
                });
            }
            console.log("Google Sheet CSV loaded", {
                otherSongs: window.otherSongs,
                centerSongs: window.centerSongs
            });
            window.goalListLoaded = true;
            if (typeof displayLists === "function") {
                displayLists();
            }
        })
        .catch(function (error) {
            console.error("Failed to load Google Sheet CSV:", error);
            window.otherSongs = [];
            window.centerSongs = [];
            window.goalListLoaded = true;
        });
})();