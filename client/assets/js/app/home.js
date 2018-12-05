var handleCulturalFit = (function () {
  "use strict";
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
      getCulturalFitData(position, cb);
        function cb (response) {
          const data = mapCulturalFitForPieChart(response);
          drawPieChart(data, "#cultural-fit", position, getTooltip);
        }
      }
  };
})();

var handleCulturalFitTable = (function () {
  "use strict";

  return function handleCulturalFitTable(position) {
    if ($("#culturaltop").length !== 0) {
      getTopCulturalFitData(position, function (response) {
        drawTopCulturals(mapTopCulturalFitForTable(response), "#culturaltop");
      });
    }
  };
})();

function handleOffenseListBlock(){
  const offenseList = document.getElementById("offenseList");
  offenseList.addEventListener("click", function (e) {
    function showmodal() {
      drawloader("#players");
      $("#chartmodal").modal("show");
      getPlayersData({
        position: 'OG',
        attribute: null
      }, function (response) {
        drawTable(response.players, "#players")
      });
    };
    showmodal();
  }, false);
}

function handleDefenseListBlock(){
  const defenseList = document.getElementById("defenseList");
  defenseList.addEventListener("click", function (e) {
    function showmodal() {
      drawloader("#players");
      $("#chartmodal").modal("show");
      getPlayersData({
        position: 'DT',
        attribute: null
      }, function (response) {
        drawTable(response.players, "#players")
      });
    };
    showmodal();
  }, false);
}

function handleFullListBlock(){
  const fullList = document.getElementById("overallList");
  fullList.addEventListener("click", function (e) {
    function showmodal() {
      drawloader("#players");
      $("#chartmodal").modal("show");
      getPlayersData({
        position: null,
        attribute: null
      }, function (response) {
        drawTable(response.players, "#players")
      });
    };
    showmodal();
  }, false);
}

function handleOverallScoreSection(position) {
  const overallScoreSection = new ComponentOverallScoreSection("overallBlock1", {position:position});
  overallScoreSection.mount();
}

var Dashboard = (function () {
  "use strict";
  return {
    //main function
    init: function () {
      let urlParams = getUrlParameters();
      handleCulturalFit();
      handleCulturalFitTable();
      handleOverallScoreSection();
      handleOffenseListBlock();
      handleFullListBlock();
      handleDefenseListBlock();
    }
  };
})();
