function getAPIData (props, cb) {
  $.ajax({
    type: "POST",
    url: "/api/dashboard-data",
    data: JSON.stringify(props),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: cb
  });
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

function getCulturalFitData(position, cb){
  getAPIData({
    type: "percentile_groups",
    position: position,
    attribute: "athletic"
  }, cb);
}

function getCulturalFitModalTableData(position, valueStart, valueEnd, cb){
  getAPIData({
    type: "players",
    position: position,
    sort: "desc",
    attribute: "athletic",
    between: [valueStart, valueEnd]
  }, cb);
}

function getTopCulturalFitData(position, cb){
  getAPIData({
    type: "players",
    position: position,
    sort: "desc",
    attribute: "athletic",
    limit: 10
  }, cb);
}

function getPlayersData(props, cb) {
  props = props || {};

  const offenseDefense = calculateOffenseDefense(props);

  getAPIData({
    type: "players",
    position: props.position,
    attribute: props.attribute,
    offenseDefense: offenseDefense
  }, cb);

  function calculateOffenseDefense (props) {
    if (props.offense && props.defense) {
      throw new Error("Both `offense` and `defense` is not supported.");
    }

    if (props.offense) {
      return 1;
    } else if (props.defense) {
      return 0;
    } else {
      return null;
    }
  }
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
