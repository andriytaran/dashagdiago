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
        value: response.coreAttributes.coreAttributesCompetitiveness.value,
        ftick: response.programBenchmark.coreAttributesCompetitiveness.value,
        stick: response.agdiagoBenchmark.coreAttributesCompetitiveness.value,
        name: "Competitiveness",
        field: "coreAttributesCompetitiveness",
        range: [0, 100],
        style: "percent",
        fractiondigits: 1
      },
      {
        value: response.coreAttributes.coreAttributesMastery.value,
        ftick: response.programBenchmark.coreAttributesMastery.value,
        stick: response.agdiagoBenchmark.coreAttributesMastery.value,
        name: "Mastery",
        field: "coreAttributesMastery",
        range: [0, 100],
        style: "percent",
        fractiondigits: 1
      },
      {
        value: response.coreAttributes.coreAttributesPersistence.value,
        ftick: response.programBenchmark.coreAttributesPersistence.value,
        stick: response.agdiagoBenchmark.coreAttributesPersistence.value,
        name: "Persistence",
        field: "coreAttributesPersistence",
        range: [0, 100],
        style: "percent",
        fractiondigits: 1
      },
      {
        value: response.coreAttributes.coreAttributesTeamOrientation.value,
        ftick: response.programBenchmark.coreAttributesTeamOrientation.value,
        stick: response.agdiagoBenchmark.coreAttributesTeamOrientation.value,
        name: "Team Orientation",
        field: "coreAttributesTeamOrientation",
        range: [0, 100],
        style: "percent",
        fractiondigits: 1
      },
      {
        value: response.coreAttributes.coreAttributesWorkethic.value,
        ftick: response.programBenchmark.coreAttributesWorkethic.value,
        stick: response.agdiagoBenchmark.coreAttributesWorkethic.value,
        name: "Work Ethic",
        field: "coreAttributesWorkethic",
        range: [0, 100],
        style: "percent",
        fractiondigits: 1
      }
    ];
  }

  function getTooltip(label) {
    switch (label) {
      case "coreAttributesCompetitiveness":
        return "<h4>Competitiveness</h4><p class='dashboard-tooltip'>Highly competitive football athletes don’t just want to win — they need to win. Contests and matchups drive them to perform with excellence because their performance is clearly measured. These athletes possess a sense of confidence and are passionate about succeeding both on and off the field. They always strive to improve and they thrive on opportunities to put their talents to the test to claim the top prize.</p>";
      case "coreAttributesMastery":
        return "<h4>Mastery</h4><p class='dashboard-tooltip'>Athletes with a drive for mastery seek to continually build on their knowledge and refine their skills. They are fueled by learning opportunities and seek out information to stay up to date on their understanding of all elements of the game. In addition to using the knowledge they’ve acquired, these athletes assess their opponents to strategize their play on game day. Often, success is a result of their investment in and application of this ongoing learning.</p>";
      case "coreAttributesPersistence":
        return "<h4>Persistence</h4><p class='dashboard-tooltip'>Not everything in football comes easily and some games or plays can be difficult or more complicated than expected. In these situations, success comes from resiliency and an unwillingness to give up. Athletes with persistence persevere in the face of obstacles and do not give up. It’s in their nature to keep working and try harder to overcome adversity in whatever they do. Their natural intensity and resolve allow them to find success.</p>";
      case "coreAttributesTeamOrientation":
        return "<h4>Team Orientation</h4><p class='dashboard-tooltip'>Some athletes naturally possess a “team first” mindset, seeking to build collaboration that leads to success. These individuals are often the glue that holds the team together, fostering positive relationships within the group. When there is work to be done, these athletes jump in to help others even when it means going beyond the scope of their own expectations. Seen as dependable, they take ownership for their work and follow through, which builds trust and leads to close relationships with their team members.</p>";
      case "coreAttributesWorkethic":
        return "<h4>Work Ethic</h4><p class='dashboard-tooltip'>Athletes with strong work ethic create structure in their lives to ensure follow through and success. These individuals are punctual, focused and organized; they often create plans to ensure that they meet attendance and performance expectations. Naturally goal-oriented, they set priorities and tune out distractions to accomplish the objectives. For athletes with work ethic, they believe in getting the work done and doing it right.</p>";
      default:
        return "";
    }
  }

  return function handleCoreAttributes(position) {
    if ($("#core-attributes").length !== 0) {
      $.post(
        "/api/dashboard-data",
        {
          type: "core_attributes",
          playerPosition: position
        },
        function(response) {
          if (
            response.coreAttributes.coreAttributesCompetitiveness.value == null &&
            response.coreAttributes.coreAttributesMastery.value == null &&
            response.coreAttributes.coreAttributesWorkethic.value == null &&
            response.coreAttributes.coreAttributesTeamOrientation.value == null &&
            response.coreAttributes.coreAttributesPersistence.value == null
          ) {
            let elem = document.getElementById("coreAttributesBlock");
            elem.style.display = "none";
          } else {
            const data = getCoreAttributesData(response);
            drawbarchart(
              data,
              "#core-attributes",
              position,
              getTooltip,
              getPlayersData
            );
          }
        },
        "json"
      );
    }
  };
})();

