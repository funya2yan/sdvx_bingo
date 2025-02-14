$(document).ready(function () {
    sessionStorage.clear();
    localStorage.clear();

    var fileInput = $("#csvFileInput");
    var selectFileBtn = $("#selectFileBtn");
    var selectedFileNameSpan = $("#selectedFileName");

    selectFileBtn.on("click", function () {
        fileInput.click();
    });

    fileInput.on("change", function () {
        var file = this.files[0];
        if (!file) {
            selectedFileNameSpan.text("");
            return;
        }
        selectedFileNameSpan.text(file.name);
        var reader = new FileReader();
        reader.onload = function (evt) {
            parseCSVAndStore(evt.target.result, file.name);
        };
        reader.onerror = function (err) {
            console.error("Error reading CSV file:", err);
        };
        reader.readAsText(file);
    });

    function parseCSVAndStore(csvText, fileName) {
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
        console.log("CSV loaded", {
            otherSongs: window.otherSongs,
            centerSongs: window.centerSongs
        });
        window.goalListLoaded = true;
        localStorage.setItem("importOtherSongs", JSON.stringify(window.otherSongs));
        localStorage.setItem("importedCenterSongs", JSON.stringify(window.centerSongs));
        if (window.otherSongs.length >= 24 && window.centerSongs.length >= 1) {
            selectedFileNameSpan.text(fileName + " (Import Completed)");
        } else {
            selectedFileNameSpan.text(fileName);
        }
    }
});