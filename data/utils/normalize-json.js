'use strict';

const {Transform} = require('stream');

const uniqueId = require('./unique-id');

function normalizeKey(key) {
  key = key.trim();
  const res = key[0].toLowerCase() + key.slice(1);
  switch (res) {
    case 'coreAttributesWorkethic':
      return 'coreAttributesWorkEthic';
    case 'coreAttributesOverallscore':
      return 'coreAttributesOverallScore';
    case 'emotionalIntelteamWork':
      return 'emotionalIntelTeamWork';
    case 'avgeragePunt':
      return 'averagePunt';
    case '40':
      return 'forty';
    case 'newsMedaiCoveragementions':
      return 'newsMediaCoverageMentions';
    case 'newsMediacoverageNational':
      return 'newsMediaCoverageNational';
    case 'recievingYards':
      return 'receivingYards';
    case 'soloTackle':
      return 'soloTackles';
    default:
      return res;
  }
}

function normalizeValue(value, key) {
  if (value == null) return null;
  if (value === '') return null;
  switch (key) {
    case 'forty':
    case 'height':
    case 'weight':
    case 'vertical':
    case 'gamesStarted':
    case 'gamesPlayed':
    case 'completions':
    case 'attempts':
    case 'passingYards':
    case 'touchdownsThrown':
    case 'interceptionsThrown':
    case 'kickoffYards':
    case 'averageKickoff':
    case 'touchBacks':
    case 'totalPuntYards':
    case 'averagePunt':
    case 'fieldGoalPercentage':
    case 'carries':
    case 'rushingYards':
    case 'rushingTouchdowns':
    case 'receptions':
    case 'receivingYards':
    case 'receivingTouchdowns':
    case 'soloTackles':
    case 'totalTackles':
    case 'sacks':
    case 'tacklesForLoss':
    case 'interceptions':
    case 'gpa':
    case 'sat':
    case 'act':
    case 'coreGpa':
    case 'emotionalIntelBehavior':
    case 'emotionalIntelReflection':
    case 'emotionalIntelTeamWork':
    case 'emotionalIntelRelationships':
    case 'emotionalIntelAccountability':
    case 'emotionalIntelResponsibility':
    case 'emotionalIntelIndependence':
    case 'twitterFollowers':
    case 'newsMediaCoverageMentions':
    case 'pressReleaseSentimentCounter':
    case 'coreAttributesPersistence':
    case 'coreAttributesWorkEthic':
    case 'coreAttributesTeamOrientation':
    case 'coreAttributesMastery':
    case 'coreAttributesCompetitiveness':
    case 'coreAttributesOverallScore':
      if (value <= 0) return null;
      return value;
    default:
      return value;
  }
}

module.exports = function normalizeJson(json) {
  for (let key in json) {
    if (!json.hasOwnProperty(key)) continue;
    const normkey = normalizeKey(key);
    var value = json[key];
    delete json[key];
    json[normkey] = normalizeValue(value, key);
  }
};
