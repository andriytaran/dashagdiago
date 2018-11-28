var handleCoreAttributes = (function () {
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
    let res = [
      {
        value: response.attributes.player.coreAttributesCompetitiveness,
        ftick: response.attributes.program.coreAttributesCompetitiveness,
        stick: response.attributes.agdiago.coreAttributesCompetitiveness,
        name: "Competitiveness",
        field: "coreAttributesCompetitiveness",
        range: getDataRange(
          response.attributes.player.coreAttributesCompetitiveness,
          response.attributes.program.coreAttributesCompetitiveness,
          response.attributes.agdiago.coreAttributesCompetitiveness
        ),
        style: "percent",
        fractiondigits: 1
      },
      {
        value: response.attributes.player.coreAttributesMastery,
        ftick: response.attributes.program.coreAttributesMastery,
        stick: response.attributes.agdiago.coreAttributesMastery,
        name: "Mastery",
        field: "coreAttributesMastery",
        range: getDataRange(
          response.attributes.player.coreAttributesMastery,
          response.attributes.program.coreAttributesMastery,
          response.attributes.agdiago.coreAttributesMastery
        ),
        style: "percent",
        fractiondigits: 1
      },
      {
        value: response.attributes.player.coreAttributesPersistence,
        ftick: response.attributes.program.coreAttributesPersistence,
        stick: response.attributes.agdiago.coreAttributesPersistence,
        name: "Persistence",
        field: "coreAttributesPersistence",
        range: getDataRange(
          response.attributes.player.coreAttributesPersistence,
          response.attributes.program.coreAttributesPersistence,
          response.attributes.agdiago.coreAttributesPersistence
        ),
        style: "percent",
        fractiondigits: 1
      },
      {
        value: response.attributes.player.coreAttributesTeamOrientation,
        ftick: response.attributes.program.coreAttributesTeamOrientation,
        stick: response.attributes.agdiago.coreAttributesTeamOrientation,
        name: "Team Orientation",
        field: "coreAttributesTeamOrientation",
        range: getDataRange(
          response.attributes.player.coreAttributesTeamOrientation,
          response.attributes.program.coreAttributesTeamOrientation,
          response.attributes.agdiago.coreAttributesTeamOrientation
        ),
        style: "percent",
        fractiondigits: 1
      },
      {
        value: response.attributes.player.coreAttributesWorkethic,
        ftick: response.attributes.program.coreAttributesWorkethic,
        stick: response.attributes.agdiago.coreAttributesWorkethic,
        name: "Work Ethic",
        field: "coreAttributesWorkethic",
        range: getDataRange(
          response.attributes.player.coreAttributesWorkethic,
          response.attributes.program.coreAttributesWorkethic,
          response.attributes.agdiago.coreAttributesWorkethic
        ),
        style: "percent",
        fractiondigits: 1
      }
    ];
    function sortByValue(a, b) { return b.value - a.value; }
    res.sort(sortByValue)
    return res;
  }
  function getTooltip(color, label) {
    let res = "";
    debugger;
    switch (color){
      case "green":
        res = res + "<p class='dashboard-tooltip' style='color:green;'><strong>Green Bar: Athlete has met School and Agdiago min benchmarks</strong><hr>";
        break;
      case "orange":
        res = res + "<p class='dashboard-tooltip' style='color:orange;'><strong>Orange Bar: Athlete failed to meet School and Agdiago min benchmarks</strong><hr>";
        break;
    }
    switch (label) {
      case "coreAttributesCompetitiveness":
        res = res + "Highly competitive football athletes don’t just want to win — they need to win. Contests and matchups drive them to perform with excellence because their performance is clearly measured. These athletes possess a sense of confidence and are passionate about succeeding both on and off the field. They always strive to improve and they thrive on opportunities to put their talents to the test to claim the top prize.</p>";
        break;
      case "coreAttributesMastery":
        res = res + "Athletes with a drive for mastery seek to continually build on their knowledge and refine their skills. They are fueled by learning opportunities and seek out information to stay up to date on their understanding of all elements of the game. In addition to using the knowledge they’ve acquired, these athletes assess their opponents to strategize their play on game day. Often, success is a result of their investment in and application of this ongoing learning.</p>";
        break;
      case "coreAttributesPersistence":
        res = res + "Not everything in football comes easily and some games or plays can be difficult or more complicated than expected. In these situations, success comes from resiliency and an unwillingness to give up. Athletes with persistence persevere in the face of obstacles and do not give up. It’s in their nature to keep working and try harder to overcome adversity in whatever they do. Their natural intensity and resolve allow them to find success.</p>";
        break;
      case "coreAttributesTeamOrientation":
        res = res + "Some athletes naturally possess a “team first” mindset, seeking to build collaboration that leads to success. These individuals are often the glue that holds the team together, fostering positive relationships within the group. When there is work to be done, these athletes jump in to help others even when it means going beyond the scope of their own expectations. Seen as dependable, they take ownership for their work and follow through, which builds trust and leads to close relationships with their team members.</p>";
        break;
      case "coreAttributesWorkethic":
        res = res + "Athletes with strong work ethic create structure in their lives to ensure follow through and success. These individuals are punctual, focused and organized; they often create plans to ensure that they meet attendance and performance expectations. Naturally goal-oriented, they set priorities and tune out distractions to accomplish the objectives. For athletes with work ethic, they believe in getting the work done and doing it right.</p>";
        break;
      default:
        res = res + "</p>";
        break;
    }
    return res;
  }

  return function handleCoreAttributes(id) {
    if ($("#core-attributes").length !== 0) {
      $.post(
        "/api/dashboard-data",
        {
          type: "pillar",
          pillar: "coreAttributes",
          id: id
        },
        function (response) {
          const data = getCoreAttributesData(response);
          function checkifnull(datael) {
            if (datael.value === null) { return true; }
            else { return false; }
          }
          if (data.every(checkifnull)) {
            let elem = document.getElementById("core-attributes");
            elem.innerHTML = "Not Available";
          } else {
            drawbarchart(
              data,
              "#core-attributes",
              undefined,
              getTooltip,
              undefined,
            );
          }
        },
        "json"
      );
    }
  };
})();

