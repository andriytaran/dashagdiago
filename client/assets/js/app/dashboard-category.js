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
      handleCulturalFit(urlParams.category);
      handleCulturalFitTable(urlParams.category);
      handleOverallScoreSection(urlParams.category);
    }
  };
})();
