function getCulturalPlayersData(position, valueStart, valueEnd, cb) {
  function mapPlayer (player) {
    return {
      fname: player.fname,
      lname: player.lname,
      position: player.position,
      score: player.value,
      id: player.id,
    };
  }

  $.ajax({
    type: "POST",
    url: "/api/dashboard-data",
    data: JSON.stringify({
      type: "players",
      position: position,
      sort: "desc",
      attribute: "athletic",
      between: [valueStart, valueEnd]
    }),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (response) {
      cb(response.players.map(mapPlayer));
    }
  });
}

function getTopCulturalPlayersData(position, cb) {
  function mapPlayer (player, i) {
    return {
      fname: player.fname,
      lname: player.lname,
      position: player.position,
      score: player.value,
      id: player.id,
      rate: i + 1
    };
  }

  $.ajax({
    type: "POST",
    url: "/api/dashboard-data",
    data: JSON.stringify({
      type: "players",
      position: position,
      sort: "desc",
      attribute: "athletic",
      limit: 10
    }),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (response) {
      cb(response.players.map(mapPlayer));
    }
  });
}

var handleCulturalFit = (function () {
  "use strict";

  function getCulturalFitData(response) {
    return [
      {
        label: "Low Fit",
        value: response.groups[0].count,
        start: response.groups[0].percentileStart,
        end: response.groups[0].percentileEnd,
        rangeStart: response.groups[0].rangeStart,
        rangeEnd: response.groups[0].rangeEnd,
      },
      {
        label: "Med Fit",
        value: response.groups[1].count,
        start: response.groups[1].percentileStart,
        end: response.groups[1].percentileEnd,
        rangeStart: response.groups[1].rangeStart,
        rangeEnd: response.groups[1].rangeEnd,
      },
      {
        label: "Top Fit",
        value: response.groups[2].count,
        start: response.groups[2].percentileStart,
        end: response.groups[2].percentileEnd,
        rangeStart: response.groups[2].rangeStart,
        rangeEnd: response.groups[2].rangeEnd,
      }
    ];
  }

  function getTooltip(data) {
    return (
      data.label +
      " (" +
      data.start +
      " - " +
      data.end +
      " percentile)" +
      " = " +
      data.value +
      " players"
    );
  }

  return function handleCulturalFit(position) {
    if ($("#cultural-fit").length !== 0) {
      $.post(
        "/api/dashboard-data",
        {
          type: "percentile_groups",
          position: position,
          attribute: "athletic"
        },
        function (response) {
          const data = getCulturalFitData(response);
          drawPieChart(data, "#cultural-fit", position, getTooltip);
        },
        "json"
      );
    }
  };
})();

var handleCulturalFitTable = (function () {
  "use strict";

  return function handleCulturalFitTable(position) {
    if ($("#culturaltop").length !== 0) {
      getTopCulturalPlayersData(position, function (players) {
        drawTopCulturals(players, "#culturaltop");
      });
    }
  };
})();

var handleCoreAttributes = (function () {
  "use strict";
   return function handleCoreAttributes(position) {
    if ($("#core-attributes").length !== 0) {
      getCoreAttributesData(position, cb);
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
              position,
              getTooltip,
              getPlayersData,
            );
          }
        }
    }
  };
})();

var handleAcademicAttributes = (function () {
  "use strict";
  return function handleAcademicAttributes(position) {
    if ($("#academic").length !== 0) {
      getAcademicAttributesData(position, cb);
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
              position,
              getTooltip,
              getPlayersData,
            );
          }
        }
    }
  };
})();

var handleSocialProfileAttributes = (function () {
  "use strict";
   return function handleSocialProfileAttributes(position) {
    if ($("#social-profile").length !== 0) {
      getSocialProfileAttributesData(position, cb);
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
              position,
              getTooltip,
              getPlayersData
            );
          }
        }
    }
  };
})();

var handleEmotionalIntelAttributes = (function () {
  "use strict";
  return function handleEmotionalIntelAttributes(position) {
    if ($("#emotional-intel").length !== 0) {
      getEmotionalIntelAttributesData(position, cb);
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
              position,
              getTooltip,
              getPlayersData
            );
          }
        }
    }
  };
})();

var handleAthleticAttributes = (function () {
  "use strict";
    return function handleAthleticAttributes(position) {
    if ($("#athletic").length !== 0) {
      getAthleticAttributesData(position, cb);
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
              position,
              getTooltip,
              getPlayersData
            );
          }
        }
    }
  };
})();

var handleDashboardPosition = (function () {
  "use strict";
   return function handleDashboardPosition(position) {
    if ($("#accordionExample").length !== 0) {
      getDashboardAttributesData(position, cb);
        function cb (response) {
          const data = getDashboardData(response);
          function checkifnull(datael) {
            if (datael.value === null) { return true; }
            else { return false; }
          }

          if (data.every(checkifnull)) {
            let elem = document.getElementById("overallBlock1");
            elem.style.display = "none";
          } else {
            drawOverall(
              data,
              "#accordionExample",
              position,
              getTooltip,
              undefined
            );
          }
        }
    }
  };
})();

var Dashboard = (function () {
  "use strict";
  return {
    //main function
    init: function () {
      let urlParams = getUrlParameters();
      handleCulturalFit(urlParams.position);
      handleCulturalFitTable(urlParams.position);
      handleDashboardPosition(urlParams.position);
    }
  };
})();