var handleAcademicAttributes = (function () {
  "use strict";

  function getAcademicAttributesData(response) {
    let res = [
      {
        value: response.attributes.player.sat,
        ftick: response.attributes.program.sat,
        stick: response.attributes.agdiago.sat,
        name: "SAT",
        field: "sat",
        range: getDataRange(
          response.attributes.player.sat,
          response.attributes.program.sat,
          response.attributes.agdiago.sat
        ),
        style: "number",
        fractiondigits: 0
      },
      {
        value: response.attributes.player.coreGpa,
        ftick: response.attributes.program.coreGpa,
        stick: response.attributes.agdiago.coreGpa,
        name: "Core GPA",
        field: "coreGpa",
        range: getDataRange(
          response.attributes.player.coreGpa,
          response.attributes.program.coreGpa,
          response.attributes.agdiago.coreGpa
        ),
        style: "number",
        fractiondigits: 1
      },
      {
        value: response.attributes.player.gpa,
        ftick: response.attributes.program.gpa,
        stick: response.attributes.agdiago.gpa,
        name: "GPA",
        field: "gpa",
        range: getDataRange(
          response.attributes.player.gpa,
          response.attributes.program.gpa,
          response.attributes.agdiago.gpa
        ),
        style: "number",
        fractiondigits: 1
      },
      {
        value: response.attributes.player.act,
        ftick: response.attributes.program.act,
        stick: response.attributes.agdiago.act,
        name: "ACT",
        field: "act",
        range: getDataRange(
          response.attributes.player.act,
          response.attributes.program.act,
          response.attributes.agdiago.act
        ),
        style: "number",
        fractiondigits: 0
      }
    ];
    function sortByValue(a, b) { return b.value - a.value; }
    return res.sort(sortByValue)
  }

  function getTooltip(color, label) {
    let res = "";
    debugger;
    switch (color){
      case "green":
        res = res + "<p class='dashboard-tooltip' style='color:green;'><strong>Green Bar: Athlete has met School and Agdiago min benchmarks</strong><hr>";
        break;
      case "orange":
        res = res + "<p class='dashboard-tooltip' style='color:orange;'><strong>Orange Bar: Athlete failed to meet School and Agdiago min benchmarks</strong><hr>";
        break;
    }
    switch (label) {
      case "coreAttributesCompetitiveness":
        res = res + "Highly competitive football athletes don’t just want to win — they need to win. Contests and matchups drive them to perform with excellence because their performance is clearly measured. These athletes possess a sense of confidence and are passionate about succeeding both on and off the field. They always strive to improve and they thrive on opportunities to put their talents to the test to claim the top prize.</p>";
        break;
      case "coreAttributesMastery":
        res = res + "Athletes with a drive for mastery seek to continually build on their knowledge and refine their skills. They are fueled by learning opportunities and seek out information to stay up to date on their understanding of all elements of the game. In addition to using the knowledge they’ve acquired, these athletes assess their opponents to strategize their play on game day. Often, success is a result of their investment in and application of this ongoing learning.</p>";
        break;
      case "coreAttributesPersistence":
        res = res + "Not everything in football comes easily and some games or plays can be difficult or more complicated than expected. In these situations, success comes from resiliency and an unwillingness to give up. Athletes with persistence persevere in the face of obstacles and do not give up. It’s in their nature to keep working and try harder to overcome adversity in whatever they do. Their natural intensity and resolve allow them to find success.</p>";
        break;
      case "coreAttributesTeamOrientation":
        res = res + "Some athletes naturally possess a “team first” mindset, seeking to build collaboration that leads to success. These individuals are often the glue that holds the team together, fostering positive relationships within the group. When there is work to be done, these athletes jump in to help others even when it means going beyond the scope of their own expectations. Seen as dependable, they take ownership for their work and follow through, which builds trust and leads to close relationships with their team members.</p>";
        break;
      case "coreAttributesWorkethic":
        res = res + "Athletes with strong work ethic create structure in their lives to ensure follow through and success. These individuals are punctual, focused and organized; they often create plans to ensure that they meet attendance and performance expectations. Naturally goal-oriented, they set priorities and tune out distractions to accomplish the objectives. For athletes with work ethic, they believe in getting the work done and doing it right.</p>";
        break;
      default:
        res = res + "</p>";
        break;
    }
    return res;
  }

  return function handleAcademicAttributes(id) {
    if ($("#academic").length !== 0) {
      $.post(
        "/api/dashboard-data",
        {
          type: "pillar",
          pillar: "academic",
          id: id
        },
        function (response) {
          const data = getAcademicAttributesData(response);
          function checkifnull(datael) {
            if (datael.value === null) { return true; }
            else { return false; }
          }
          if (data.every(checkifnull)) {
            let elem = document.getElementById("academic");
            elem.innerHTML = "Not Available";
          } else {
            drawbarchart(
              data,
              "#academic",
              undefined,
              getTooltip,
              undefined,
            );
          }
        },
        "json"
      );
    }
  };
})();

