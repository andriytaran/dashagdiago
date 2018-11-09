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
        range: getDataRange(response.coreAttributes.coreAttributesCompetitiveness.value,
          response.programBenchmark.coreAttributesCompetitiveness.value,
          response.agdiagoBenchmark.coreAttributesCompetitiveness.value
        ),
        style: "percent",
        fractiondigits: 1
      },
      {
        value: response.coreAttributes.coreAttributesMastery.value,
        ftick: response.programBenchmark.coreAttributesMastery.value,
        stick: response.agdiagoBenchmark.coreAttributesMastery.value,
        name: "Mastery",
        field: "coreAttributesMastery",
        range: getDataRange(
          response.coreAttributes.coreAttributesMastery.value,
          response.programBenchmark.coreAttributesMastery.value,
          response.agdiagoBenchmark.coreAttributesMastery.value
        ),
        style: "percent",
        fractiondigits: 1
      },
      {
        value: response.coreAttributes.coreAttributesPersistence.value,
        ftick: response.programBenchmark.coreAttributesPersistence.value,
        stick: response.agdiagoBenchmark.coreAttributesPersistence.value,
        name: "Persistence",
        field: "coreAttributesPersistence",
        range: getDataRange(response.coreAttributes.coreAttributesPersistence.value,
          response.programBenchmark.coreAttributesPersistence.value,
          response.agdiagoBenchmark.coreAttributesPersistence.value
        ),
        style: "percent",
        fractiondigits: 1
      },
      {
        value: response.coreAttributes.coreAttributesTeamOrientation.value,
        ftick: response.programBenchmark.coreAttributesTeamOrientation.value,
        stick: response.agdiagoBenchmark.coreAttributesTeamOrientation.value,
        name: "Team Orientation",
        field: "coreAttributesTeamOrientation",
        range: getDataRange(response.coreAttributes.coreAttributesTeamOrientation.value,
          response.programBenchmark.coreAttributesTeamOrientation.value,
          response.agdiagoBenchmark.coreAttributesTeamOrientation.value
        ),
        style: "percent",
        fractiondigits: 1
      },
      {
        value: response.coreAttributes.coreAttributesWorkethic.value,
        ftick: response.programBenchmark.coreAttributesWorkethic.value,
        stick: response.agdiagoBenchmark.coreAttributesWorkethic.value,
        name: "Work Ethic",
        field: "coreAttributesWorkethic",
        range: getDataRange(response.coreAttributes.coreAttributesWorkethic.value,
          response.programBenchmark.coreAttributesWorkethic.value,
          response.agdiagoBenchmark.coreAttributesWorkethic.value
        ),
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
          const data = getCoreAttributesData(response);
          function checkifnull(datael){
            if (datael.value === null){return true;}
            else{return false;}
          }
          if (data.every(checkifnull))
           {
            let elem = document.getElementById("coreAttributesBlock");
            elem.style.display = "none";
          } else {
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
        range: getDataRange(response.academic.sat.value,
          response.programBenchmark.sat.value,
          response.agdiagoBenchmark.sat.value
        ),
        style: "number",
        fractiondigits: 0
      },
      {
        value: response.academic.coreGpa.value,
        ftick: response.programBenchmark.coreGpa.value,
        stick: response.agdiagoBenchmark.coreGpa.value,
        name: "Core GPA",
        field: "coreGpa",
        range: getDataRange(response.academic.coreGpa.value,
          response.programBenchmark.coreGpa.value,
          response.agdiagoBenchmark.coreGpa.value
        ),
        style: "number",
        fractiondigits: 1
      },
      {
        value: response.academic.gpa.value,
        ftick: response.programBenchmark.gpa.value,
        stick: response.agdiagoBenchmark.gpa.value,
        name: "GPA",
        field: "gpa",
        range: getDataRange(response.academic.gpa.value,
          response.programBenchmark.gpa.value,
          response.agdiagoBenchmark.gpa.value
        ),
        style: "number",
        fractiondigits: 1
      },
      {
        value: response.academic.act.value,
        ftick: response.programBenchmark.act.value,
        stick: response.agdiagoBenchmark.act.value,
        name: "ACT",
        field: "act",
        range: getDataRange(response.academic.act.value,
          response.programBenchmark.act.value,
          response.agdiagoBenchmark.act.value
        ),
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
          function checkifnull(datael){
            if (datael.value === null){return true;}
            else{return false;}
          }
          if (data.every(checkifnull))
           {
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
        range: getDataRange(response.socialProfile.facebookSentiment.value,
          response.programBenchmark.facebookSentiment.value,
          response.agdiagoBenchmark.facebookSentiment.value
        ),
        style: "number",
        fractiondigits: 1
      },
      {
        value: response.socialProfile.instagramFollowers.value,
        ftick: response.programBenchmark.instagramFollowers.value,
        stick: response.agdiagoBenchmark.instagramFollowers.value,
        name: "Instagram Followers",
        field: "instagramFollowers",
        range: getDataRange(response.socialProfile.instagramFollowers.value,
          response.programBenchmark.instagramFollowers.value,
          response.agdiagoBenchmark.instagramFollowers.value
        ),
        style: "number",
        fractiondigits: 1
      },
      {
        value: response.socialProfile.newsMedaiCoveragementions.value,
        ftick: response.programBenchmark.newsMedaiCoveragementions.value,
        stick: response.agdiagoBenchmark.newsMedaiCoveragementions.value,
        name: "News Medai Coverage mentions",
        field: "newsMedaiCoveragementions",
        range: getDataRange(response.socialProfile.newsMedaiCoveragementions.value,
          response.programBenchmark.newsMedaiCoveragementions.value,
          response.agdiagoBenchmark.newsMedaiCoveragementions.value
        ),
        style: "number",
        fractiondigits: 1
      },
      {
        value: response.socialProfile.newsMediaCoverageRegional.value,
        ftick: response.programBenchmark.newsMediaCoverageRegional.value,
        stick: response.agdiagoBenchmark.newsMediaCoverageRegional.value,
        name: "News Media Coverage Regional",
        field: "newsMediaCoverageRegional",
        range: getDataRange(response.socialProfile.newsMediaCoverageRegional.value,
          response.programBenchmark.newsMediaCoverageRegional.value,
          response.agdiagoBenchmark.newsMediaCoverageRegional.value
        ),
        style: "number",
        fractiondigits: 1
      },
      {
        value: response.socialProfile.newsMediaCoverageSentiment.value,
        ftick: response.programBenchmark.newsMediaCoverageSentiment.value,
        stick: response.agdiagoBenchmark.newsMediaCoverageSentiment.value,
        name: "News Media Coverage Sentiment",
        field: "newsMediaCoverageSentiment",
        range: getDataRange(response.socialProfile.newsMediaCoverageSentiment.value,
          response.programBenchmark.newsMediaCoverageSentiment.value,
          response.agdiagoBenchmark.newsMediaCoverageSentiment.value
        ),
        style: "number",
        fractiondigits: 1
      },
      {
        value: response.socialProfile.newsMediacoverageNational.value,
        ftick: response.programBenchmark.newsMediacoverageNational.value,
        stick: response.agdiagoBenchmark.newsMediacoverageNational.value,
        name: "News Media coverage National",
        field: "newsMediacoverageNational",
        range: getDataRange(response.socialProfile.newsMediacoverageNational.value,
          response.programBenchmark.newsMediacoverageNational.value,
          response.agdiagoBenchmark.newsMediacoverageNational.value
        ),
        style: "number",
        fractiondigits: 1
      },
      {
        value: response.socialProfile.pressReleaseSentiment.value,
        ftick: response.programBenchmark.pressReleaseSentiment.value,
        stick: response.agdiagoBenchmark.pressReleaseSentiment.value,
        name: "Press Release Sentiment",
        field: "pressReleaseSentiment",
        range: getDataRange(
          response.socialProfile.pressReleaseSentiment.value,
          response.programBenchmark.pressReleaseSentiment.value,
          response.agdiagoBenchmark.pressReleaseSentiment.value
        ),
        style: "number",
        fractiondigits: 1
      },
      {
        value: response.socialProfile.pressReleaseSentimentCounter.value,
        ftick: response.programBenchmark.pressReleaseSentimentCounter.value,
        stick: response.agdiagoBenchmark.pressReleaseSentimentCounter.value,
        name: "Press Release Sentiment Counter",
        field: "pressReleaseSentimentCounter",
        range: getDataRange(
          response.socialProfile.pressReleaseSentimentCounter.value,
          response.programBenchmark.pressReleaseSentimentCounter.value,
          response.agdiagoBenchmark.pressReleaseSentimentCounter.value,
        ),
        style: "number",
        fractiondigits: 1
      },
      {
        value: response.socialProfile.socialInstagramSentiment.value,
        ftick: response.programBenchmark.socialInstagramSentiment.value,
        stick: response.agdiagoBenchmark.socialInstagramSentiment.value,
        name: "Social Instagram Sentiment",
        field: "socialInstagramSentiment",
        range: getDataRange(
          response.socialProfile.socialInstagramSentiment.value,
          response.programBenchmark.socialInstagramSentiment.value,
          response.agdiagoBenchmark.socialInstagramSentiment.value,
        ),
        style: "number",
        fractiondigits: 1
      },
      {
        value: response.socialProfile.socialTwitterSentiment.value,
        ftick: response.programBenchmark.socialTwitterSentiment.value,
        stick: response.agdiagoBenchmark.socialTwitterSentiment.value,
        name: "Social Twitter Sentiment",
        field: "socialTwitterSentiment",
        range: getDataRange(
          response.socialProfile.socialTwitterSentiment.value,
          response.programBenchmark.socialTwitterSentiment.value,
          response.agdiagoBenchmark.socialTwitterSentiment.value,
        ),
        style: "number",
        fractiondigits: 1
      },
      {
        value: response.socialProfile.twitterFollowers.value,
        ftick: response.programBenchmark.twitterFollowers.value,
        stick: response.agdiagoBenchmark.twitterFollowers.value,
        name: "Twitter Followers",
        field: "twitterFollowers",
        range: getDataRange(
          response.socialProfile.twitterFollowers.value,
          response.programBenchmark.twitterFollowers.value,
          response.agdiagoBenchmark.twitterFollowers.value,
        ),
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
          function checkifnull(datael){
            if (datael.value === null){return true;}
            else{return false;}
          }
          if (data.every(checkifnull))
           {
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
    return [
      {
        value: response.emotionalIntel.emotionalIntelAccountability.value,
        ftick: response.programBenchmark.emotionalIntelAccountability.value,
        stick: response.agdiagoBenchmark.emotionalIntelAccountability.value,
        name: "Emotional Intel Accountability",
        field: "emotionalIntelAccountability",
        range: getDataRange(
          response.emotionalIntel.emotionalIntelAccountability.value,
          response.programBenchmark.emotionalIntelAccountability.value,
          response.agdiagoBenchmark.emotionalIntelAccountability.value,
        ),
        style: "number",
        fractiondigits: 0
      },
      {
        value: response.emotionalIntel.emotionalIntelBehavior.value,
        ftick: response.programBenchmark.emotionalIntelBehavior.value,
        stick: response.agdiagoBenchmark.emotionalIntelBehavior.value,
        name: "Emotional Intel Behavior",
        field: "emotionalIntelBehavior",
        range: getDataRange(
          response.emotionalIntel.emotionalIntelBehavior.value,
          response.programBenchmark.emotionalIntelBehavior.value,
          response.agdiagoBenchmark.emotionalIntelBehavior.value,
        ),
        style: "number",
        fractiondigits: 0
      },
      {
        value: response.emotionalIntel.emotionalIntelIndependence.value,
        ftick: response.programBenchmark.emotionalIntelIndependence.value,
        stick: response.agdiagoBenchmark.emotionalIntelIndependence.value,
        name: "Eotional Intel Independence",
        field: "emotionalIntelIndependence",
        range: getDataRange(
          response.emotionalIntel.emotionalIntelIndependence.value,
          response.programBenchmark.emotionalIntelIndependence.value,
          response.agdiagoBenchmark.emotionalIntelIndependence.value,
        ),
        style: "number",
        fractiondigits: 0
      },
      {
        value: response.emotionalIntel.emotionalIntelReflection.value,
        ftick: response.programBenchmark.emotionalIntelReflection.value,
        stick: response.agdiagoBenchmark.emotionalIntelReflection.value,
        name: "Emotional Intel Reflection",
        field: "emotionalIntelReflection",
        range: getDataRange(
          response.emotionalIntel.emotionalIntelReflection.value,
          response.programBenchmark.emotionalIntelReflection.value,
          response.agdiagoBenchmark.emotionalIntelReflection.value,
        ),
        style: "number",
        fractiondigits: 0
      },
      {
        value: response.emotionalIntel.emotionalIntelRelationships.value,
        ftick: response.programBenchmark.emotionalIntelRelationships.value,
        stick: response.agdiagoBenchmark.emotionalIntelRelationships.value,
        name: "Emotional Intel Relationships",
        field: "emotionalIntelRelationships",
        range: getDataRange(
          response.emotionalIntel.emotionalIntelRelationships.value,
          response.programBenchmark.emotionalIntelRelationships.value,
          response.agdiagoBenchmark.emotionalIntelRelationships.value,
        ),
        style: "number",
        fractiondigits: 0
      },
      {
        value: response.emotionalIntel.emotionalIntelResponsibility.value,
        ftick: response.programBenchmark.emotionalIntelResponsibility.value,
        stick: response.agdiagoBenchmark.emotionalIntelResponsibility.value,
        name: "Emotional Intel Responsibility",
        field: "emotionalIntelResponsibility",
        range: getDataRange(
          response.emotionalIntel.emotionalIntelResponsibility.value,
          response.programBenchmark.emotionalIntelResponsibility.value,
          response.agdiagoBenchmark.emotionalIntelResponsibility.value,
        ),
        style: "number",
        fractiondigits: 0
      },
      {
        value: response.emotionalIntel.emotionalIntelteamWork.value,
        ftick: response.programBenchmark.emotionalIntelteamWork.value,
        stick: response.agdiagoBenchmark.emotionalIntelteamWork.value,
        name: "Emotional Intel teamWork",
        field: "emotionalIntelteamWork",
        range: getDataRange(
          response.emotionalIntel.emotionalIntelteamWork.value,
          response.programBenchmark.emotionalIntelteamWork.value,
          response.agdiagoBenchmark.emotionalIntelteamWork.value,
        ),
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
          function checkifnull(datael){
            if (datael.value === null){return true;}
            else{return false;}
          }
          if (data.every(checkifnull))
           {
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
    function getCarries() {
      return {
        value: response.athletic.carries.value,
        ftick: response.programBenchmark.carries.value,
        stick: response.agdiagoBenchmark.carries.value,
        name: "Carries",
        field: "carries",
        range: getDataRange(
          response.athletic.carries.value,
          response.programBenchmark.carries.value,
          response.agdiagoBenchmark.carries.value,
        ),
        style: "number",
        fractiondigits: 0
      };
    }
    function getCompletions() {
      return {
        value: response.athletic.completions.value,
        ftick: response.programBenchmark.completions.value,
        stick: response.agdiagoBenchmark.completions.value,
        name: "Completions",
        field: "completions",
        range: getDataRange(
          response.athletic.completions.value,
          response.programBenchmark.completions.value,
          response.agdiagoBenchmark.completions.value,
        ),
        style: "number",
        fractiondigits: 0
      };
    }
    function getInterceptionsThrown() {
      return {
        value: response.athletic.interceptionsThrown.value,
        ftick: response.programBenchmark.interceptionsThrown.value,
        stick: response.agdiagoBenchmark.interceptionsThrown.value,
        name: "Interceptions Thrown",
        field: "interceptionsThrown",
        range: getDataRange(
          response.athletic.interceptionsThrown.value,
          response.programBenchmark.interceptionsThrown.value,
          response.agdiagoBenchmark.interceptionsThrown.value,
      ),
        style: "number",
        fractiondigits: 0
      };
    }
    function getPassingYards() {
      return {
        value: response.athletic.passingYards.value,
        ftick: response.programBenchmark.passingYards.value,
        stick: response.agdiagoBenchmark.passingYards.value,
        name: "Passing Yards",
        field: "passingYards",
        range: getDataRange(
          response.athletic.passingYards.value,
          response.programBenchmark.passingYards.value,
          response.agdiagoBenchmark.passingYards.value,
      ),
        style: "number",
        fractiondigits: 0
      };
    }
    function getRecievingYards() {
      return {
        value: response.athletic.recievingYards.value,
        ftick: response.programBenchmark.recievingYards.value,
        stick: response.agdiagoBenchmark.recievingYards.value,
        name: "Recieving Yards",
        field: "recievingYards",
        range: getDataRange(
          response.athletic.recievingYards.value,
          response.programBenchmark.recievingYards.value,
          response.agdiagoBenchmark.recievingYards.value,
        ),
        style: "number",
        fractiondigits: 0
      };
    }
    function getReceptions() {
      return {
        value: response.athletic.receptions.value,
        ftick: response.programBenchmark.receptions.value,
        stick: response.agdiagoBenchmark.receptions.value,
        name: "Receptions",
        field: "receptions",
        range: getDataRange(
          response.athletic.receptions.value,
          response.programBenchmark.receptions.value,
          response.agdiagoBenchmark.receptions.value,
        ),
        style: "number",
        fractiondigits: 0
      };
    }
    function getrushingTouchdowns() {
      return {
        value: response.athletic.rushingTouchdowns.value,
        ftick: response.programBenchmark.rushingTouchdowns.value,
        stick: response.agdiagoBenchmark.rushingTouchdowns.value,
        name: "rushingTouchdowns",
        field: "rushingTouchdowns",
        range: getDataRange(
          response.athletic.rushingTouchdowns.value,
          response.programBenchmark.rushingTouchdowns.value,
          response.agdiagoBenchmark.rushingTouchdowns.value,
        ),
        style: "number",
        fractiondigits: 0
      };
    }
    function getRushingYards() {
      return {
        value: response.athletic.rushingYards.value,
        ftick: response.programBenchmark.rushingYards.value,
        stick: response.agdiagoBenchmark.rushingYards.value,
        name: "Rushing Yards",
        field: "rushingYards",
        range: getDataRange(
          response.athletic.rushingYards.value,
          response.programBenchmark.rushingYards.value,
          response.agdiagoBenchmark.rushingYards.value,
        ),
        style: "number",
        fractiondigits: 0
      };
    }
    function getSacks() {
      return {
        value: response.athletic.sacks.value,
        ftick: response.programBenchmark.sacks.value,
        stick: response.agdiagoBenchmark.sacks.value,
        name: "Sacks",
        field: "sacks",
        range: getDataRange(
          response.athletic.sacks.value,
          response.programBenchmark.sacks.value,
          response.agdiagoBenchmark.sacks.value,
        ),
        style: "number",
        fractiondigits: 0
      };
    }
    function getSoloTackle() {
      return {
        value: response.athletic.soloTackle.value,
        ftick: response.programBenchmark.soloTackle.value,
        stick: response.agdiagoBenchmark.soloTackle.value,
        name: "Solo Tackle",
        field: "soloTackle",
        range: getDataRange(
          response.athletic.soloTackle.value,
          response.programBenchmark.soloTackle.value,
          response.agdiagoBenchmark.soloTackle.value,
        ),
        style: "number",
        fractiondigits: 0
      };
    }
    function getTacklesForLoss() {
      return {
        value: response.athletic.tacklesForLoss.value,
        ftick: response.programBenchmark.tacklesForLoss.value,
        stick: response.agdiagoBenchmark.tacklesForLoss.value,
        name: "Tackles For Loss",
        field: "tacklesForLoss",
        range: getDataRange(
          response.athletic.tacklesForLoss.value,
          response.programBenchmark.tacklesForLoss.value,
          response.agdiagoBenchmark.tacklesForLoss.value,
        ),
        style: "number",
        fractiondigits: 0
      };
    }
    function gettotalTackles() {
      return {
        value: response.athletic.totalTackles.value,
        ftick: response.programBenchmark.totalTackles.value,
        stick: response.agdiagoBenchmark.totalTackles.value,
        name: "Total Tackles",
        field: "totalTackles",
        range: getDataRange(
          response.athletic.totalTackles.value,
          response.programBenchmark.totalTackles.value,
          response.agdiagoBenchmark.totalTackles.value,
        ),
        style: "number",
        fractiondigits: 0
      };
    }
    function getTouchdownsThrown() {
      return {
        value: response.athletic.touchdownsThrown.value,
        ftick: response.programBenchmark.touchdownsThrown.value,
        stick: response.agdiagoBenchmark.touchdownsThrown.value,
        name: "Touchdowns Thrown",
        field: "touchdownsThrown",
        range: getDataRange(
          response.athletic.touchdownsThrown.value,
          response.programBenchmark.touchdownsThrown.value,
          response.agdiagoBenchmark.touchdownsThrown.value,
        ),
        style: "number",
        fractiondigits: 0
      };
    }
    function getForty() {
      return {
        value: response.athletic.forty.value,
        ftick: response.programBenchmark.forty.value,
        stick: response.agdiagoBenchmark.forty.value,
        name: "Forty",
        field: "forty",
        range: getDataRange(
          response.athletic.forty.value,
          response.programBenchmark.forty.value,
          response.agdiagoBenchmark.forty.value,
        ),
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
        range: getDataRange(
          response.athletic.gamesPlayed.value,
          response.programBenchmark.gamesPlayed.value,
          response.agdiagoBenchmark.gamesPlayed.value,
        ),
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
        range: getDataRange(
          response.athletic.gamesStarted.value,
          response.programBenchmark.gamesStarted.value,
          response.agdiagoBenchmark.gamesStarted.value,
        ),
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
        range: getDataRange(
          response.athletic.height.value,
          response.programBenchmark.height.value,
          response.agdiagoBenchmark.height.value,
        ),
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
        range: getDataRange(
          response.athletic.vertical.value,
          response.programBenchmark.vertical.value,
          response.agdiagoBenchmark.vertical.value,
        ),
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
        range: getDataRange(
          response.athletic.weight.value,
          response.programBenchmark.weight.value,
          response.agdiagoBenchmark.weight.value,
        ),
        style: "number",
        fractiondigits: 0
      };
    }
    switch (playerPosition) {
      case "RB":
      return [getForty(),getVertical(),getCarries(),getrushingTouchdowns(),getRushingYards(),getReceptions(),getRecievingYards(),getGamesPlayed(),getGamesStarted(),getHeight(),getWeight()];
      case "QBPRO":
      case "QBDUAL":
      return [getForty(),getVertical(),getCarries(),getrushingTouchdowns(),getRushingYards(),getCompletions(),getPassingYards(),getTouchdownsThrown(),getInterceptionsThrown(),getGamesPlayed(),getGamesStarted(),getHeight(),getWeight()];
      case "DE":
      case "DT":
      return [getForty(),getVertical(),getSoloTackle(),gettotalTackles(),getSacks(),getTacklesForLoss(),getInterceptionsThrown(),getGamesPlayed(),getGamesStarted(),getHeight(),getWeight()];
      case "ILB":
      case "OLB":
      case "MLB":
      return [getForty(),getVertical(),getSoloTackle(),gettotalTackles(),getSacks(),getTacklesForLoss(),getInterceptionsThrown(),getGamesPlayed(),getGamesStarted(),getHeight(),getWeight()];
      default:
        return [
          getForty(),
          getGamesPlayed(),
          getGamesStarted(),
          getHeight(),
          getVertical(),
          getWeight(),
          getCarries(),
          getCompletions(),
          getInterceptionsThrown(),
          getPassingYards(),
          getRecievingYards(),
          getReceptions(),
          getrushingTouchdowns(),
          getRushingYards(),
          getSacks(),
          getSoloTackle(),
          getTacklesForLoss(),
          gettotalTackles(),
          getTouchdownsThrown()
        ];
    }
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
          function checkifnull(datael){
            if (datael.value === null){return true;}
            else{return false;}
          }
          if ((data.every(checkifnull))
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


var handleOverallScoreAttributes = (function() {
  "use strict";

  function getOverallAttributesData(response) {
    return [
      {
        value: 10,
        stick: 8,
        // stick: response.agdiagoBenchmark.sat.value,
        name: "Overall Core Attributes",
        field: "overallScore",
        contentId: "core-attributes",
        range: getDataRange(10,8),
        style: "percent",
        fractiondigits: 1
      },
      {
        value: 50,
        stick: 55,
        // stick: response.agdiagoBenchmark.coreGpa.value,
        name: "Overall Academic",
        field: "overallAcademic",
        contentId: "academic",
        range: getDataRange(50,55),
        style: "percent",
        fractiondigits: 1
      },
      {
        value: 61,
        stick: 33,
        // stick: response.agdiagoBenchmark.gpa.value,
        name: "Overall Emotional",
        field: "overallEmotional",
        contentId: "emotional-intel",
        range: getDataRange(61,33),
        style: "percent",
        fractiondigits: 1
      },
      {
        value: 33,
        stick: 66,
        // stick: response.agdiagoBenchmark.act.value,
        name: "Overall Athletic",
        field: "overallAthletic",
        contentId: "athletic",
        range: getDataRange(33,66),
        style: "percent",
        fractiondigits: 1
      },
      {
        value: 99,
        stick: 16,
        // stick: response.agdiagoBenchmark.act.value,
        name: "Overall Social",
        field: "overallSocial",
        contentId: "social-profile",
        range: getDataRange(99,16),
        style: "percent",
        fractiondigits: 1
      }
    ];
  }

  function getTooltip(field) {
    switch (field) {
      case "overallSocial":
        return "<h4>Competitiveness</h4><p class='dashboard-tooltip'>Highly competitive football athletes don’t just want to win — they need to win. Contests and matchups drive them to perform with excellence because their performance is clearly measured. These athletes possess a sense of confidence and are passionate about succeeding both on and off the field. They always strive to improve and they thrive on opportunities to put their talents to the test to claim the top prize.</p>";
      case "overallCore":
        return "<h4>Mastery</h4><p class='dashboard-tooltip'>Athletes with a drive for mastery seek to continually build on their knowledge and refine their skills. They are fueled by learning opportunities and seek out information to stay up to date on their understanding of all elements of the game. In addition to using the knowledge they’ve acquired, these athletes assess their opponents to strategize their play on game day. Often, success is a result of their investment in and application of this ongoing learning.</p>";
      default:
        return "";
    }
  }

  return function handleOverallAttributes(position) {
    if ($("#accordionExample").length !== 0) {
      $.post(
        "/api/dashboard-data",
        {
          type: "academic",
          playerPosition: position
        },
        function(response) {
          const data = getOverallAttributesData(response);
          function checkifnull(datael){
            if (datael.value === null){return true;}
            else{return false;}
          }
          if (data.every(checkifnull))
           {
            let elem = document.getElementById("overallBlock");
            elem.style.display = "none";
          } else {
            drawOverall(
              data,
              "#accordionExample",
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

function getDataRange(value, ftick, stick){
  let res = [0];
  let i = 0;
  do {i = i + 100;}
  while (i < value || i < ftick || i < stick)
  res.push(i);
  return res;
}


function getUrlParameters(data) {
  let res = {};
  let urlParams = new URLSearchParams(window.location.search);
  let myParam = urlParams.get("position");
  let category = urlParams.get("category");
  if (myParam == null) {
    res.position = undefined;
  } else {
    res.position = myParam.toUpperCase();
  }
  if (category == null) {
    res.category = undefined;
    return res;
  } else {
    res.category = myParam.toUpperCase();
    return res;
}}
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

function drawloader(selector){
  let parent = d3.select(selector);
  parent.selectAll("*").remove();
  let elLoader = parent.append("div");
  elLoader.attr("class", "elLoader");
  let loader = elLoader.append("div");
  loader.attr("class", "loader");
}

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
      handleOverallScoreAttributes(urlParams.position);
      handleSocialProfileAttributes(urlParams.position);
      handleEmotionalIntelAttributes(urlParams.position);
      handleCoreAttributes(urlParams.position);
      handleAthleticAttributes(urlParams.position);
      handleCulturalFit(urlParams.position);
      handleAcademicAttributes(urlParams.position);
    }
  };
})();
