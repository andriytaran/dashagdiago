const getSchoolName = () => {
  const url = new URL(document.URL);
  const query_string = url.search;
  const search_params = new URLSearchParams(query_string);
  return search_params.get('school');
};

function getAPIData(props, cb) {
  $.ajax({
    type: "POST",
    url: `/api/dashboard-data`,
    data: JSON.stringify(props),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: cb
  });
}

function updateAPIData(props, cb) {
  $.ajax({
    type: "POST",
    url: `/api/dashboard-data-update`,
    data: JSON.stringify(props),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: cb
  });
}

function updatePlayer(props, cb) {
  $.ajax({
    type: "POST",
    url: `/api/updatePlayer`,
    data: JSON.stringify(props),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: cb
  });
}

function createPlayer(props, cb) {
  $.ajax({
    type: "POST",
    url: `/api/createPlayer`,
    data: JSON.stringify(props),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: cb
  });
}

const deletePlayerById = (id, cb) => {
  $.ajax({
    type: "POST",
    url: `/api/deletePlayer`,
    data: JSON.stringify({id}),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: cb
  });
}

function getClasses(cb) {
  getAPIData({
    type: "players",
    attribute:"highschoolGraduationYear",
  }, cb);
}

function updateBenchmarks(body, cb) {
  const {position, benchmarks, factors, pillar, factor} = body;
  updateAPIData({
    type: "benchmarks",
    position: position,
    benchmarks: benchmarks,
    factors: factors,
    pillar: pillar,
    factor
  }, cb);
}

function getBenchmarks(position, group, cb) {
  getAPIData({
    type: "benchmarks",
    position: position,
    group: group,
  }, cb);
}

function createNewSchool(body, cb) {
  $.ajax({
    type: "POST",
    url: "/api/createNewSchool",
    data: JSON.stringify(body),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: cb,
    error: function (error) {
      alert('error; ' + JSON.stringify(error));
    }
  });
}

function getAttributesData(position, pillar, cb) {
  getAPIData({
    type: "pillar",
    pillar: pillar,
    position: position
  }, cb);
}

function getCoreAttributesData(position, cb) {
  getAPIData({
    type: "pillar",
    pillar: "coreAttributes",
    position: position
  }, cb);
}

function getAcademicAttributesData(position, cb) {
  getAPIData({
    type: "pillar",
    pillar: "academic",
    position: position
  }, cb);
}

function getSocialProfileAttributesData(position, cb) {
  getAPIData({
    type: "pillar",
    pillar: "socialProfile",
    position: position
  }, cb);
}

function getEmotionalIntelAttributesData(position, cb) {
  getAPIData({
    type: "pillar",
    pillar: "emotionalIntel",
    position: position
  }, cb);
}

function getAthleticAttributesData(position, cb) {
  getAPIData({
    type: "pillar",
    pillar: "athletic",
    position: position
  }, cb);
}

function getOverallScoresData(position, cb) {
  getAPIData({
    type: "scores",
    position: position
  }, cb);
}

function getCulturalFitData(position, cb) {
  getAPIData({
    type: "percentile_groups",
    position: position,
    attribute: "overallScore"
  }, cb);
}

function getCulturalFitModalTableData(position, valueStart, valueEnd, cb) {
  getAPIData({
    type: "players",
    position: position,
    sort: "desc",
    attribute: "overallScore",
    between: [valueStart, valueEnd]
  }, cb);
}

function getTopCulturalFitData(position, highschoolGraduationYear, cb) {
  getAPIData({
    type: "players",
    position: position,
    highschoolGraduationYear,
    sort: "desc",
    attribute: "overallScore",
    // limit: 10
  }, cb);
}

function getAllCulturalFitData(position, highschoolGraduationYear, cb) {
  getAPIData({
    type: "players",
    position: position,
    highschoolGraduationYear,
    sort: "desc",
    attribute: "highschoolGraduationYear",
  }, cb);
}

function getPlayersData(props, cb) {
  props = props || {};

  const offenseDefense = calculateOffenseDefense(props);

  getAPIData({
    type: "players",
    position: props.position,
    attribute: props.attribute,
    sort: props.sort,
    offenseDefense: offenseDefense
  }, cb);

  function calculateOffenseDefense(props) {
    if (props.offense && props.defense) {
      throw new Error("Both `offense` and `defense` is not supported.");
    }

    if (props.offense) {
      return 0;
    } else if (props.defense) {
      return 1;
    } else {
      return null;
    }
  }
}

function getPlayerAttributesData(id, pillar, cb) {
  getAPIData({
    type: "pillar",
    pillar: pillar,
    id: id
  }, cb);
}

function getPlayerCoreAttributesData(id, cb) {
  getAPIData({
    type: "pillar",
    pillar: "coreAttributes",
    id: id
  }, cb);
}

function getPlayerAcademicAttributesData(id, cb) {
  getAPIData({
    type: "pillar",
    pillar: "academic",
    id: id
  }, cb);
}

function getPlayerSocialProfileAttributesData(id, cb) {
  getAPIData({
    type: "pillar",
    pillar: "socialProfile",
    id: id
  }, cb);
}

function getPlayerEmotionalIntelAttributesData(id, cb) {
  getAPIData({
    type: "pillar",
    pillar: "emotionalIntel",
    id: id
  }, cb);
}

function getPlayerAthleticAttributesData(id, cb) {
  getAPIData({
    type: "pillar",
    pillar: "athletic",
    id: id
  }, cb);
}

function getSinglePlayerData(id, cb) {
  getAPIData({
    type: "single_player",
    id: id
  }, cb);
}