var handleSocialProfileAttributes = (function () {
  "use strict";

  function getSocialProfileAttributesData(response) {
    let res = [
      {
        value: response.attributes.player.facebookSentiment,
        ftick: response.attributes.program.facebookSentiment,
        stick: response.attributes.agdiago.facebookSentiment,
        name: "Facebook Sentiment",
        field: "facebookSentiment",
        range: getDataRange(
          response.attributes.player.facebookSentiment,
          response.attributes.program.facebookSentiment,
          response.attributes.agdiago.facebookSentiment
        ),
        style: "number",
        fractiondigits: 1
      },
      {
        value: response.attributes.player.instagramFollowers,
        ftick: response.attributes.program.instagramFollowers,
        stick: response.attributes.agdiago.instagramFollowers,
        name: "Instagram Followers",
        field: "instagramFollowers",
        range: getDataRange(
          response.attributes.player.instagramFollowers,
          response.attributes.program.instagramFollowers,
          response.attributes.agdiago.instagramFollowers
        ),
        style: "number",
        fractiondigits: 1
      },
      {
        value: response.attributes.player.newsMedaiCoveragementions,
        ftick: response.attributes.program.newsMedaiCoveragementions,
        stick: response.attributes.agdiago.newsMedaiCoveragementions,
        name: "News Medai Coverage mentions",
        field: "newsMedaiCoveragementions",
        range: getDataRange(
          response.attributes.player.newsMedaiCoveragementions,
          response.attributes.program.newsMedaiCoveragementions,
          response.attributes.agdiago.newsMedaiCoveragementions
        ),
        style: "number",
        fractiondigits: 1
      },
      {
        value: response.attributes.player.newsMediaCoverageRegional,
        ftick: response.attributes.program.newsMediaCoverageRegional,
        stick: response.attributes.agdiago.newsMediaCoverageRegional,
        name: "News Media Coverage Regional",
        field: "newsMediaCoverageRegional",
        range: getDataRange(
          response.attributes.player.newsMediaCoverageRegional,
          response.attributes.program.newsMediaCoverageRegional,
          response.attributes.agdiago.newsMediaCoverageRegional
        ),
        style: "number",
        fractiondigits: 1
      },
      {
        value: response.attributes.player.newsMediaCoverageSentiment,
        ftick: response.attributes.program.newsMediaCoverageSentiment,
        stick: response.attributes.agdiago.newsMediaCoverageSentiment,
        name: "News Media Coverage Sentiment",
        field: "newsMediaCoverageSentiment",
        range: getDataRange(
          response.attributes.player.newsMediaCoverageSentiment,
          response.attributes.program.newsMediaCoverageSentiment,
          response.attributes.agdiago.newsMediaCoverageSentiment
        ),
        style: "number",
        fractiondigits: 1
      },
      {
        value: response.attributes.player.newsMediacoverageNational,
        ftick: response.attributes.program.newsMediacoverageNational,
        stick: response.attributes.agdiago.newsMediacoverageNational,
        name: "News Media coverage National",
        field: "newsMediacoverageNational",
        range: getDataRange(
          response.attributes.player.newsMediacoverageNational,
          response.attributes.program.newsMediacoverageNational,
          response.attributes.agdiago.newsMediacoverageNational
        ),
        style: "number",
        fractiondigits: 1
      },
      {
        value: response.attributes.player.pressReleaseSentiment,
        ftick: response.attributes.program.pressReleaseSentiment,
        stick: response.attributes.agdiago.pressReleaseSentiment,
        name: "Press Release Sentiment",
        field: "pressReleaseSentiment",
        range: getDataRange(
          response.attributes.player.pressReleaseSentiment,
          response.attributes.program.pressReleaseSentiment,
          response.attributes.agdiago.pressReleaseSentiment
        ),
        style: "number",
        fractiondigits: 1
      },
      {
        value: response.attributes.player.pressReleaseSentimentCounter,
        ftick: response.attributes.program.pressReleaseSentimentCounter,
        stick: response.attributes.agdiago.pressReleaseSentimentCounter,
        name: "Press Release Sentiment Counter",
        field: "pressReleaseSentimentCounter",
        range: getDataRange(
          response.attributes.player.pressReleaseSentimentCounter,
          response.attributes.program.pressReleaseSentimentCounter,
          response.attributes.agdiago.pressReleaseSentimentCounter
        ),
        style: "number",
        fractiondigits: 1
      },
      {
        value: response.attributes.player.socialInstagramSentiment,
        ftick: response.attributes.program.socialInstagramSentiment,
        stick: response.attributes.agdiago.socialInstagramSentiment,
        name: "Social Instagram Sentiment",
        field: "socialInstagramSentiment",
        range: getDataRange(
          response.attributes.player.socialInstagramSentiment,
          response.attributes.program.socialInstagramSentiment,
          response.attributes.agdiago.socialInstagramSentiment
        ),
        style: "number",
        fractiondigits: 1
      },
      {
        value: response.attributes.player.socialTwitterSentiment,
        ftick: response.attributes.program.socialTwitterSentiment,
        stick: response.attributes.agdiago.socialTwitterSentiment,
        name: "Social Twitter Sentiment",
        field: "socialTwitterSentiment",
        range: getDataRange(
          response.attributes.player.socialTwitterSentiment,
          response.attributes.program.socialTwitterSentiment,
          response.attributes.agdiago.socialTwitterSentiment
        ),
        style: "number",
        fractiondigits: 1
      },
      {
        value: response.attributes.player.twitterFollowers,
        ftick: response.attributes.program.twitterFollowers,
        stick: response.attributes.agdiago.twitterFollowers,
        name: "Twitter Followers",
        field: "twitterFollowers",
        range: getDataRange(
          response.attributes.player.twitterFollowers,
          response.attributes.program.twitterFollowers,
          response.attributes.agdiago.twitterFollowers
        ),
        style: "number",
        fractiondigits: 1
      }
    ];
    function sortByValue(a, b) { return b.value - a.value; }
    res.sort(sortByValue)
    return res;
  }

  function getTooltip(color, label) {
    let res = "";
    debugger;
    switch (color){
      case "green":
        res = res + "<p class='dashboard-tooltip' style='color:green;'><strong>Green Bar: Athlete has met School and Agdiago min benchmarks</strong><hr>";
        break;
      case "orange":
        res = res + "<p class='dashboard-tooltip' style='color:orange;'><strong>Orange Bar: Athlete failed to meet School and Agdiago min benchmarks</strong><hr>";
        break;
    }
    switch (label) {
      case "coreAttributesCompetitiveness":
        res = res + "Highly competitive football athletes don’t just want to win — they need to win. Contests and matchups drive them to perform with excellence because their performance is clearly measured. These athletes possess a sense of confidence and are passionate about succeeding both on and off the field. They always strive to improve and they thrive on opportunities to put their talents to the test to claim the top prize.</p>";
        break;
      case "coreAttributesMastery":
        res = res + "Athletes with a drive for mastery seek to continually build on their knowledge and refine their skills. They are fueled by learning opportunities and seek out information to stay up to date on their understanding of all elements of the game. In addition to using the knowledge they’ve acquired, these athletes assess their opponents to strategize their play on game day. Often, success is a result of their investment in and application of this ongoing learning.</p>";
        break;
      case "coreAttributesPersistence":
        res = res + "Not everything in football comes easily and some games or plays can be difficult or more complicated than expected. In these situations, success comes from resiliency and an unwillingness to give up. Athletes with persistence persevere in the face of obstacles and do not give up. It’s in their nature to keep working and try harder to overcome adversity in whatever they do. Their natural intensity and resolve allow them to find success.</p>";
        break;
      case "coreAttributesTeamOrientation":
        res = res + "Some athletes naturally possess a “team first” mindset, seeking to build collaboration that leads to success. These individuals are often the glue that holds the team together, fostering positive relationships within the group. When there is work to be done, these athletes jump in to help others even when it means going beyond the scope of their own expectations. Seen as dependable, they take ownership for their work and follow through, which builds trust and leads to close relationships with their team members.</p>";
        break;
      case "coreAttributesWorkethic":
        res = res + "Athletes with strong work ethic create structure in their lives to ensure follow through and success. These individuals are punctual, focused and organized; they often create plans to ensure that they meet attendance and performance expectations. Naturally goal-oriented, they set priorities and tune out distractions to accomplish the objectives. For athletes with work ethic, they believe in getting the work done and doing it right.</p>";
        break;
      default:
        res = res + "</p>";
        break;
    }
    return res;
  }

  return function handleSocialProfileAttributes(id) {
    if ($("#social-profile").length !== 0) {
      $.post(
        "/api/dashboard-data",
        {
          type: "pillar",
          pillar: "socialProfile",
          id: id
        },
        function (response) {
          const data = getSocialProfileAttributesData(response);
          function checkifnull(datael) {
            if (datael.value === null) { return true; }
            else { return false; }
          }
          if (data.every(checkifnull)) {
            let elem = document.getElementById("social-profile");
            elem.innerHTML = "Not Available";
          } else {
            drawbarchart(
              data,
              "#social-profile",
              undefined,
              getTooltip,
              undefined
            );
          }
        },
        "json"
      );
    }
  };
})();

