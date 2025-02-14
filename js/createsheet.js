$(document).ready(function () {

  function shuffleArray(array) {
    var arr = array.slice();
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }

  function generateRandomSeed() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  function isValidSeed(seed) {
    return /^[0-9]+$/.test(seed);
  }

  function generateBingoSheet(boardSize, seed) {
    if (seed) {
      (Math.seedrandom || window.seedrandom)(seed);
    }
    var sheet = [];
    if (!window.otherSongs || !window.centerSongs || !window.goalListLoaded) {
      console.error("Goal list data is not loaded yet.");
      return null;
    }
    if (boardSize === 5) {
      if (window.otherSongs.length < 24) {
        console.error("[outside the center] Insufficient number of items on goal list");
        return null;
      }
      if (window.centerSongs.length < 1) {
        console.error("[center] Insufficient number of items on goal list");
        return null;
      }
      var selectedOtherSongs = shuffleArray(window.otherSongs).slice(0, 24);
      var selectedCenterSong = shuffleArray(window.centerSongs)[0];
      var songIndex = 0;
      for (var row = 0; row < 5; row++) {
        sheet[row] = [];
        for (var col = 0; col < 5; col++) {
          if (row === 2 && col === 2) {
            sheet[row][col] = selectedCenterSong;
          } else {
            sheet[row][col] = selectedOtherSongs[songIndex];
            songIndex++;
          }
        }
      }
    } else if (boardSize === 4) {
      if (window.otherSongs.length < 16) {
        console.error("Insufficient number of items on goal list");
        return null;
      }
      var selectedSongs = shuffleArray(window.otherSongs).slice(0, 16);
      var songIndex = 0;
      for (var row = 0; row < 4; row++) {
        sheet[row] = [];
        for (var col = 0; col < 4; col++) {
          sheet[row][col] = selectedSongs[songIndex];
          songIndex++;
        }
      }
    } else {
      console.error("Invalid card size");
      return null;
    }
    return sheet;
  }

  function renderBingoSheet(sheet, boardSize, seed) {
    var $container = $("#sheetContainer");
    $container.empty();
    var $grid = $("<div>")
      .addClass("bingo-sheet")
      .css("grid-template-columns", "repeat(" + boardSize + ", 1fr)");
    for (var row = 0; row < sheet.length; row++) {
      for (var col = 0; col < sheet[row].length; col++) {
        var $cell = $("<div>").addClass("bingo-cell black").text(sheet[row][col]);
        $cell.on("click", function () {
          if ($(this).hasClass("red")) {
            $(this).removeClass("red").addClass("black");
          } else {
            $(this).removeClass("black green").addClass("red");
          }
        });
        $cell.on("contextmenu", function (e) {
          e.preventDefault();
          if ($(this).hasClass("green")) {
            $(this).removeClass("green").addClass("black");
          } else {
            $(this).removeClass("black red").addClass("green");
          }
        });
        $grid.append($cell);
      }
    }
    $container.append($grid);

    var $info = $("<div>")
      .addClass("sheet-info")
      .html("size：<span class='info-size'>" + boardSize + "x" + boardSize +
        "</span>　seed：<span class='info-seed'>" + seed + "</span>");
    $container.append($info);

    // 既存のスクリーンショットコンテナがあれば削除
    $("#screenshotContainer").remove();

    // 動的にスクリーンショットボタンのコンテナを生成し、#sheetContainerの直後に配置
    var $screenshotContainer = $("<div>")
      .attr("id", "screenshotContainer")
      .css({
        "text-align": "left",
        "margin-top": "12px"
      });
    var $screenshotBtn = $("<button>")
      .attr("id", "screenshotBtn")
      .text("Take a screenshot");
    $screenshotContainer.append($screenshotBtn);
    $("#sheetContainer").after($screenshotContainer);

    $screenshotBtn.on("click", function () {
      html2canvas(document.getElementById('sheetContainer')).then(function (canvas) {
        var dataUrl = canvas.toDataURL("image/png");
        var now = new Date();
        var iso = now.toISOString(); // e.g., "2023-07-25T14:30:45.123Z"
        var datePart = iso.split('T')[0].split('-'); // ["2023", "07", "25"]
        var timePart = iso.split('T')[1].split('.')[0].split(':'); // ["14", "30", "45"]
        var timestamp = datePart[0].slice(-2) + datePart[1] + datePart[2] + "_" + timePart.join('');
        var filename = timestamp + "_sdvx_bingo.png";

        var link = document.createElement('a');
        link.href = dataUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    });
  }


  function validateSeedInput() {
    var val = $.trim($("#seedInput").val());
    $("#generateBtn").prop("disabled", !(val.length > 0 && isValidSeed(val)));
  }

  $("#seedInput").on("input", validateSeedInput);

  function getQueryParams() {
    var params = {};
    var search = window.location.search.substring(1);
    if (search) {
      $.each(search.split('&'), function (i, part) {
        var item = part.split('=');
        params[decodeURIComponent(item[0])] = item.length > 1 ? decodeURIComponent(item[1]) : "";
      });
    }
    return params;
  }

  $(window).on("load", function () {
    var params = getQueryParams();
    var boardSize = params.size ? parseInt(params.size, 10) : 5;
    if (params.seed) {
      var seed = params.seed;
      if (isValidSeed(seed)) {
        $("#seedInput").val(seed);
        var sheet = generateBingoSheet(boardSize, seed);
        if (sheet) {
          renderBingoSheet(sheet, boardSize, seed);
          $("#controls").hide();
          $("#sheetContainer").show();
        }
      } else {
        console.error("Invalid seed in query parameters.");
      }
    } else {
      $("#sheetContainer").hide();
    }
    validateSeedInput();
  });

  $("#generateSeedBtn").on("click", function () {
    var seed = generateRandomSeed();
    $("#seedInput").val(seed);
    validateSeedInput();
  });

  $("#generateBtn").on("click", function () {
    var boardSizeValue = $("#boardSize").val();
    var boardSize = parseInt(boardSizeValue, 10);
    var seed = $.trim($("#seedInput").val());
    var sheet = generateBingoSheet(boardSize, seed);
    if (sheet) {
      renderBingoSheet(sheet, boardSize, seed);
      $("#sheetContainer").show();
      $("#generateSeedBtn").prop("disabled", true);
      $("#generateBtn").prop("disabled", true);
      $("#resetBtn").prop("disabled", false);
    }
  });

  $("#resetBtn").on("click", function () {
    $("#seedInput").val("");
    validateSeedInput();
    $("#sheetContainer").hide().empty(); // シート内容を空にして非表示
    $("#screenshotContainer").remove(); // スクリーンショットボタンコンテナを削除
    $("#generateSeedBtn").prop("disabled", false);
    $("#generateBtn").prop("disabled", true);
    $("#resetBtn").prop("disabled", true);
  });

});