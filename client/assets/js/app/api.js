function getCoreAttributesData(position, cb) {
  $.post(
    "/api/dashboard-data",
    {
      type: "pillar",
      pillar: "coreAttributes",
      position: position
    },
    function (response) {
      cb(response);
    },
    "json"
  );
}

function getAcademicAttributesData(position, cb) {
  $.post(
    "/api/dashboard-data",
    {
      type: "pillar",
      pillar: "academic",
      position: position
    },
    function (response) {
      cb(response);
    },
    "json"
  );
}

function getSocialProfileAttributesData(position, cb) {
  $.post(
    "/api/dashboard-data",
    {
      type: "pillar",
      pillar: "socialProfile",
      position: position
    },
    function (response) {
      cb(response);
    },
    "json"
  );
}

function getEmotionalIntelAttributesData(position, cb) {
  $.post(
    "/api/dashboard-data",
    {
      type: "pillar",
      pillar: "emotionalIntel",
      position: position
    },
    function (response) {
      cb(response);
    },
    "json"
  );
}

function getAthleticAttributesData(position, cb) {
  $.post(
    "/api/dashboard-data",
    {
      type: "pillar",
      pillar: "athletic",
      position: position
    },
    function (response) {
      cb(response);
    },
    "json"
  );
}

function getOverallScoresData(position, cb) {
  $.post(
    "/api/dashboard-data",
    {
      type: "scores",
      position: position
    },
    function (response) {
      cb(response);
    },
    "json"
  );
}

function getCulturalFitData(position, cb){

  $.post(
    "/api/dashboard-data",
    {
      type: "percentile_groups",
      position: position,
      attribute: "athletic"
    },
    function (response) {
      cb(response);
    },
    "json"
  );
}

function getCulturalFitModalTableData(position, valueStart, valueEnd, cb){
  $.ajax({
    type: "POST",
    url: "/api/dashboard-data",
    data: JSON.stringify({
      type: "players",
      position: position,
      sort: "desc",
      attribute: "athletic",
      between: [valueStart, valueEnd]
    }),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (response) {
      cb(response);
    }
  });
}

function getTopCulturalFitData(position, cb){
  $.ajax({
    type: "POST",
    url: "/api/dashboard-data",
    data: JSON.stringify({
      type: "players",
      position: position,
      sort: "desc",
      attribute: "athletic",
      limit: 10
    }),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (response) {
      cb(response);
    }
  });
}

function getPlayersData(position, attribute, cb) {
  $.post(
    "/api/dashboard-data",
    {
      type: "players",
      position: position,
      attribute: attribute
    },
    function (response) {
      cb(response);
    },
    "json"
  );
}

function getPlayerCoreAttributesData(id, cb) {
  $.post(
    "/api/dashboard-data",
    {
      type: "pillar",
      pillar: "coreAttributes",
      id: id
    },
    function (response) {
      cb(response);
    },
    "json"
  );
}

function getPlayerAcademicAttributesData(id, cb) {
  $.post(
    "/api/dashboard-data",
    {
      type: "pillar",
      pillar: "academic",
      id: id
    },
    function (response) {
      cb(response);
    },
    "json"
  );
}

function getPlayerSocialProfileAttributesData(id, cb) {
  $.post(
    "/api/dashboard-data",
    {
      type: "pillar",
      pillar: "socialProfile",
      id: id
    },
    function (response) {
      cb(response);
    },
    "json"
  );
}

function getPlayerEmotionalIntelAttributesData(id, cb) {
  $.post(
    "/api/dashboard-data",
    {
      type: "pillar",
      pillar: "emotionalIntel",
      id: id
    },
    function (response) {
      cb(response);
    },
    "json"
  );
}

function getPlayerAthleticAttributesData(id, cb) {
  $.post(
    "/api/dashboard-data",
    {
      type: "pillar",
      pillar: "athletic",
      id: id
    },
    function (response) {
      cb(response);
    },
    "json"
  );
}

function getSinglePlayerData(id, cb) {
  $.post(
    "/api/dashboard-data",
    {
      type: "single_player",
      id: id
    },
    function (response) {
      cb(response);
    },
    "json"
  );
}