var handleEmotionalIntelAttributes = (function () {
  "use strict";

  function getEmotionalIntelAttributesData(response) {
    let res = [
      {
        value: response.attributes.player.emotionalIntelAccountability,
        ftick: response.attributes.program.emotionalIntelAccountability,
        stick: response.attributes.agdiago.emotionalIntelAccountability,
        name: "Emotional Intel Accountability",
        field: "emotionalIntelAccountability",
        range: getDataRange(
          response.attributes.player.emotionalIntelAccountability,
          response.attributes.program.emotionalIntelAccountability,
          response.attributes.agdiago.emotionalIntelAccountability
        ),
        style: "number",
        fractiondigits: 0
      },
      {
        value: response.attributes.player.emotionalIntelBehavior,
        ftick: response.attributes.program.emotionalIntelBehavior,
        stick: response.attributes.agdiago.emotionalIntelBehavior,
        name: "Emotional Intel Behavior",
        field: "emotionalIntelBehavior",
        range: getDataRange(
          response.attributes.player.emotionalIntelBehavior,
          response.attributes.program.emotionalIntelBehavior,
          response.attributes.agdiago.emotionalIntelBehavior
        ),
        style: "number",
        fractiondigits: 0
      },
      {
        value: response.attributes.player.emotionalIntelIndependence,
        ftick: response.attributes.program.emotionalIntelIndependence,
        stick: response.attributes.agdiago.emotionalIntelIndependence,
        name: "Eotional Intel Independence",
        field: "emotionalIntelIndependence",
        range: getDataRange(
          response.attributes.player.emotionalIntelIndependence,
          response.attributes.program.emotionalIntelIndependence,
          response.attributes.agdiago.emotionalIntelIndependence
        ),
        style: "number",
        fractiondigits: 0
      },
      {
        value: response.attributes.player.emotionalIntelReflection,
        ftick: response.attributes.program.emotionalIntelReflection,
        stick: response.attributes.agdiago.emotionalIntelReflection,
        name: "Emotional Intel Reflection",
        field: "emotionalIntelReflection",
        range: getDataRange(
          response.attributes.player.emotionalIntelReflection,
          response.attributes.program.emotionalIntelReflection,
          response.attributes.agdiago.emotionalIntelReflection
        ),
        style: "number",
        fractiondigits: 0
      },
      {
        value: response.attributes.player.emotionalIntelRelationships,
        ftick: response.attributes.program.emotionalIntelRelationships,
        stick: response.attributes.agdiago.emotionalIntelRelationships,
        name: "Emotional Intel Relationships",
        field: "emotionalIntelRelationships",
        range: getDataRange(
          response.attributes.player.emotionalIntelRelationships,
          response.attributes.program.emotionalIntelRelationships,
          response.attributes.agdiago.emotionalIntelRelationships
        ),
        style: "number",
        fractiondigits: 0
      },
      {
        value: response.attributes.player.emotionalIntelResponsibility,
        ftick: response.attributes.program.emotionalIntelResponsibility,
        stick: response.attributes.agdiago.emotionalIntelResponsibility,
        name: "Emotional Intel Responsibility",
        field: "emotionalIntelResponsibility",
        range: getDataRange(
          response.attributes.player.emotionalIntelResponsibility,
          response.attributes.program.emotionalIntelResponsibility,
          response.attributes.agdiago.emotionalIntelResponsibility
        ),
        style: "number",
        fractiondigits: 0
      },
      {
        value: response.attributes.player.emotionalIntelteamWork,
        ftick: response.attributes.program.emotionalIntelteamWork,
        stick: response.attributes.agdiago.emotionalIntelteamWork,
        name: "Emotional Intel teamWork",
        field: "emotionalIntelteamWork",
        range: getDataRange(
          response.attributes.player.emotionalIntelteamWork,
          response.attributes.program.emotionalIntelteamWork,
          response.attributes.agdiago.emotionalIntelteamWork
        ),
        style: "number",
        fractiondigits: 0
      }
    ];
    function sortByValue(a, b) { return b.value - a.value; }
    res.sort(sortByValue)
    return res;
  }

  function getTooltip(color, label) {
    let res = "";
    debugger;
    switch (color){
      case "green":
        res = res + "<p class='dashboard-tooltip' style='color:green;'><strong>Green Bar: Athlete has met School and Agdiago min benchmarks</strong><hr>";
        break;
      case "orange":
        res = res + "<p class='dashboard-tooltip' style='color:orange;'><strong>Orange Bar: Athlete failed to meet School and Agdiago min benchmarks</strong><hr>";
        break;
    }
    switch (label) {
      case "coreAttributesCompetitiveness":
        res = res + "Highly competitive football athletes don’t just want to win — they need to win. Contests and matchups drive them to perform with excellence because their performance is clearly measured. These athletes possess a sense of confidence and are passionate about succeeding both on and off the field. They always strive to improve and they thrive on opportunities to put their talents to the test to claim the top prize.</p>";
        break;
      case "coreAttributesMastery":
        res = res + "Athletes with a drive for mastery seek to continually build on their knowledge and refine their skills. They are fueled by learning opportunities and seek out information to stay up to date on their understanding of all elements of the game. In addition to using the knowledge they’ve acquired, these athletes assess their opponents to strategize their play on game day. Often, success is a result of their investment in and application of this ongoing learning.</p>";
        break;
      case "coreAttributesPersistence":
        res = res + "Not everything in football comes easily and some games or plays can be difficult or more complicated than expected. In these situations, success comes from resiliency and an unwillingness to give up. Athletes with persistence persevere in the face of obstacles and do not give up. It’s in their nature to keep working and try harder to overcome adversity in whatever they do. Their natural intensity and resolve allow them to find success.</p>";
        break;
      case "coreAttributesTeamOrientation":
        res = res + "Some athletes naturally possess a “team first” mindset, seeking to build collaboration that leads to success. These individuals are often the glue that holds the team together, fostering positive relationships within the group. When there is work to be done, these athletes jump in to help others even when it means going beyond the scope of their own expectations. Seen as dependable, they take ownership for their work and follow through, which builds trust and leads to close relationships with their team members.</p>";
        break;
      case "coreAttributesWorkethic":
        res = res + "Athletes with strong work ethic create structure in their lives to ensure follow through and success. These individuals are punctual, focused and organized; they often create plans to ensure that they meet attendance and performance expectations. Naturally goal-oriented, they set priorities and tune out distractions to accomplish the objectives. For athletes with work ethic, they believe in getting the work done and doing it right.</p>";
        break;
      default:
        res = res + "</p>";
        break;
    }
    return res;
  }

  return function handleEmotionalIntelAttributes(id) {
    if ($("#emotional-intel").length !== 0) {
      $.post(
        "/api/dashboard-data",
        {
          type: "pillar",
          pillar: "emotionalIntel",
          id: id
        },
        function (response) {
          const data = getEmotionalIntelAttributesData(response);
          function checkifnull(datael) {
            if (datael.value === null) { return true; }
            else { return false; }
          }
          if (data.every(checkifnull)) {
            let elem = document.getElementById("emotional-intel");
            elem.innerHTML = "Not Available";
          } else {
            drawbarchart(
              data,
              "#emotional-intel",
              undefined,
              getTooltip,
              undefined
            );
          }
        },
        "json"
      );
    }
  };
})();

