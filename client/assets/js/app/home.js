var handleCoreAttributes = (function() {
  "use strict";
  // function getrange(){
  //   if (value < 100 && ftick < 100 && stick < 100){return "[0 - 100]";}
  //   if (value < 1000 && ftick < 1000 && stick < 1000){return "[0 - 1000]";}
  //   if (value < 10000 && ftick < 10000 && stick < 10000){return "[0 - 10000]";}
  // }

  // function getbarvalue(a) {
  //   if (a == "[0 - 100]"){return "percent";}
  //   else {return "number";}
  // }
  function getCoreAttributesData(response) {
    return [
      {
        value: response.coreAttributes.avgCompetitiveness.value,
        ftick: response.programBenchmark.avgCompetitiveness.value,
        stick: response.agdiagoBenchmark.avgCompetitiveness.value,
        name: "Competitiveness",
        range: [0, 100],
        style: "percent",
        fractiondigits: 1
      },
      {
        value: response.coreAttributes.avgMastery.value,
        ftick: response.programBenchmark.avgMastery.value,
        stick: response.agdiagoBenchmark.avgMastery.value,
        name: "Mastery",
        range: [0, 100],
        style: "percent",
        fractiondigits: 1
      },
      {
        value: response.coreAttributes.avgPersistence.value,
        ftick: response.programBenchmark.avgPersistence.value,
        stick: response.agdiagoBenchmark.avgPersistence.value,
        name: "Persistence",
        range: [0, 100],
        style: "percent",
        fractiondigits: 1
      },
      {
        value: response.coreAttributes.avgTeamOrientation.value,
        ftick: response.programBenchmark.avgTeamOrientation.value,
        stick: response.agdiagoBenchmark.avgTeamOrientation.value,
        name: "Team Orientation",
        range: [0, 100],
        style: "percent",
        fractiondigits: 1
      },
      {
        value: response.coreAttributes.avgWorkethic.value,
        ftick: response.programBenchmark.avgWorkethic.value,
        stick: response.agdiagoBenchmark.avgWorkethic.value,
        name: "Work Ethic",
        range: [0, 100],
        style: "percent",
        fractiondigits: 1
      }
    ];
  }

  function getTooltip(label) {
    switch (label) {
      case "Competitiveness":
        return "<h4>Competitiveness</h4><p class='dashboard-tooltip'>Highly competitive football athletes don’t just want to win — they need to win. Contests and matchups drive them to perform with excellence because their performance is clearly measured. These athletes possess a sense of confidence and are passionate about succeeding both on and off the field. They always strive to improve and they thrive on opportunities to put their talents to the test to claim the top prize.</p>";
      case "Mastery":
        return "<h4>Mastery</h4><p class='dashboard-tooltip'>Athletes with a drive for mastery seek to continually build on their knowledge and refine their skills. They are fueled by learning opportunities and seek out information to stay up to date on their understanding of all elements of the game. In addition to using the knowledge they’ve acquired, these athletes assess their opponents to strategize their play on game day. Often, success is a result of their investment in and application of this ongoing learning.</p>";
      case "Persistence":
        return "<h4>Persistence</h4><p class='dashboard-tooltip'>Not everything in football comes easily and some games or plays can be difficult or more complicated than expected. In these situations, success comes from resiliency and an unwillingness to give up. Athletes with persistence persevere in the face of obstacles and do not give up. It’s in their nature to keep working and try harder to overcome adversity in whatever they do. Their natural intensity and resolve allow them to find success.</p>";
      case "Team Orientation":
        return "<h4>Team Orientation</h4><p class='dashboard-tooltip'>Some athletes naturally possess a “team first” mindset, seeking to build collaboration that leads to success. These individuals are often the glue that holds the team together, fostering positive relationships within the group. When there is work to be done, these athletes jump in to help others even when it means going beyond the scope of their own expectations. Seen as dependable, they take ownership for their work and follow through, which builds trust and leads to close relationships with their team members.</p>";
      case "Work Ethic":
        return "<h4>Work Ethic</h4><p class='dashboard-tooltip'>Athletes with strong work ethic create structure in their lives to ensure follow through and success. These individuals are punctual, focused and organized; they often create plans to ensure that they meet attendance and performance expectations. Naturally goal-oriented, they set priorities and tune out distractions to accomplish the objectives. For athletes with work ethic, they believe in getting the work done and doing it right.</p>";
      default:
        return "";
    }
  }

  return function handleCoreAttributes() {
    if ($("#core-attributes").length !== 0) {
      $.post(
        "/api/dashboard-data",
        {
          type: "core_attributes"
        },
        function(response) {
          const data = getCoreAttributesData(response);
          drawbarchart(data, "#core-attributes", getTooltip);
        },
        "json"
      );
    }
  };
})();

