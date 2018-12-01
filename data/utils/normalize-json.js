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
    default:
      return res;
  }
}

function normalizeValue(value) {
  if (value == null) return null;
  if (value === '') return null;
  return value;
}

module.exports = function normalizeJson(json) {
  for (let key in json) {
    if (!json.hasOwnProperty(key)) continue;
    const normkey = normalizeKey(key);
    var value = json[key];
    delete json[key];
    json[normkey] = normalizeValue(value);
  }
};
