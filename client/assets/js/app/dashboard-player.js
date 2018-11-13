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
        value: response.attributes.player.coreAttributesCompetitiveness,
        ftick: response.attributes.program.coreAttributesCompetitiveness,
        stick: response.attributes.agdiago.coreAttributesCompetitiveness,
        name: "Competitiveness",
        field: "coreAttributesCompetitiveness",
        range: [0, 100],
        style: "percent",
        fractiondigits: 1
      },
      {
        value: response.attributes.player.coreAttributesMastery,
        ftick: response.attributes.program.coreAttributesMastery,
        stick: response.attributes.agdiago.coreAttributesMastery,
        name: "Mastery",
        field: "coreAttributesMastery",
        range: [0, 100],
        style: "percent",
        fractiondigits: 1
      },
      {
        value: response.attributes.player.coreAttributesPersistence,
        ftick: response.attributes.program.coreAttributesPersistence,
        stick: response.attributes.agdiago.coreAttributesPersistence,
        name: "Persistence",
        field: "coreAttributesPersistence",
        range: [0, 100],
        style: "percent",
        fractiondigits: 1
      },
      {
        value: response.attributes.player.coreAttributesTeamOrientation,
        ftick: response.attributes.program.coreAttributesTeamOrientation,
        stick: response.attributes.agdiago.coreAttributesTeamOrientation,
        name: "Team Orientation",
        field: "coreAttributesTeamOrientation",
        range: [0, 100],
        style: "percent",
        fractiondigits: 1
      },
      {
        value: response.attributes.player.coreAttributesWorkethic,
        ftick: response.attributes.program.coreAttributesWorkethic,
        stick: response.attributes.agdiago.coreAttributesWorkethic,
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
          type: "pillar",
          pillar: "coreAttributes",
          id: position
        },
        function(response) {
          const data = getCoreAttributesData(response);
          function checkifnull(datael){
            if (datael.value === null){return true;}
            else{return false;}
          }
          if (data.every(checkifnull))
           {
            let elem = document.getElementById("core-attributes");
            elem.innerHTML = "Not Available";
          } else {
            drawbarchart(
              data,
              "#core-attributes",
              position,
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

var handleAcademicAttributes = (function() {
  "use strict";

  function getAcademicAttributesData(response) {
    return [
      {
        value: response.attributes.player.sat,
        ftick: response.attributes.program.sat,
        stick: response.attributes.agdiago.sat,
        name: "SAT",
        field: "sat",
        range: [0, 10000],
        style: "number",
        fractiondigits: 0
      },
      {
        value: response.attributes.player.coreGpa,
        ftick: response.attributes.program.coreGpa,
        stick: response.attributes.agdiago.coreGpa,
        name: "Core GPA",
        field: "coreGpa",
        range: [0, 10],
        style: "number",
        fractiondigits: 1
      },
      {
        value: response.attributes.player.gpa,
        ftick: response.attributes.program.gpa,
        stick: response.attributes.agdiago.gpa,
        name: "GPA",
        field: "gpa",
        range: [0, 10],
        style: "number",
        fractiondigits: 1
      },
      {
        value: response.attributes.player.act,
        ftick: response.attributes.program.act,
        stick: response.attributes.agdiago.act,
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
          type: "pillar",
          pillar: "academic",
          id: position
        },
        function(response) {
          const data = getAcademicAttributesData(response);
          function checkifnull(datael){
            if (datael.value === null){return true;}
            else{return false;}
          }
          if (data.every(checkifnull))
           {
            let elem = document.getElementById("academic");
            elem.innerHTML = "Not Available";
          } else {
            drawbarchart(
              data,
              "#academic",
              position,
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

var handleSocialProfileAttributes = (function() {
  "use strict";

  function getSocialProfileAttributesData(response) {
    return [
      {
        value: response.attributes.player.facebookSentiment,
        ftick: response.attributes.program.facebookSentiment,
        stick: response.attributes.agdiago.facebookSentiment,
        name: "Facebook Sentiment",
        field: "facebookSentiment",
        range: [0, 10],
        style: "number",
        fractiondigits: 1
      },
      {
        value: response.attributes.player.instagramFollowers,
        ftick: response.attributes.program.instagramFollowers,
        stick: response.attributes.agdiago.instagramFollowers,
        name: "Instagram Followers",
        field: "instagramFollowers",
        range: [0, 10],
        style: "number",
        fractiondigits: 1
      },
      {
        value: response.attributes.player.newsMedaiCoveragementions,
        ftick: response.attributes.program.newsMedaiCoveragementions,
        stick: response.attributes.agdiago.newsMedaiCoveragementions,
        name: "News Medai Coverage mentions",
        field: "newsMedaiCoveragementions",
        range: [0, 10],
        style: "number",
        fractiondigits: 1
      },
      {
        value: response.attributes.player.newsMediaCoverageRegional,
        ftick: response.attributes.program.newsMediaCoverageRegional,
        stick: response.attributes.agdiago.newsMediaCoverageRegional,
        name: "News Media Coverage Regional",
        field: "newsMediaCoverageRegional",
        range: [0, 10],
        style: "number",
        fractiondigits: 1
      },
      {
        value: response.attributes.player.newsMediaCoverageSentiment,
        ftick: response.attributes.program.newsMediaCoverageSentiment,
        stick: response.attributes.agdiago.newsMediaCoverageSentiment,
        name: "News Media Coverage Sentiment",
        field: "newsMediaCoverageSentiment",
        range: [0, 10],
        style: "number",
        fractiondigits: 1
      },
      {
        value: response.attributes.player.newsMediacoverageNational,
        ftick: response.attributes.program.newsMediacoverageNational,
        stick: response.attributes.agdiago.newsMediacoverageNational,
        name: "News Media coverage National",
        field: "newsMediacoverageNational",
        range: [0, 10],
        style: "number",
        fractiondigits: 1
      },
      {
        value: response.attributes.player.pressReleaseSentiment,
        ftick: response.attributes.program.pressReleaseSentiment,
        stick: response.attributes.agdiago.pressReleaseSentiment,
        name: "Press Release Sentiment",
        field: "pressReleaseSentiment",
        range: [0, 10],
        style: "number",
        fractiondigits: 1
      },
      {
        value: response.attributes.player.pressReleaseSentimentCounter,
        ftick: response.attributes.program.pressReleaseSentimentCounter,
        stick: response.attributes.agdiago.pressReleaseSentimentCounter,
        name: "Press Release Sentiment Counter",
        field: "pressReleaseSentimentCounter",
        range: [0, 10],
        style: "number",
        fractiondigits: 1
      },
      {
        value: response.attributes.player.socialInstagramSentiment,
        ftick: response.attributes.program.socialInstagramSentiment,
        stick: response.attributes.agdiago.socialInstagramSentiment,
        name: "Social Instagram Sentiment",
        field: "socialInstagramSentiment",
        range: [0, 10],
        style: "number",
        fractiondigits: 1
      },
      {
        value: response.attributes.player.socialTwitterSentiment,
        ftick: response.attributes.program.socialTwitterSentiment,
        stick: response.attributes.agdiago.socialTwitterSentiment,
        name: "Social Twitter Sentiment",
        field: "socialTwitterSentiment",
        range: [0, 10],
        style: "number",
        fractiondigits: 1
      },
      {
        value: response.attributes.player.twitterFollowers,
        ftick: response.attributes.program.twitterFollowers,
        stick: response.attributes.agdiago.twitterFollowers,
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
          type: "pillar",
          pillar: "socialProfile",
          id: position
        },
        function(response) {
          const data = getSocialProfileAttributesData(response);
          function checkifnull(datael){
            if (datael.value === null){return true;}
            else{return false;}
          }
          if (data.every(checkifnull))
           {
            let elem = document.getElementById("social-profile");
            elem.innerHTML = "Not Available";
          } else {
            drawbarchart(
              data,
              "#social-profile",
              position,
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

var handleEmotionalIntelAttributes = (function() {
  "use strict";

  function getEmotionalIntelAttributesData(response) {
    return [
      {
        value: response.attributes.player.emotionalIntelAccountability,
        ftick: response.attributes.program.emotionalIntelAccountability,
        stick: response.attributes.agdiago.emotionalIntelAccountability,
        name: "Emotional Intel Accountability",
        field: "emotionalIntelAccountability",
        range: [0, 100],
        style: "number",
        fractiondigits: 0
      },
      {
        value: response.attributes.player.emotionalIntelBehavior,
        ftick: response.attributes.program.emotionalIntelBehavior,
        stick: response.attributes.agdiago.emotionalIntelBehavior,
        name: "Emotional Intel Behavior",
        field: "emotionalIntelBehavior",
        range: [0, 100],
        style: "number",
        fractiondigits: 0
      },
      {
        value: response.attributes.player.emotionalIntelIndependence,
        ftick: response.attributes.program.emotionalIntelIndependence,
        stick: response.attributes.agdiago.emotionalIntelIndependence,
        name: "Eotional Intel Independence",
        field: "emotionalIntelIndependence",
        range: [0, 100],
        style: "number",
        fractiondigits: 0
      },
      {
        value: response.attributes.player.emotionalIntelReflection,
        ftick: response.attributes.program.emotionalIntelReflection,
        stick: response.attributes.agdiago.emotionalIntelReflection,
        name: "Emotional Intel Reflection",
        field: "emotionalIntelReflection",
        range: [0, 100],
        style: "number",
        fractiondigits: 0
      },
      {
        value: response.attributes.player.emotionalIntelRelationships,
        ftick: response.attributes.program.emotionalIntelRelationships,
        stick: response.attributes.agdiago.emotionalIntelRelationships,
        name: "Emotional Intel Relationships",
        field: "emotionalIntelRelationships",
        range: [0, 100],
        style: "number",
        fractiondigits: 0
      },
      {
        value: response.attributes.player.emotionalIntelResponsibility,
        ftick: response.attributes.program.emotionalIntelResponsibility,
        stick: response.attributes.agdiago.emotionalIntelResponsibility,
        name: "Emotional Intel Responsibility",
        field: "emotionalIntelResponsibility",
        range: [0, 100],
        style: "number",
        fractiondigits: 0
      },
      {
        value: response.attributes.player.emotionalIntelteamWork,
        ftick: response.attributes.program.emotionalIntelteamWork,
        stick: response.attributes.agdiago.emotionalIntelteamWork,
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
          type: "pillar",
          pillar: "emotionalIntel",
          id: position
        },
        function(response) {
          const data = getEmotionalIntelAttributesData(response);
          function checkifnull(datael){
            if (datael.value === null){return true;}
            else{return false;}
          }
          if (data.every(checkifnull))
           {
            let elem = document.getElementById("emotional-intel");
            elem.innerHTML = "Not Available";
          } else {
            drawbarchart(
              data,
              "#emotional-intel",
              position,
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

var handleAthleticAttributes = (function() {
  "use strict";
  function getAthleticAttributesData(response, playerPosition) {
    function getCarries() {
      return {
        value: response.attributes.player.carries,
        ftick: response.attributes.program.carries,
        stick: response.attributes.agdiago.carries,
        name: "Carries",
        field: "carries",
        range: [0, 100],
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
        range: [0, 100],
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
        range: [0, 100],
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
        range: [0, 1000],
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
        range: [0, 1000],
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
        range: [0, 100],
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
        range: [0, 100],
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
        range: [0, 1000],
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
        range: [0, 100],
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
        range: [0, 100],
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
        range: [0, 100],
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
        range: [0, 100],
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
        range: [0, 100],
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
        range: [0, 100],
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
        range: [0, 100],
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
        range: [0, 100],
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
        range: [0, 100],
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
        range: [0, 100],
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
        range: [0, 1000],
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

  return function handleAthleticAttributes(id) {
    if ($("#athletic").length !== 0) {
      $.post(
        "/api/dashboard-data",
        {
          type: "pillar",
          pillar: "athletic",
          id: position
        },
        function(response) {
          const data = getAthleticAttributesData(response, window.position);
          function checkifnull(datael){
            if (datael.value === null){return true;}
            else{return false;}
          }
          if ((data.every(checkifnull))
          ) {
            let elem = document.getElementById("athletic");
            elem.innerHTML = "Not Available";
          } else {
            drawbarchart(
              data,
              "#athletic",
              position,
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

var handleSinglePlayer = (function() {
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
        range: [0, 200],
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
        range: [0, 200],
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
        range: [0, 200],
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
        range: [0, 200],
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
        range: [0, 200],
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

  function getTooltip(label) {
    switch (label) {
      case "academic":
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

  return function handleSinglePlayer(id) {
    if ($("#player-attributes").length !== 0 && $("#basic-player-info").length !== 0) {
      $.post(
        "/api/dashboard-data",
        {
          type: "single_player",
          id: id
        },
        function(response) {
          window.position = response.player.position;

          const data = getSinglePlayerData(response);
          drawplayerinfo(data.playerInfo,"#basic-player-info");
          drawOverallBar(response.overallScore.player);
          function checkifnull(datael){
            if (datael.value === null){return true;}
            else{return false;}
          }

          if (data.playerAttributes.every(checkifnull)) {
            let elem = document.getElementById("playerAttributesBlock");
            elem.style.display = "none";
          } else {
            drawOverall(
              data.playerAttributes,
              "#player-attributes",
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

function getUrlParameters(data) {
  let res = {};
  let urlParams = new URLSearchParams(window.location.search);
  let myParam = urlParams.get("id");
  if (myParam == null) {
    res.id = undefined;
    return res;
  } else {
    res.id = myParam.toUpperCase();
    return res;
  }
}

function drawOverallBar(scoreval){
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
      getUrlParameters();
      let urlParams = getUrlParameters();
      // handleOverallScoreAttributes(urlParams.position);
      handleSinglePlayer(urlParams.id);
    }
  };
})();
