function normalizeBarChartData(data, props) {
  props = props || {};
  const sort = props.sort == null ? true : props.sort;

  const withoutNulls = data.filter(d => d.value != null);
  if (sort) {
    const sortedByValue = withoutNulls.sort(sortByValue);
    return sortedByValue;
  } else {
    return withoutNulls;
  }

  function sortByValue(a, b) { return b.value - a.value; }
}

function mapCoreAttributesForBarChart(response) {
  let res = [
    {
      value: response.attributes.player.coreAttributesCompetitiveness,
      ftick: response.attributes.program.coreAttributesCompetitiveness,
      stick: response.attributes.agdiago.coreAttributesCompetitiveness,
      range: getDataRange(
        response.attributes.player.coreAttributesCompetitiveness,
        response.attributes.program.coreAttributesCompetitiveness,
        response.attributes.agdiago.coreAttributesCompetitiveness,
      ),
      name: "Competitiveness",
      field: "coreAttributesCompetitiveness",
      style: "percent",
      fractiondigits: 2
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
      fractiondigits: 2
    },
    {
      value: response.attributes.player.coreAttributesPersistence,
      ftick: response.attributes.program.coreAttributesPersistence,
      stick: response.attributes.agdiago.coreAttributesPersistence,
      range: getDataRange(
        response.attributes.player.coreAttributesPersistence,
        response.attributes.program.coreAttributesPersistence,
        response.attributes.agdiago.coreAttributesPersistence,
      ),
      name: "Persistence",
      field: "coreAttributesPersistence",
      style: "percent",
      fractiondigits: 2
    },
    {
      value: response.attributes.player.coreAttributesTeamOrientation,
      ftick: response.attributes.program.coreAttributesTeamOrientation,
      stick: response.attributes.agdiago.coreAttributesTeamOrientation,
      range: getDataRange(
        response.attributes.player.coreAttributesTeamOrientation,
        response.attributes.program.coreAttributesTeamOrientation,
        response.attributes.agdiago.coreAttributesTeamOrientation,
      ),
      name: "Team Orientation",
      field: "coreAttributesTeamOrientation",
      style: "percent",
      fractiondigits: 2
    },
    {
      value: response.attributes.player.coreAttributesWorkEthic,
      ftick: response.attributes.program.coreAttributesWorkEthic,
      stick: response.attributes.agdiago.coreAttributesWorkEthic,
      range: getDataRange(
        response.attributes.player.coreAttributesWorkEthic,
        response.attributes.program.coreAttributesWorkEthic,
        response.attributes.agdiago.coreAttributesWorkEthic,
      ),
      name: "Work Ethic",
      field: "coreAttributesWorkEthic",
      style: "percent",
      fractiondigits: 2
    }
  ];
  return normalizeBarChartData(res);
}

function mapAcademicAttributesForBarСhart(response) {
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
      fractiondigits: 2
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
        response.attributes.agdiago.cor
      ),
      style: "number",
      fractiondigits: 2
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
      fractiondigits: 2
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
      fractiondigits: 2
    }
  ];
  return normalizeBarChartData(res);
}

function mapSocialProfileAttributesForBarChart(response) {
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
      fractiondigits: 2
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
      fractiondigits: 2
    },
    {
      value: response.attributes.player.newsMediaCoverageMentions,
      ftick: response.attributes.program.newsMediaCoverageMentions,
      stick: response.attributes.agdiago.newsMediaCoverageMentions,
      name: "News Media Coverage mentions",
      field: "newsMediaCoverageMentions",
      range: getDataRange(
        response.attributes.player.newsMediaCoverageMentions,
        response.attributes.program.newsMediaCoverageMentions,
        response.attributes.agdiago.newsMediaCoverageMentions
      ),
      style: "number",
      fractiondigits: 2
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
      fractiondigits: 2
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
      fractiondigits: 2
    },
    {
      value: response.attributes.player.newsMediaCoverageNational,
      ftick: response.attributes.program.newsMediaCoverageNational,
      stick: response.attributes.agdiago.newsMediaCoverageNational,
      name: "News Media coverage National",
      field: "newsMediaCoverageNational",
      range: getDataRange(
        response.attributes.player.newsMediaCoverageNational,
        response.attributes.program.newsMediaCoverageNational,
        response.attributes.agdiago.newsMediaCoverageNational
      ),
      style: "number",
      fractiondigits: 2
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
      fractiondigits: 2
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
      fractiondigits: 2
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
      fractiondigits: 2
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
      fractiondigits: 2
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
      fractiondigits: 2
    }
  ];
  return normalizeBarChartData(res);
}

