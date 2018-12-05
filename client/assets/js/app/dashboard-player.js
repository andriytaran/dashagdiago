var handleSinglePlayer = (function () {
  "use strict";
  return function handleSinglePlayer(id) {
    if ($("#accordionExample").length !== 0 && $("#basic-player-info").length !== 0) {
      getSinglePlayerData(id, cb);
      function cb(response) {
        window.position = response.player.position;
        const overallPlayerInfo = mapSinglePlayerForOverallInfo(response);
        const data = mapSinglePlayerForBarchart(response);
        drawPlayerInfo(overallPlayerInfo, "#basic-player-info");
        drawOverallBar(response.overallScore.player);
        function checkifnull(datael) {
          if (datael.value === null) { return true; }
          else { return false; }
        }

        if (data.playerAttributes.every(checkifnull)) {
          let elem = document.getElementById("playerAttributesBlock");
          elem.style.display = "none";
        } else {
          drawOverall(
            data.playerAttributes,
            "#accordionExample",
            {id:id},
            getTooltip,
            undefined
          );
        }
      }
    }
  };
})();

function drawOverallBar(scoreval) {
  let scoreboard = document.getElementById("overallscore");
  if (scoreval == null) {
    scoreboard.innerHTML = 'Not Available';
  } else {
    let str = scoreval / 100;
    str = str.toLocaleString(undefined, {
      useGrouping: false,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
      style: "percent"
    });

    scoreboard.innerHTML = str;
  }
}

var Dashboard = (function () {
  "use strict";
  return {
    //main function
    init: function () {
      let urlParams = getUrlParameters();
      handleSinglePlayer(urlParams.id);
    }
  };
})();
