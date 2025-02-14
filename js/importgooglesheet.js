$(document).ready(function () {
    sessionStorage.clear();
    localStorage.clear();

    var loadGoogleBtn = $("#loadGoogleBtn");
    var googleInput = $("#googleInput");
    var googleStatus = $("#googleStatus");

    loadGoogleBtn.on("click", function () {
        var url = $.trim(googleInput.val());
        if (url === "") {
            alert("Please enter a Google Sheet URL");
            return;
        }
        var regex = /\/d\/([a-zA-Z0-9-_]+)/;
        var match = url.match(regex);
        if (match && match[1]) {
            var spreadsheetId = match[1];
            var csvUrl = "https://docs.google.com/spreadsheets/d/" + spreadsheetId +
                "/export?format=csv&id=" + spreadsheetId + "&gid=0";
            console.log("Fetching CSV from:", csvUrl);
            googleStatus.text("Loading...");
            $.get(csvUrl)
                .done(function (csvText) {
                    var rawLines = csvText.split(/\r?\n/);
                    var lines = $.map(rawLines, function (line) {
                        line = $.trim(line);
                        if (line === "") return "";
                        var parts = line.split(",");
                        return $.trim(parts[0]);
                    });
                    var nonEmptyLines = $.grep(lines, function (line) {
                        return line !== "";
                    });
                    var separatorIndex = lines.indexOf("");
                    if (separatorIndex === -1 || separatorIndex === lines.length - 1) {
                        window.otherSongs = nonEmptyLines;
                        window.centerSongs = nonEmptyLines;
                    } else {
                        window.otherSongs = $.grep(lines.slice(0, separatorIndex), function (line) {
                            return line !== "";
                        });
                        window.centerSongs = $.grep(lines.slice(separatorIndex + 1), function (line) {
                            return line !== "";
                        });
                    }
                    console.log("Google Sheet CSV loaded", {
                        otherSongs: window.otherSongs,
                        centerSongs: window.centerSongs
                    });
                    window.goalListLoaded = true;
                    localStorage.setItem("importOtherSongs", JSON.stringify(window.otherSongs));
                    localStorage.setItem("importedCenterSongs", JSON.stringify(window.centerSongs));
                    // sessionStorage.setItem("importOtherSongs", JSON.stringify(window.otherSongs));
                    // sessionStorage.setItem("importedCenterSongs", JSON.stringify(window.centerSongs));
                    googleStatus.text("Load Completed");
                })
                .fail(function (error) {
                    console.error("Failed to load Google Sheet CSV:", error);
                    googleStatus.text("Load Failed");
                });
        } else {
            alert("Could not extract spreadsheet ID. Please check the URL.");
        }
    });
});