function mapEmotionalIntelAttributesForBarChart(response) {
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
      fractiondigits: 2
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
      fractiondigits: 2
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
      fractiondigits: 2
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
      fractiondigits: 2
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
      fractiondigits: 2
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
      fractiondigits: 2
    },
    {
      value: response.attributes.player.emotionalIntelTeamWork,
      ftick: response.attributes.program.emotionalIntelTeamWork,
      stick: response.attributes.agdiago.emotionalIntelTeamWork,
      name: "Emotional Intel teamWork",
      field: "emotionalIntelTeamWork",
      range: getDataRange(
        response.attributes.player.emotionalIntelTeamWork,
        response.attributes.program.emotionalIntelTeamWork,
        response.attributes.agdiago.emotionalIntelTeamWork
      ),
      style: "number",
      fractiondigits: 2
    }
  ];
  return normalizeBarChartData(res);
}

function mapAthleticAttributesForBarchart(response) {
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
      fractiondigits: 2
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
      fractiondigits: 2
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
      fractiondigits: 2
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
      fractiondigits: 2
    };
  }
  function getRecievingYards() {
    return {
      value: response.attributes.player.receivingYards,
      ftick: response.attributes.program.receivingYards,
      stick: response.attributes.agdiago.receivingYards,
      name: "Recieving Yards",
      field: "receivingYards",
      range: getDataRange(
        response.attributes.player.receivingYards,
        response.attributes.program.receivingYards,
        response.attributes.agdiago.receivingYards
      ),
      style: "number",
      fractiondigits: 2
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
      fractiondigits: 2
    };
  }
  function getrushingTouchdowns() {
    return {
      value: response.attributes.player.rushingTouchdowns,
      ftick: response.attributes.program.rushingTouchdowns,
      stick: response.attributes.agdiago.rushingTouchdowns,
      name: "Rushing Touchdowns",
      field: "rushingTouchdowns",
      range: getDataRange(
        response.attributes.player.rushingTouchdowns,
        response.attributes.program.rushingTouchdowns,
        response.attributes.agdiago.rushingTouchdowns
      ),
      style: "number",
      fractiondigits: 2
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
      fractiondigits: 2
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
      fractiondigits: 2
    };
  }
  function getSoloTackle() {
    return {
      value: response.attributes.player.soloTackles,
      ftick: response.attributes.program.soloTackles,
      stick: response.attributes.agdiago.soloTackles,
      name: "Solo Tackles",
      field: "soloTackles",
      range: getDataRange(
        response.attributes.player.soloTackles,
        response.attributes.program.soloTackles,
        response.attributes.agdiago.soloTackles
      ),
      style: "number",
      fractiondigits: 2
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
      fractiondigits: 2
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
      fractiondigits: 2
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
      fractiondigits: 2
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
      fractiondigits: 2
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
      fractiondigits: 2
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
      fractiondigits: 2
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
      fractiondigits: 2
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
      fractiondigits: 2
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
      fractiondigits: 2
    };
  }
  let res;
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
  return normalizeBarChartData(res);
}

function mapOverallScoresForBarchart(response) {
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

  const res = [
    getAthletic(),
    getEmotionalIntel(),
    getAcademic(),
    getSocialProfile(),
    getCoreAttributes()
  ];

  return normalizeBarChartData(res, { sort: false });
}

function mapCulturalFitForPieChart(response) {
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

function mapTopCulturalFitForTable(response) {
  return response.players.map(cb);
  function cb(player, i) {
    return {
      fname: player.fname,
      lname: player.lname,
      position: player.position,
      score: player.value,
      id: player.id,
      rate: i + 1
    };
  }
}

function mapPlayersForTable(response) {
  return response.players.map(cb);
  function cb(player) {
    return {
      fname: player.fname,
      lname: player.lname,
      position: player.position,
      score: player.value,
      id: player.id,
    };
  }
}

function mapCulturalFitForTable(response) {
  return response.players.map(cb);
  function cb(player) {
    return {
      fname: player.fname,
      lname: player.lname,
      position: player.position,
      score: player.value,
      id: player.id,
    };
  }
}

function mapSinglePlayerForBarchart(response) {
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

  const res = [
    getAthletic(),
    getEmotionalIntel(),
    getAcademic(),
    getSocialProfile(),
    getCoreAttributes()
  ];

  return normalizeBarChartData(res, { sort: false });
}

function mapSinglePlayerForOverallInfo(response) {
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
  return getBasicPlayerInfo()
}