function getPlayersData(position, field, cb) {
  $.post(
    "/api/dashboard-data",
    {
      type: "players_data",
      playerPosition: position,
      field: field
    },
    function(response) {
      cb(response.players);
    },
    "json"
  );
}

var handleAcademicAttributes = (function() {
  "use strict";

  function getAcademicAttributesData(response) {
    return [
      {
        value: response.academic.sat.value,
        ftick: response.programBenchmark.sat.value,
        stick: response.agdiagoBenchmark.sat.value,
        name: "SAT",
        field: "sat",
        range: [0, 10000],
        style: "number",
        fractiondigits: 0
      },
      {
        value: response.academic.act.value,
        ftick: response.programBenchmark.act.value,
        stick: response.agdiagoBenchmark.act.value,
        name: "ACT",
        field: "act",
        range: [0, 100],
        style: "number",
        fractiondigits: 0
      }
    ];
  }

  function getTooltip(field) {
    switch (field) {
      case "sat":
        return "<h4>Competitiveness</h4><p class='dashboard-tooltip'>Highly competitive football athletes don’t just want to win — they need to win. Contests and matchups drive them to perform with excellence because their performance is clearly measured. These athletes possess a sense of confidence and are passionate about succeeding both on and off the field. They always strive to improve and they thrive on opportunities to put their talents to the test to claim the top prize.</p>";
      case "act":
        return "<h4>Mastery</h4><p class='dashboard-tooltip'>Athletes with a drive for mastery seek to continually build on their knowledge and refine their skills. They are fueled by learning opportunities and seek out information to stay up to date on their understanding of all elements of the game. In addition to using the knowledge they’ve acquired, these athletes assess their opponents to strategize their play on game day. Often, success is a result of their investment in and application of this ongoing learning.</p>";
      default:
        return "";
    }
  }

  return function handleAcademicAttributes(position) {
    if ($("#academic").length !== 0) {
      $.post(
        "/api/dashboard-data",
        {
          type: "academic",
          playerPosition: position
        },
        function(response) {
          const data = getAcademicAttributesData(response);
          if (
            response.academic.act.value == null &&
            response.academic.sat.value == null
          ) {
            let elem = document.getElementById("academicBlock");
            elem.style.display = "none";
          } else {
            drawbarchart(
              data,
              "#academic",
              position,
              getTooltip,
              getPlayersData
            );
          }
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
// function HandleDropDownAlert(selector) {
//   if ($(selector).length !== 0) {
//     // $(selector).on("click", dropdowncont);
//     // function dropdowncont() {
//     //   return alert(selector);
//     // }
//   }
// }
var handleSocialProfileAttributes = (function() {
  "use strict";

  function getSocialProfileAttributesData(response) {
    return [
      {
        value: response.socialProfile.facebookSentiment.value,
        ftick: response.programBenchmark.facebookSentiment.value,
        stick: response.agdiagoBenchmark.facebookSentiment.value,
        name: "Facebook Sentiment",
        field: "facebookSentiment",
        range: [0, 10],
        style: "number",
        fractiondigits: 1
      },
      {
        value: response.socialProfile.instagramFollowers.value,
        ftick: response.programBenchmark.instagramFollowers.value,
        stick: response.agdiagoBenchmark.instagramFollowers.value,
        name: "Instagram Followers",
        field: "instagramFollowers",
        range: [0, 10],
        style: "number",
        fractiondigits: 1
      },
      {
        value: response.socialProfile.newsMedaiCoveragementions.value,
        ftick: response.programBenchmark.newsMedaiCoveragementions.value,
        stick: response.agdiagoBenchmark.newsMedaiCoveragementions.value,
        name: "News Medai Coverage mentions",
        field: "newsMedaiCoveragementions",
        range: [0, 10],
        style: "number",
        fractiondigits: 1
      },
      {
        value: response.socialProfile.newsMediaCoverageRegional.value,
        ftick: response.programBenchmark.newsMediaCoverageRegional.value,
        stick: response.agdiagoBenchmark.newsMediaCoverageRegional.value,
        name: "News Media Coverage Regional",
        field: "newsMediaCoverageRegional",
        range: [0, 10],
        style: "number",
        fractiondigits: 1
      },
      {
        value: response.socialProfile.newsMediaCoverageSentiment.value,
        ftick: response.programBenchmark.newsMediaCoverageSentiment.value,
        stick: response.agdiagoBenchmark.newsMediaCoverageSentiment.value,
        name: "News Media Coverage Sentiment",
        field: "newsMediaCoverageSentiment",
        range: [0, 10],
        style: "number",
        fractiondigits: 1
      },
      {
        value: response.socialProfile.newsMediacoverageNational.value,
        ftick: response.programBenchmark.newsMediacoverageNational.value,
        stick: response.agdiagoBenchmark.newsMediacoverageNational.value,
        name: "News Media coverage National",
        field: "newsMediacoverageNational",
        range: [0, 10],
        style: "number",
        fractiondigits: 1
      },
      {
        value: response.socialProfile.pressReleaseSentiment.value,
        ftick: response.programBenchmark.pressReleaseSentiment.value,
        stick: response.agdiagoBenchmark.pressReleaseSentiment.value,
        name: "Press Release Sentiment",
        field: "pressReleaseSentiment",
        range: [0, 10],
        style: "number",
        fractiondigits: 1
      },
      {
        value: response.socialProfile.pressReleaseSentimentCounter.value,
        ftick: response.programBenchmark.pressReleaseSentimentCounter.value,
        stick: response.agdiagoBenchmark.pressReleaseSentimentCounter.value,
        name: "Press Release Sentiment Counter",
        field: "pressReleaseSentimentCounter",
        range: [0, 10],
        style: "number",
        fractiondigits: 1
      },
      {
        value: response.socialProfile.socialInstagramSentiment.value,
        ftick: response.programBenchmark.socialInstagramSentiment.value,
        stick: response.agdiagoBenchmark.socialInstagramSentiment.value,
        name: "Social Instagram Sentiment",
        field: "socialInstagramSentiment",
        range: [0, 10],
        style: "number",
        fractiondigits: 1
      },
      {
        value: response.socialProfile.socialTwitterSentiment.value,
        ftick: response.programBenchmark.socialTwitterSentiment.value,
        stick: response.agdiagoBenchmark.socialTwitterSentiment.value,
        name: "Social Twitter Sentiment",
        field: "socialTwitterSentiment",
        range: [0, 10],
        style: "number",
        fractiondigits: 1
      },
      {
        value: response.socialProfile.twitterFollowers.value,
        ftick: response.programBenchmark.twitterFollowers.value,
        stick: response.agdiagoBenchmark.twitterFollowers.value,
        name: "Twitter Followers",
        field: "twitterFollowers",
        range: [0, 10],
        style: "number",
        fractiondigits: 1
      }
    ];
  }

  function getTooltip(field) {
    switch (field) {
      case "facebookSentiment":
        return "<h4>Competitiveness</h4><p class='dashboard-tooltip'>Highly competitive football athletes don’t just want to win — they need to win. Contests and matchups drive them to perform with excellence because their performance is clearly measured. These athletes possess a sense of confidence and are passionate about succeeding both on and off the field. They always strive to improve and they thrive on opportunities to put their talents to the test to claim the top prize.</p>";
      case "instagramFollowers":
        return "<h4>Competitiveness</h4><p class='dashboard-tooltip'>Highly competitive football athletes don’t just want to win — they need to win. Contests and matchups drive them to perform with excellence because their performance is clearly measured. These athletes possess a sense of confidence and are passionate about succeeding both on and off the field. They always strive to improve and they thrive on opportunities to put their talents to the test to claim the top prize.</p>";
      case "newsMedaiCoveragementions":
        return "<h4>Competitiveness</h4><p class='dashboard-tooltip'>Highly competitive football athletes don’t just want to win — they need to win. Contests and matchups drive them to perform with excellence because their performance is clearly measured. These athletes possess a sense of confidence and are passionate about succeeding both on and off the field. They always strive to improve and they thrive on opportunities to put their talents to the test to claim the top prize.</p>";
      case "newsMediaCoverageRegional":
        return "<h4>Competitiveness</h4><p class='dashboard-tooltip'>Highly competitive football athletes don’t just want to win — they need to win. Contests and matchups drive them to perform with excellence because their performance is clearly measured. These athletes possess a sense of confidence and are passionate about succeeding both on and off the field. They always strive to improve and they thrive on opportunities to put their talents to the test to claim the top prize.</p>";
      case "newsMediaCoverageSentiment":
        return "<h4>Competitiveness</h4><p class='dashboard-tooltip'>Highly competitive football athletes don’t just want to win — they need to win. Contests and matchups drive them to perform with excellence because their performance is clearly measured. These athletes possess a sense of confidence and are passionate about succeeding both on and off the field. They always strive to improve and they thrive on opportunities to put their talents to the test to claim the top prize.</p>";
      case "pressReleaseSentiment":
        return "<h4>Competitiveness</h4><p class='dashboard-tooltip'>Highly competitive football athletes don’t just want to win — they need to win. Contests and matchups drive them to perform with excellence because their performance is clearly measured. These athletes possess a sense of confidence and are passionate about succeeding both on and off the field. They always strive to improve and they thrive on opportunities to put their talents to the test to claim the top prize.</p>";
      case "pressReleaseSentimentCounter":
        return "<h4>Competitiveness</h4><p class='dashboard-tooltip'>Highly competitive football athletes don’t just want to win — they need to win. Contests and matchups drive them to perform with excellence because their performance is clearly measured. These athletes possess a sense of confidence and are passionate about succeeding both on and off the field. They always strive to improve and they thrive on opportunities to put their talents to the test to claim the top prize.</p>";
      case "socialInstagramSentiment":
        return "<h4>Competitiveness</h4><p class='dashboard-tooltip'>Highly competitive football athletes don’t just want to win — they need to win. Contests and matchups drive them to perform with excellence because their performance is clearly measured. These athletes possess a sense of confidence and are passionate about succeeding both on and off the field. They always strive to improve and they thrive on opportunities to put their talents to the test to claim the top prize.</p>";
      case "socialTwitterSentiment":
        return "<h4>Competitiveness</h4><p class='dashboard-tooltip'>Highly competitive football athletes don’t just want to win — they need to win. Contests and matchups drive them to perform with excellence because their performance is clearly measured. These athletes possess a sense of confidence and are passionate about succeeding both on and off the field. They always strive to improve and they thrive on opportunities to put their talents to the test to claim the top prize.</p>";
      case "twitterFollowers":
        return "<h4>Mastery</h4><p class='dashboard-tooltip'>Athletes with a drive for mastery seek to continually build on their knowledge and refine their skills. They are fueled by learning opportunities and seek out information to stay up to date on their understanding of all elements of the game. In addition to using the knowledge they’ve acquired, these athletes assess their opponents to strategize their play on game day. Often, success is a result of their investment in and application of this ongoing learning.</p>";
      default:
        return "";
    }
  }

  return function handleSocialProfileAttributes(position) {
    if ($("#social-profile").length !== 0) {
      $.post(
        "/api/dashboard-data",
        {
          type: "social_profile",
          playerPosition: position
        },
        function(response) {
          const data = getSocialProfileAttributesData(response);
          if (
            response.socialProfile.facebookSentiment.value == null &&
            response.socialProfile.instagramFollowers.value == null &&
            response.socialProfile.newsMedaiCoveragementions.value == null &&
            response.socialProfile.newsMediaCoverageRegional.value == null &&
            response.socialProfile.newsMediaCoverageSentiment.value == null &&
            response.socialProfile.newsMediacoverageNational.value == null &&
            response.socialProfile.pressReleaseSentiment.value == null &&
            response.socialProfile.pressReleaseSentimentCounter.value == null &&
            response.socialProfile.socialInstagramSentiment.value == null &&
            response.socialProfile.socialTwitterSentiment.value == null &&
            response.socialProfile.twitterFollowers.value == null
          ) {
            let elem = document.getElementById("socialProfileBlock");
            elem.style.display = "none";
          } else {
            drawbarchart(
              data,
              "#social-profile",
              position,
              getTooltip,
              getPlayersData
            );
          }
        },
        "json"
      );
    }
  };
})();

var handleEmotionalIntelAttributes = (function() {
  "use strict";

  function getEmotionalIntelAttributesData(response) {
    debugger;
    return [
      {
        value: response.emotionalIntel.emotionalIntelAccountability.value,
        ftick: response.programBenchmark.emotionalIntelAccountability.value,
        stick: response.agdiagoBenchmark.emotionalIntelAccountability.value,
        name: "Emotional Intel Accountability",
        field: "emotionalIntelAccountability",
        range: [0, 100],
        style: "number",
        fractiondigits: 0
      },
      {
        value: response.emotionalIntel.emotionalIntelBehavior.value,
        ftick: response.programBenchmark.emotionalIntelBehavior.value,
        stick: response.agdiagoBenchmark.emotionalIntelBehavior.value,
        name: "Emotional Intel Behavior",
        field: "emotionalIntelBehavior",
        range: [0, 100],
        style: "number",
        fractiondigits: 0
      },
      {
        value: response.emotionalIntel.emotionalIntelIndependence.value,
        ftick: response.programBenchmark.emotionalIntelIndependence.value,
        stick: response.agdiagoBenchmark.emotionalIntelIndependence.value,
        name: "Eotional Intel Independence",
        field: "emotionalIntelIndependence",
        range: [0, 100],
        style: "number",
        fractiondigits: 0
      },
      {
        value: response.emotionalIntel.emotionalIntelReflection.value,
        ftick: response.programBenchmark.emotionalIntelReflection.value,
        stick: response.agdiagoBenchmark.emotionalIntelReflection.value,
        name: "Emotional Intel Reflection",
        field: "emotionalIntelReflection",
        range: [0, 100],
        style: "number",
        fractiondigits: 0
      },
      {
        value: response.emotionalIntel.emotionalIntelRelationships.value,
        ftick: response.programBenchmark.emotionalIntelRelationships.value,
        stick: response.agdiagoBenchmark.emotionalIntelRelationships.value,
        name: "Emotional Intel Relationships",
        field: "emotionalIntelRelationships",
        range: [0, 100],
        style: "number",
        fractiondigits: 0
      },
      {
        value: response.emotionalIntel.emotionalIntelResponsibility.value,
        ftick: response.programBenchmark.emotionalIntelResponsibility.value,
        stick: response.agdiagoBenchmark.emotionalIntelResponsibility.value,
        name: "Emotional Intel Responsibility",
        field: "emotionalIntelResponsibility",
        range: [0, 100],
        style: "number",
        fractiondigits: 0
      },
      {
        value: response.emotionalIntel.emotionalIntelteamWork.value,
        ftick: response.programBenchmark.emotionalIntelteamWork.value,
        stick: response.agdiagoBenchmark.emotionalIntelteamWork.value,
        name: "Emotional Intel teamWork",
        field: "emotionalIntelteamWork",
        range: [0, 100],
        style: "number",
        fractiondigits: 0
      }
    ];
  }

  function getTooltip(field) {
    switch (field) {
      case "emotionalIntelAccountability":
        return "<h4>Competitiveness</h4><p class='dashboard-tooltip'>Highly competitive football athletes don’t just want to win — they need to win. Contests and matchups drive them to perform with excellence because their performance is clearly measured. These athletes possess a sense of confidence and are passionate about succeeding both on and off the field. They always strive to improve and they thrive on opportunities to put their talents to the test to claim the top prize.</p>";
      case "emotionalIntelBehavior":
        return "<h4>Competitiveness</h4><p class='dashboard-tooltip'>Highly competitive football athletes don’t just want to win — they need to win. Contests and matchups drive them to perform with excellence because their performance is clearly measured. These athletes possess a sense of confidence and are passionate about succeeding both on and off the field. They always strive to improve and they thrive on opportunities to put their talents to the test to claim the top prize.</p>";
      case "emotionalIntelIndependence":
        return "<h4>Competitiveness</h4><p class='dashboard-tooltip'>Highly competitive football athletes don’t just want to win — they need to win. Contests and matchups drive them to perform with excellence because their performance is clearly measured. These athletes possess a sense of confidence and are passionate about succeeding both on and off the field. They always strive to improve and they thrive on opportunities to put their talents to the test to claim the top prize.</p>";
      case "emotionalIntelReflection":
        return "<h4>Competitiveness</h4><p class='dashboard-tooltip'>Highly competitive football athletes don’t just want to win — they need to win. Contests and matchups drive them to perform with excellence because their performance is clearly measured. These athletes possess a sense of confidence and are passionate about succeeding both on and off the field. They always strive to improve and they thrive on opportunities to put their talents to the test to claim the top prize.</p>";
      case "emotionalIntelRelationships":
        return "<h4>Competitiveness</h4><p class='dashboard-tooltip'>Highly competitive football athletes don’t just want to win — they need to win. Contests and matchups drive them to perform with excellence because their performance is clearly measured. These athletes possess a sense of confidence and are passionate about succeeding both on and off the field. They always strive to improve and they thrive on opportunities to put their talents to the test to claim the top prize.</p>";
      case "emotionalIntelResponsibility":
        return "<h4>Competitiveness</h4><p class='dashboard-tooltip'>Highly competitive football athletes don’t just want to win — they need to win. Contests and matchups drive them to perform with excellence because their performance is clearly measured. These athletes possess a sense of confidence and are passionate about succeeding both on and off the field. They always strive to improve and they thrive on opportunities to put their talents to the test to claim the top prize.</p>";
      case "emotionalIntelteamWork":
        return "<h4>Mastery</h4><p class='dashboard-tooltip'>Athletes with a drive for mastery seek to continually build on their knowledge and refine their skills. They are fueled by learning opportunities and seek out information to stay up to date on their understanding of all elements of the game. In addition to using the knowledge they’ve acquired, these athletes assess their opponents to strategize their play on game day. Often, success is a result of their investment in and application of this ongoing learning.</p>";
      default:
        return "";
    }
  }

  return function handleEmotionalIntelAttributes(position) {
    if ($("#emotional-intel").length !== 0) {
      $.post(
        "/api/dashboard-data",
        {
          type: "emotional_intel",
          playerPosition: position
        },
        function(response) {
          const data = getEmotionalIntelAttributesData(response);
          if (
            response.emotionalIntel.emotionalIntelAccountability.value == null &&
            response.emotionalIntel.emotionalIntelBehavior.value == null &&
            response.emotionalIntel.emotionalIntelIndependence.value == null &&
            response.emotionalIntel.emotionalIntelReflection.value == null &&
            response.emotionalIntel.emotionalIntelRelationships.value == null &&
            response.emotionalIntel.emotionalIntelResponsibility.value == null &&
            response.emotionalIntel.emotionalIntelteamWork.value == null
          ) {
            let elem = document.getElementById("emotionalIntelBlock");
            elem.style.display = "none";
          } else {
            drawbarchart(
              data,
              "#emotional-intel",
              position,
              getTooltip,
              getPlayersData
            );
          }
        },
        "json"
      );
    }
  };
})();

var handleAthleticAttributes = (function() {
  "use strict";

  function getAthleticAttributesData(response, playerPosition) {
    function getForty() {
      return {
        value: response.athletic.forty.value,
        ftick: response.programBenchmark.forty.value,
        stick: response.agdiagoBenchmark.forty.value,
        name: "Forty",
        field: "forty",
        range: [0, 100],
        style: "number",
        fractiondigits: 0
      };
    }
    function getGamesPlayed() {
      return {
        value: response.athletic.gamesPlayed.value,
        ftick: response.programBenchmark.gamesPlayed.value,
        stick: response.agdiagoBenchmark.gamesPlayed.value,
        name: "Games Played",
        field: "gamesPlayed",
        range: [0, 100],
        style: "number",
        fractiondigits: 0
      };
    }
    function getGamesStarted() {
      return {
        value: response.athletic.gamesStarted.value,
        ftick: response.programBenchmark.gamesStarted.value,
        stick: response.agdiagoBenchmark.gamesStarted.value,
        name: "Games Started",
        field: "gamesStarted",
        range: [0, 100],
        style: "number",
        fractiondigits: 0
      };
    }
    function getHeight() {
      return {
        value: response.athletic.height.value,
        ftick: response.programBenchmark.height.value,
        stick: response.agdiagoBenchmark.height.value,
        name: "Height",
        field: "height",
        range: [0, 100],
        style: "number",
        fractiondigits: 0
      };
    }
    function getVertical() {
      return {
        value: response.athletic.vertical.value,
        ftick: response.programBenchmark.vertical.value,
        stick: response.agdiagoBenchmark.vertical.value,
        name: "Vertical",
        field: "vertical",
        range: [0, 100],
        style: "number",
        fractiondigits: 0
      };
    }
    function getWeight() {
      return {
        value: response.athletic.weight.value,
        ftick: response.programBenchmark.weight.value,
        stick: response.agdiagoBenchmark.weight.value,
        name: "Weight",
        field: "weight",
        range: [0, 1000],
        style: "number",
        fractiondigits: 0
      };
    }
    return [
      getForty(),
      getGamesPlayed(),
      getGamesStarted(),
      getHeight(),
      getVertical(),
      getWeight()
    ];
  }

  function getTooltip(label) {
    switch (label) {
      case "forty":
        return "<h4>Competitiveness</h4><p class='dashboard-tooltip'>Highly competitive football athletes don’t just want to win — they need to win. Contests and matchups drive them to perform with excellence because their performance is clearly measured. These athletes possess a sense of confidence and are passionate about succeeding both on and off the field. They always strive to improve and they thrive on opportunities to put their talents to the test to claim the top prize.</p>";
      case "gamesPlayed":
        return "<h4>Mastery</h4><p class='dashboard-tooltip'>Athletes with a drive for mastery seek to continually build on their knowledge and refine their skills. They are fueled by learning opportunities and seek out information to stay up to date on their understanding of all elements of the game. In addition to using the knowledge they’ve acquired, these athletes assess their opponents to strategize their play on game day. Often, success is a result of their investment in and application of this ongoing learning.</p>";
      case "gamesStarted":
        return "<h4>Mastery</h4><p class='dashboard-tooltip'>Athletes with a drive for mastery seek to continually build on their knowledge and refine their skills. They are fueled by learning opportunities and seek out information to stay up to date on their understanding of all elements of the game. In addition to using the knowledge they’ve acquired, these athletes assess their opponents to strategize their play on game day. Often, success is a result of their investment in and application of this ongoing learning.</p>";
      case "height":
        return "<h4>Mastery</h4><p class='dashboard-tooltip'>Athletes with a drive for mastery seek to continually build on their knowledge and refine their skills. They are fueled by learning opportunities and seek out information to stay up to date on their understanding of all elements of the game. In addition to using the knowledge they’ve acquired, these athletes assess their opponents to strategize their play on game day. Often, success is a result of their investment in and application of this ongoing learning.</p>";
      case "vertical":
        return "<h4>Mastery</h4><p class='dashboard-tooltip'>Athletes with a drive for mastery seek to continually build on their knowledge and refine their skills. They are fueled by learning opportunities and seek out information to stay up to date on their understanding of all elements of the game. In addition to using the knowledge they’ve acquired, these athletes assess their opponents to strategize their play on game day. Often, success is a result of their investment in and application of this ongoing learning.</p>";
      case "weight":
        return "<h4>Mastery</h4><p class='dashboard-tooltip'>Athletes with a drive for mastery seek to continually build on their knowledge and refine their skills. They are fueled by learning opportunities and seek out information to stay up to date on their understanding of all elements of the game. In addition to using the knowledge they’ve acquired, these athletes assess their opponents to strategize their play on game day. Often, success is a result of their investment in and application of this ongoing learning.</p>";
      default:
        return "";
    }
  }

  return function handleAthleticAttributes(position) {
    if ($("#athletic").length !== 0) {
      $.post(
        "/api/dashboard-data",
        {
          type: "athletic",
          playerPosition: position
        },
        function(response) {
          const data = getAthleticAttributesData(response, position);
          if (
            response.athletic.forty.value == null &&
            response.athletic.gamesPlayed.value == null &&
            response.athletic.gamesStarted.value == null &&
            response.athletic.height.value == null &&
            response.athletic.vertical.value == null &&
            response.athletic.weight.value == null
          ) {
            let elem = document.getElementById("athleticBlock");
            elem.style.display = "none";
          } else {
            drawbarchart(
              data,
              "#athletic",
              position,
              getTooltip,
              getPlayersData
            );
          }
        },
        "json"
      );
    }
  };
})();

function getUrlParameters(data) {
  let res = {};
  let urlParams = new URLSearchParams(window.location.search);
  let myParam = urlParams.get("position");
  if (myParam == null) {
    res.position = undefined;
    return res;
  } else {
    res.position = myParam.toUpperCase();
    return res;
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

  return function handleCulturalFit(position) {
    if ($("#cultural-fit").length !== 0) {
      $.post(
        "/api/dashboard-data",
        {
          type: "cultural_fit",
          playerPosition: position
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
      // HandleDropDownAlert("#defensiveLineDE");
      // HandleDropDownAlert("#defensiveLineDT");
      // HandleDropDownAlert("#defensiveLineOG");
      // HandleDropDownAlert("#defensiveLineOT");
      // HandleDropDownAlert("#defensiveLineOC");
      // HandleDropDownAlert("#defensiveLineOt");
      // HandleDropDownAlert("#defensiveLineDB");
      // HandleDropDownAlert("#defensiveLineP");
      // HandleDropDownAlert("#defensiveLineS");
      // HandleDropDownAlert("#defensiveLineLS");
      // HandleDropDownAlert("#offensiveLineOG");
      // HandleDropDownAlert("#offensiveLineOT");
      // HandleDropDownAlert("#offensiveLineOC");
      // HandleDropDownAlert("#offensiveLineOt");
      // HandleDropDownAlert("#offensiveLineLS");
      // HandleDropDownAlert("#runningBacks");
      // HandleDropDownAlert("#tightEnds");
      // HandleDropDownAlert("#wideReceivers");
      // HandleDropDownAlert("#kickingP");
      // HandleDropDownAlert("#kickingK");
      // HandleDropDownAlert("#defensiveBacksC");
      // HandleDropDownAlert("#defensiveBacksB");
      // HandleDropDownAlert("#defensiveBacksS");
      // HandleDropDownAlert("#quaterBacks");
      // HandleDropDownAlert("#ilb");
      // HandleDropDownAlert("#olb");
      // HandleDropDownAlert("#mlb");
      getUrlParameters();
      let urlParams = getUrlParameters();
      handleSocialProfileAttributes(urlParams.position);
      handleEmotionalIntelAttributes(urlParams.position);
      handleCoreAttributes(urlParams.position);
      handleAthleticAttributes(urlParams.position);
      handleCulturalFit(urlParams.position);
      handleAcademicAttributes(urlParams.position);
    }
  };
})();
