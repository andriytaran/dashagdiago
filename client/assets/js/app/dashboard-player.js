var handleCoreAttributes = (function () {
  "use strict";
  return function handleCoreAttributes(id) {
    if ($("#core-attributes").length !== 0) {
      getPlayerCoreAttributesData(id, cb);
        function cb (response) {
          const data = mapCoreAttributesForBarChart(response);
          function checkifnull(datael) {
            if (datael.value === null) { return true; }
            else { return false; }
          }
          if (data.every(checkifnull)) {
            let elem = document.getElementById("core-attributes");
            elem.innerHTML = "Not Available";
          } else {
            drawBarChart(
              data,
              "#core-attributes",
              undefined,
              getTooltip,
              undefined,
            );
          }
        }
    }
  };
})();

var handleAcademicAttributes = (function () {
  "use strict";
  return function handleAcademicAttributes(id) {
    if ($("#academic").length !== 0) {
      getPlayerAcademicAttributesData(id, cb);
        function cb (response) {
          const data = mapAcademicAttributesForBarСhart(response);
          function checkifnull(datael) {
            if (datael.value === null) { return true; }
            else { return false; }
          }
          if (data.every(checkifnull)) {
            let elem = document.getElementById("academic");
            elem.innerHTML = "Not Available";
          } else {
            drawBarChart(
              data,
              "#academic",
              undefined,
              getTooltip,
              undefined,
            );
          }
        }
    }
  };
})();

var handleSocialProfileAttributes = (function () {
  "use strict";
  return function handleSocialProfileAttributes(id) {
    if ($("#social-profile").length !== 0) {
      getPlayerSocialProfileAttributesData(id, cb);
        function cb (response) {
          const data = mapSocialProfileAttributesForBarChart(response);
          function checkifnull(datael) {
            if (datael.value === null) { return true; }
            else { return false; }
          }
          if (data.every(checkifnull)) {
            let elem = document.getElementById("social-profile");
            elem.innerHTML = "Not Available";
          } else {
            drawBarChart(
              data,
              "#social-profile",
              undefined,
              getTooltip,
              undefined
            );
          }
        }
    }
  };
})();

var handleEmotionalIntelAttributes = (function () {
  "use strict";
  return function handleEmotionalIntelAttributes(id) {
    if ($("#emotional-intel").length !== 0) {
      getPlayerEmotionalIntelAttributesData(id, cb);
        function cb (response) {
          const data = mapEmotionalIntelAttributesForBarChart(response);
          function checkifnull(datael) {
            if (datael.value === null) { return true; }
            else { return false; }
          }
          if (data.every(checkifnull)) {
            let elem = document.getElementById("emotional-intel");
            elem.innerHTML = "Not Available";
          } else {
            drawBarChart(
              data,
              "#emotional-intel",
              undefined,
              getTooltip,
              undefined
            );
          }
        }
    }
  };
})();

var handleAthleticAttributes = (function () {
  "use strict";
   return function handleAthleticAttributes(id) {
    if ($("#athletic").length !== 0) {
      getPlayerAthleticAttributesData(id, cb);
        function cb (response) {
          const data = mapAthleticAttributesForBarchart(response, window.position);
          function checkifnull(datael) {
            if (datael.value === null) { return true; }
            else { return false; }
          }
          if ((data.every(checkifnull))
          ) {
            let elem = document.getElementById("athletic");
            elem.innerHTML = "Not Available";
          } else {
            drawBarChart(
              data,
              "#athletic",
              undefined,
              getTooltip,
              undefined
            );
          }
        }
    }
  };
})();

var handleSinglePlayer = (function () {
  "use strict";
    return function handleSinglePlayer(id) {
    if ($("#accordionExample").length !== 0 && $("#basic-player-info").length !== 0) {
      getSinglePlayerData(id, cb);
        function cb (response) {
          window.position = response.player.position;

          const data = mapSinglePlayerData(response);
          drawPlayerInfo(data.playerInfo, "#basic-player-info");
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
              id,
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