var handleAcademicAttributes = (function() {
  "use strict";

  function getAcademicAttributesData(response) {
    return [
      {
        value: response.academic.avgSat.value,
        ftick: response.programBenchmark.avgSat.value,
        stick: response.agdiagoBenchmark.avgSat.value,
        name: "SAT",
        range: [0, 10000],
        style: "number",
        fractiondigits: 0
      },
      {
        value: response.academic.avgAct.value,
        ftick: response.programBenchmark.avgAct.value,
        stick: response.agdiagoBenchmark.avgAct.value,
        name: "ACT",
        range: [0, 100],
        style: "percent",
        fractiondigits: 0
      }
    ];
  }

  function getTooltip(label) {
    switch (label) {
      case "Sat":
        return "<h4>Competitiveness</h4><p class='dashboard-tooltip'>Highly competitive football athletes don’t just want to win — they need to win. Contests and matchups drive them to perform with excellence because their performance is clearly measured. These athletes possess a sense of confidence and are passionate about succeeding both on and off the field. They always strive to improve and they thrive on opportunities to put their talents to the test to claim the top prize.</p>";
      case "Act":
        return "<h4>Mastery</h4><p class='dashboard-tooltip'>Athletes with a drive for mastery seek to continually build on their knowledge and refine their skills. They are fueled by learning opportunities and seek out information to stay up to date on their understanding of all elements of the game. In addition to using the knowledge they’ve acquired, these athletes assess their opponents to strategize their play on game day. Often, success is a result of their investment in and application of this ongoing learning.</p>";
      default:
        return "";
    }
  }

  return function handleAcademicAttributes() {
    if ($("#academic").length !== 0) {
      $.post(
        "/api/dashboard-data",
        {
          type: "academic"
        },
        function(response) {
          const data = getAcademicAttributesData(response);

          drawbarchart(data, "#academic", getTooltip);
        },
        "json"
      );
    }
  };
})();
// var handleModalWindow = (function () {
//   "use strict";

//   return function handleModalWindow() {
//     if ($('#players').length !== 0) {
//         drawtable(playersdata, '#players');
//     }
//   }
// })();
function HandleDropDownAlert(selector) {
  debugger;
  if ($(selector).length !== 0) {
    $(selector).on("click", dropdownalert);
    function dropdownalert() {
      return alert(selector);
    }
  }
}
var handleCulturalFit = (function() {
  "use strict";

  function getCulturalFitData(response) {
    return [
      {
        label: "Low Fit",
        value: response.culturalFit[0].count,
        start: response.culturalFit[0].percentileStart,
        end: response.culturalFit[0].percentileEnd
      },
      {
        label: "Med Fit",
        value: response.culturalFit[1].count,
        start: response.culturalFit[1].percentileStart,
        end: response.culturalFit[1].percentileEnd
      },
      {
        label: "Top Fit",
        value: response.culturalFit[2].count,
        start: response.culturalFit[2].percentileStart,
        end: response.culturalFit[2].percentileEnd
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

  return function handleCulturalFit() {
    if ($("#cultural-fit").length !== 0) {
      $.post(
        "/api/dashboard-data",
        {
          type: "cultural_fit"
        },
        function(response) {
          const data = getCulturalFitData(response);
          drawpiechart(data, "#cultural-fit", getTooltip);
        },
        "json"
      );
    }
  };
})();

var handleDashboardGritterNotification = function() {
  $(window).on("load", function() {
    setTimeout(function() {
      $.gritter.add({
        title: "Welcome back, Admin!",
        text:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempus lacus ut lectus rutrum placerat.",
        image: "../assets/img/user/user-2.jpg",
        sticky: true,
        time: "",
        class_name: "my-sticky-class"
      });
    }, 1000);
  });
};

var Dashboard = (function() {
  "use strict";
  return {
    //main function
    init: function() {
      handleDashboardGritterNotification();
      HandleDropDownAlert("#defensiveLineDE");
      HandleDropDownAlert("#defensiveLineDT");
      HandleDropDownAlert("#defensiveLineOG");
      HandleDropDownAlert("#defensiveLineOT");
      HandleDropDownAlert("#defensiveLineOC");
      HandleDropDownAlert("#defensiveLineOt");
      HandleDropDownAlert("#defensiveLineDB");
      HandleDropDownAlert("#defensiveLineP");
      HandleDropDownAlert("#defensiveLineS");
      HandleDropDownAlert("#defensiveLineLS");
      HandleDropDownAlert("#offensiveLineOG");
      HandleDropDownAlert("#offensiveLineOT");
      HandleDropDownAlert("#offensiveLineOC");
      HandleDropDownAlert("#offensiveLineOt");
      HandleDropDownAlert("#offensiveLineLS");
      HandleDropDownAlert("#runningBacks");
      HandleDropDownAlert("#tightEnds");
      HandleDropDownAlert("#wideReceivers");
      HandleDropDownAlert("#kickingP");
      HandleDropDownAlert("#kickingK");
      HandleDropDownAlert("#defensiveBacksC");
      HandleDropDownAlert("#defensiveBacksB");
      HandleDropDownAlert("#defensiveBacksS");
      HandleDropDownAlert("#quaterBacks");
      HandleDropDownAlert("#ilb");
      HandleDropDownAlert("#olb");
      HandleDropDownAlert("#mlb");
      handleCoreAttributes();
      handleCulturalFit();
      handleAcademicAttributes();
    }
  };
})();