var handleAthleticAttributes = (function () {
  "use strict";
  function getAthleticAttributesData(response, playerPosition) {
    function getCarries() {
      return {
        value: response.attributes.player.carries,
        ftick: response.attributes.program.carries,
        stick: response.attributes.agdiago.carries,
        name: "Carries",
        field: "carries",
        range: getDataRange(
          response.attributes.player.carries,
          response.attributes.program.carries,
          response.attributes.agdiago.carries
        ),
        style: "number",
        fractiondigits: 0
      };
    }
    function getCompletions() {
      return {
        value: response.attributes.player.completions,
        ftick: response.attributes.program.completions,
        stick: response.attributes.agdiago.completions,
        name: "Completions",
        field: "completions",
        range: getDataRange(
          response.attributes.player.completions,
          response.attributes.program.completions,
          response.attributes.agdiago.completions
        ),
        style: "number",
        fractiondigits: 0
      };
    }
    function getInterceptionsThrown() {
      return {
        value: response.attributes.player.interceptionsThrown,
        ftick: response.attributes.program.interceptionsThrown,
        stick: response.attributes.agdiago.interceptionsThrown,
        name: "Interceptions Thrown",
        field: "interceptionsThrown",
        range: getDataRange(
          response.attributes.player.interceptionsThrown,
          response.attributes.program.interceptionsThrown,
          response.attributes.agdiago.interceptionsThrown
        ),
        style: "number",
        fractiondigits: 0
      };
    }
    function getPassingYards() {
      return {
        value: response.attributes.player.passingYards,
        ftick: response.attributes.program.passingYards,
        stick: response.attributes.agdiago.passingYards,
        name: "Passing Yards",
        field: "passingYards",
        range: getDataRange(
          response.attributes.player.passingYards,
          response.attributes.program.passingYards,
          response.attributes.agdiago.passingYards
        ),
        style: "number",
        fractiondigits: 0
      };
    }
    function getRecievingYards() {
      return {
        value: response.attributes.player.recievingYards,
        ftick: response.attributes.program.recievingYards,
        stick: response.attributes.agdiago.recievingYards,
        name: "Recieving Yards",
        field: "recievingYards",
        range: getDataRange(
          response.attributes.player.recievingYards,
          response.attributes.program.recievingYards,
          response.attributes.agdiago.recievingYards
        ),
        style: "number",
        fractiondigits: 0
      };
    }
    function getReceptions() {
      return {
        value: response.attributes.player.receptions,
        ftick: response.attributes.program.receptions,
        stick: response.attributes.agdiago.receptions,
        name: "Receptions",
        field: "receptions",
        range: getDataRange(
          response.attributes.player.receptions,
          response.attributes.program.receptions,
          response.attributes.agdiago.receptions
        ),
        style: "number",
        fractiondigits: 0
      };
    }
    function getrushingTouchdowns() {
      return {
        value: response.attributes.player.rushingTouchdowns,
        ftick: response.attributes.program.rushingTouchdowns,
        stick: response.attributes.agdiago.rushingTouchdowns,
        name: "rushingTouchdowns",
        field: "rushingTouchdowns",
        range: getDataRange(
          response.attributes.player.rushingTouchdowns,
          response.attributes.program.rushingTouchdowns,
          response.attributes.agdiago.rushingTouchdowns
        ),
        style: "number",
        fractiondigits: 0
      };
    }
    function getRushingYards() {
      return {
        value: response.attributes.player.rushingYards,
        ftick: response.attributes.program.rushingYards,
        stick: response.attributes.agdiago.rushingYards,
        name: "Rushing Yards",
        field: "rushingYards",
        range: getDataRange(
          response.attributes.player.rushingYards,
          response.attributes.program.rushingYards,
          response.attributes.agdiago.rushingYards
        ),
        style: "number",
        fractiondigits: 0
      };
    }
    function getSacks() {
      return {
        value: response.attributes.player.sacks,
        ftick: response.attributes.program.sacks,
        stick: response.attributes.agdiago.sacks,
        name: "Sacks",
        field: "sacks",
        range: getDataRange(
          response.attributes.player.sacks,
          response.attributes.program.sacks,
          response.attributes.agdiago.sacks
        ),
        style: "number",
        fractiondigits: 0
      };
    }
    function getSoloTackle() {
      return {
        value: response.attributes.player.soloTackle,
        ftick: response.attributes.program.soloTackle,
        stick: response.attributes.agdiago.soloTackle,
        name: "Solo Tackle",
        field: "soloTackle",
        range: getDataRange(
          response.attributes.player.soloTackle,
          response.attributes.program.soloTackle,
          response.attributes.agdiago.soloTackle
        ),
        style: "number",
        fractiondigits: 0
      };
    }
    function getTacklesForLoss() {
      return {
        value: response.attributes.player.tacklesForLoss,
        ftick: response.attributes.program.tacklesForLoss,
        stick: response.attributes.agdiago.tacklesForLoss,
        name: "Tackles For Loss",
        field: "tacklesForLoss",
        range: getDataRange(
          response.attributes.player.tacklesForLoss,
          response.attributes.program.tacklesForLoss,
          response.attributes.agdiago.tacklesForLoss
        ),
        style: "number",
        fractiondigits: 0
      };
    }
    function gettotalTackles() {
      return {
        value: response.attributes.player.totalTackles,
        ftick: response.attributes.program.totalTackles,
        stick: response.attributes.agdiago.totalTackles,
        name: "Total Tackles",
        field: "totalTackles",
        range: getDataRange(
          response.attributes.player.totalTackles,
          response.attributes.program.totalTackles,
          response.attributes.agdiago.totalTackles
        ),
        style: "number",
        fractiondigits: 0
      };
    }
    function getTouchdownsThrown() {
      return {
        value: response.attributes.player.touchdownsThrown,
        ftick: response.attributes.program.touchdownsThrown,
        stick: response.attributes.agdiago.touchdownsThrown,
        name: "Touchdowns Thrown",
        field: "touchdownsThrown",
        range: getDataRange(
          response.attributes.player.touchdownsThrown,
          response.attributes.program.touchdownsThrown,
          response.attributes.agdiago.touchdownsThrown
        ),
        style: "number",
        fractiondigits: 0
      };
    }
    function getForty() {
      return {
        value: response.attributes.player.forty,
        ftick: response.attributes.program.forty,
        stick: response.attributes.agdiago.forty,
        name: "Forty",
        field: "forty",
        range: getDataRange(
          response.attributes.player.forty,
          response.attributes.program.forty,
          response.attributes.agdiago.forty
        ),
        style: "number",
        fractiondigits: 0
      };
    }
    function getGamesPlayed() {
      return {
        value: response.attributes.player.gamesPlayed,
        ftick: response.attributes.program.gamesPlayed,
        stick: response.attributes.agdiago.gamesPlayed,
        name: "Games Played",
        field: "gamesPlayed",
        range: getDataRange(
          response.attributes.player.gamesPlayed,
          response.attributes.program.gamesPlayed,
          response.attributes.agdiago.gamesPlayed
        ),
        style: "number",
        fractiondigits: 0
      };
    }
    function getGamesStarted() {
      return {
        value: response.attributes.player.gamesStarted,
        ftick: response.attributes.program.gamesStarted,
        stick: response.attributes.agdiago.gamesStarted,
        name: "Games Started",
        field: "gamesStarted",
        range: getDataRange(
          response.attributes.player.gamesStarted,
          response.attributes.program.gamesStarted,
          response.attributes.agdiago.gamesStarted
        ),
        style: "number",
        fractiondigits: 0
      };
    }
    function getHeight() {
      return {
        value: response.attributes.player.height,
        ftick: response.attributes.program.height,
        stick: response.attributes.agdiago.height,
        name: "Height",
        field: "height",
        range: getDataRange(
          response.attributes.player.height,
          response.attributes.program.height,
          response.attributes.agdiago.height
        ),
        style: "number",
        fractiondigits: 0
      };
    }
    function getVertical() {
      return {
        value: response.attributes.player.vertical,
        ftick: response.attributes.program.vertical,
        stick: response.attributes.agdiago.vertical,
        name: "Vertical",
        field: "vertical",
        range: getDataRange(
          response.attributes.player.vertical,
          response.attributes.program.vertical,
          response.attributes.agdiago.vertical
        ),
        style: "number",
        fractiondigits: 0
      };
    }
    function getWeight() {
      return {
        value: response.attributes.player.weight,
        ftick: response.attributes.program.weight,
        stick: response.attributes.agdiago.weight,
        name: "Weight",
        field: "weight",
        range: getDataRange(
          response.attributes.player.weight,
          response.attributes.program.weight,
          response.attributes.agdiago.weight
        ),
        style: "number",
        fractiondigits: 0
      };
    }
    let res;
    switch (playerPosition) {
      case "RB":
        res = [getForty(), getVertical(), getCarries(), getrushingTouchdowns(), getRushingYards(), getReceptions(), getRecievingYards(), getGamesPlayed(), getGamesStarted(), getHeight(), getWeight()];
        break;
      case "QBPRO":
      case "QBDUAL":
        res = [getForty(), getVertical(), getCarries(), getrushingTouchdowns(), getRushingYards(), getCompletions(), getPassingYards(), getTouchdownsThrown(), getInterceptionsThrown(), getGamesPlayed(), getGamesStarted(), getHeight(), getWeight()];
        break;
      case "DE":
      case "DT":
        res = [getForty(), getVertical(), getSoloTackle(), gettotalTackles(), getSacks(), getTacklesForLoss(), getInterceptionsThrown(), getGamesPlayed(), getGamesStarted(), getHeight(), getWeight()];
        break;
      case "ILB":
      case "OLB":
      case "MLB":
        res = [getForty(), getVertical(), getSoloTackle(), gettotalTackles(), getSacks(), getTacklesForLoss(), getInterceptionsThrown(), getGamesPlayed(), getGamesStarted(), getHeight(), getWeight()];
        break;
      default:
        res = [
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
    function sortByValue(a, b) { return b.value - a.value; }
    res.sort(sortByValue)
    return res;
  }

  function getTooltip(color, label) {
    let res = "";
    debugger;
    switch (color){
      case "green":
        res = res + "<p class='dashboard-tooltip' style='color:green;'><strong>Green Bar: Athlete has met School and Agdiago min benchmarks</strong><hr>";
        break;
      case "orange":
        res = res + "<p class='dashboard-tooltip' style='color:orange;'><strong>Orange Bar: Athlete failed to meet School and Agdiago min benchmarks</strong><hr>";
        break;
    }
    switch (label) {
      case "coreAttributesCompetitiveness":
        res = res + "Highly competitive football athletes don’t just want to win — they need to win. Contests and matchups drive them to perform with excellence because their performance is clearly measured. These athletes possess a sense of confidence and are passionate about succeeding both on and off the field. They always strive to improve and they thrive on opportunities to put their talents to the test to claim the top prize.</p>";
        break;
      case "coreAttributesMastery":
        res = res + "Athletes with a drive for mastery seek to continually build on their knowledge and refine their skills. They are fueled by learning opportunities and seek out information to stay up to date on their understanding of all elements of the game. In addition to using the knowledge they’ve acquired, these athletes assess their opponents to strategize their play on game day. Often, success is a result of their investment in and application of this ongoing learning.</p>";
        break;
      case "coreAttributesPersistence":
        res = res + "Not everything in football comes easily and some games or plays can be difficult or more complicated than expected. In these situations, success comes from resiliency and an unwillingness to give up. Athletes with persistence persevere in the face of obstacles and do not give up. It’s in their nature to keep working and try harder to overcome adversity in whatever they do. Their natural intensity and resolve allow them to find success.</p>";
        break;
      case "coreAttributesTeamOrientation":
        res = res + "Some athletes naturally possess a “team first” mindset, seeking to build collaboration that leads to success. These individuals are often the glue that holds the team together, fostering positive relationships within the group. When there is work to be done, these athletes jump in to help others even when it means going beyond the scope of their own expectations. Seen as dependable, they take ownership for their work and follow through, which builds trust and leads to close relationships with their team members.</p>";
        break;
      case "coreAttributesWorkethic":
        res = res + "Athletes with strong work ethic create structure in their lives to ensure follow through and success. These individuals are punctual, focused and organized; they often create plans to ensure that they meet attendance and performance expectations. Naturally goal-oriented, they set priorities and tune out distractions to accomplish the objectives. For athletes with work ethic, they believe in getting the work done and doing it right.</p>";
        break;
      default:
        res = res + "</p>";
        break;
    }
    return res;
  }

  return function handleAthleticAttributes(id) {
    if ($("#athletic").length !== 0) {
      $.post(
        "/api/dashboard-data",
        {
          type: "pillar",
          pillar: "athletic",
          id: id
        },
        function (response) {
          const data = getAthleticAttributesData(response, window.position);
          function checkifnull(datael) {
            if (datael.value === null) { return true; }
            else { return false; }
          }
          if ((data.every(checkifnull))
          ) {
            let elem = document.getElementById("athletic");
            elem.innerHTML = "Not Available";
          } else {
            drawbarchart(
              data,
              "#athletic",
              undefined,
              getTooltip,
              undefined
            );
          }
        },
        "json"
      );
    }
  };
})();

var handleSinglePlayer = (function () {
  "use strict";
  function getSinglePlayerData(response) {
    function getBasicPlayerInfo() {
      return {
        fname: response.player.fname,
        lname: response.player.lname,
        hometown: response.player.hometown,
        school: response.player.school,
        team: response.player.teamName,
        coach: response.player.coach,
        scoutdate: response.player.scoutdate,
        university: response.player.university,
      };
    }
    function getAthletic() {
      return {
        value: response.scores.player.athletic,
        stick: response.scores.agdiago.athletic,
        name: "Athletic",
        field: "athletic",
        contentId: "athletic",
        range: getDataRange(
          response.scores.player.athletic,
          response.scores.agdiago.athletic
        ),
        style: "percent",
        fractiondigits: 1
      };
    }
    function getEmotionalIntel() {
      return {
        value: response.scores.player.emotionalIntel,
        stick: response.scores.agdiago.emotionalIntel,
        name: "Emotional Intel",
        field: "emotionalIntel",
        contentId: "emotional-intel",
        range: getDataRange(
          response.scores.player.emotionalIntel,
          response.scores.agdiago.emotionalIntel
        ),
        style: "percent",
        fractiondigits: 1
      };
    }
    function getAcademic() {
      return {
        value: response.scores.player.academic,
        stick: response.scores.agdiago.academic,
        name: "Academic",
        field: "academic",
        contentId: "academic",
        range: getDataRange(
          response.scores.player.academic,
          response.scores.agdiago.academic
        ),
        style: "percent",
        fractiondigits: 1
      };
    }
    function getSocialProfile() {
      return {
        value: response.scores.player.socialProfile,
        stick: response.scores.agdiago.socialProfile,
        name: "Social Profile",
        field: "socialProfile",
        contentId: "social-profile",
        range: getDataRange(
          response.scores.player.socialProfile,
          response.scores.agdiago.socialProfile
        ),
        style: "percent",
        fractiondigits: 1
      };
    }
    function getCoreAttributes() {
      return {
        value: response.scores.player.coreAttributes,
        stick: response.scores.agdiago.coreAttributes,
        name: "Core Attributes",
        field: "coreAttributes",
        contentId: "core-attributes",
        range: getDataRange(
          response.scores.player.coreAttributes,
          response.scores.agdiago.coreAttributes
        ),
        style: "percent",
        fractiondigits: 1
      };
    }

    return {
      playerInfo: getBasicPlayerInfo(),
      playerAttributes: [
        getAthletic(),
        getEmotionalIntel(),
        getAcademic(),
        getSocialProfile(),
        getCoreAttributes()
      ]
    };
  }

  function getTooltip(color, label) {
    let res = "";
    debugger;
    switch (color){
      case "green":
        res = res + "<p class='dashboard-tooltip' style='color:green;'><strong>Green Bar: Athlete has met School and Agdiago min benchmarks</strong><hr>";
        break;
      case "orange":
        res = res + "<p class='dashboard-tooltip' style='color:orange;'><strong>Orange Bar: Athlete failed to meet School and Agdiago min benchmarks</strong><hr>";
        break;
    }
    switch (label) {
      case "coreAttributesCompetitiveness":
        res = res + "Highly competitive football athletes don’t just want to win — they need to win. Contests and matchups drive them to perform with excellence because their performance is clearly measured. These athletes possess a sense of confidence and are passionate about succeeding both on and off the field. They always strive to improve and they thrive on opportunities to put their talents to the test to claim the top prize.</p>";
        break;
      case "coreAttributesMastery":
        res = res + "Athletes with a drive for mastery seek to continually build on their knowledge and refine their skills. They are fueled by learning opportunities and seek out information to stay up to date on their understanding of all elements of the game. In addition to using the knowledge they’ve acquired, these athletes assess their opponents to strategize their play on game day. Often, success is a result of their investment in and application of this ongoing learning.</p>";
        break;
      case "coreAttributesPersistence":
        res = res + "Not everything in football comes easily and some games or plays can be difficult or more complicated than expected. In these situations, success comes from resiliency and an unwillingness to give up. Athletes with persistence persevere in the face of obstacles and do not give up. It’s in their nature to keep working and try harder to overcome adversity in whatever they do. Their natural intensity and resolve allow them to find success.</p>";
        break;
      case "coreAttributesTeamOrientation":
        res = res + "Some athletes naturally possess a “team first” mindset, seeking to build collaboration that leads to success. These individuals are often the glue that holds the team together, fostering positive relationships within the group. When there is work to be done, these athletes jump in to help others even when it means going beyond the scope of their own expectations. Seen as dependable, they take ownership for their work and follow through, which builds trust and leads to close relationships with their team members.</p>";
        break;
      case "coreAttributesWorkethic":
        res = res + "Athletes with strong work ethic create structure in their lives to ensure follow through and success. These individuals are punctual, focused and organized; they often create plans to ensure that they meet attendance and performance expectations. Naturally goal-oriented, they set priorities and tune out distractions to accomplish the objectives. For athletes with work ethic, they believe in getting the work done and doing it right.</p>";
        break;
      default:
        res = res + "</p>";
        break;
    }
    return res;
  }

  return function handleSinglePlayer(id) {
    if ($("#accordionExample").length !== 0 && $("#basic-player-info").length !== 0) {
      $.post(
        "/api/dashboard-data",
        {
          type: "single_player",
          id: id
        },
        function (response) {
          window.position = response.player.position;

          const data = getSinglePlayerData(response);
          drawplayerinfo(data.playerInfo, "#basic-player-info");
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
        },
        "json"
      );
    }
  };
})();

function drawOverallBar(scoreval) {
  let scoreboard = document.getElementById("overallscore");
  let str = scoreval / 100;
  str = str.toLocaleString(undefined, {
    useGrouping: false,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
    style: "percent"
  });
  scoreboard.innerHTML = str;
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
