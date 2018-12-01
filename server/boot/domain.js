'use strict';

const R = require('ramda');

const positionsHierarchy = {
  'dl': [
    'de',
    'dt',
  ],
  'ol': [
    'og',
    'oc',
    'ot',
    'ls',
  ],
  'st': [
    'p',
    'k',
  ],
  'db': [
    'cb',
    's',
  ],
  // HACK: until client fixes data
  'cb': [
    'db',
    's',
  ],
  'qb': [
    'qbpro',
    'qbdual',
  ],
  'lb': [
    'ilb',
    'olb',
    'mlb',
  ],
};

const positionsHierarchyReversed = {};
Object.entries(positionsHierarchy)
  .forEach(([parentPosition, childPositions]) => {
    childPositions.forEach(p => {
      positionsHierarchyReversed[p] = parentPosition;
    });
  });

const pillarsObj = {
  'athletic': {
    factor: 55,
    fields: {
      'forty': {
        reverse: true,
        factor: 10,
      },
      'vertical': {factor: 10},
      'carries': {factor: 10},
      'rushingYards': {factor: 10},
      'rushingTouchdowns': {factor: 10},
      'receptions': {factor: 10},
      'receivingYards': {factor: 10},
      'gamesPlayed': {factor: 10},
      'gamesStarted': {factor: 10},
      'height': {factor: 10},
      'weight': {factor: 10},
      'completions': {factor: 10},
      'passingYards': {factor: 10},
      'touchdownsThrown': {factor: 10},
      'interceptionsThrown': {factor: 10},
      'soloTackle': {factor: 10},
      'totalTackles': {factor: 10},
      'sacks': {factor: 10},
      'tacklesForLoss': {factor: 10},
    },
  },
  'emotionalIntel': {
    factor: 5,
    fields: {
      'emotionalIntelBehavior': {factor: 10},
      'emotionalIntelReflection': {factor: 10},
      'emotionalIntelTeamWork': {factor: 10},
      'emotionalIntelRelationships': {factor: 10},
      'emotionalIntelAccountability': {factor: 10},
      'emotionalIntelResponsibility': {factor: 10},
      'emotionalIntelIndependence': {factor: 10},
    },
  },
  'academic': {
    factor: 10,
    fields: {
      'gpa': {factor: 10},
      'sat': {factor: 10},
      'act': {factor: 10},
      'coreGpa': {factor: 10},
    },
  },
  'socialProfile': {
    factor: 5,
    fields: {
      'socialTwitterSentiment': {factor: 10},
      'twitterFollowers': {factor: 10},
      'socialInstagramSentiment': {factor: 10},
      'instagramFollowers': {factor: 10},
      'facebookSentiment': {factor: 10},
      'newsMediaCoverageSentiment': {factor: 10},
      'newsMediaCoverageMentions': {factor: 10},
      'newsMediaCoverageNational': {factor: 10},
      'newsMediaCoverageRegional': {factor: 10},
      'pressReleaseSentiment': {factor: 10},
      'pressReleaseSentimentCounter': {factor: 10},
    },
  },
  'coreAttributes': {
    factor: 25,
    fields: {
      'coreAttributesCompetitiveness': {factor: 10},
      'coreAttributesPersistence': {factor: 10},
      'coreAttributesWorkEthic': {factor: 10},
      'coreAttributesTeamOrientation': {factor: 10},
      'coreAttributesMastery': {factor: 10},
    },
  },
};

function calculatePlayerScores(player, programBenchmarks) {
  const position = player.position;
  const benchmark = programBenchmarks.positions[position];
  if (!benchmark) return R.map(() => null, pillarsObj);

  const scores = R.map(() => 0, pillarsObj);
  const factors = R.map(() => 0, pillarsObj);
  for (let attribute in benchmark) {
    const value = player[attribute];
    if (value == null || value <= 0) continue;

    const programValue = benchmark[attribute].value;
    if (programValue == null || programValue <= 0) continue;

    const reverse = benchmark[attribute].reverse;
    const factor = benchmark[attribute].factor;
    const pillar = benchmark[attribute].pillar;
    const score = reverse ?
      programValue / value :
      value / programValue;

    factors[pillar] += factor;
    scores[pillar] += score * factor;
  }

  for (let pillar in scores) {
    if (factors[pillar] === 0) {
      scores[pillar] = null;
    } else {
      scores[pillar] = 100 * scores[pillar] / factors[pillar];
    }
  }

  return scores;
}

function calculatePlayerOverallScore(playerScores, programBenchmarks) {
  let totalScore = 0;
  let totalFactor = 0;
  for (let pillar in playerScores) {
    const score = playerScores[pillar];
    if (score == null) continue;

    const factor = programBenchmarks.pillars[pillar].factor;
    totalScore += score * factor;
    totalFactor += factor;
  }

  if (totalFactor === 0) {
    return null;
  } else {
    return totalScore / totalFactor;
  }
}

function normalizeProgramBenchmarks(programBenchmarks) {
  Object.entries(positionsHierarchyReversed)
    .forEach(([position, parentPosition]) => {
      if (programBenchmarks.positions[position]) return;
      if (programBenchmarks.positions[parentPosition]) {
        programBenchmarks.positions[position] =
          programBenchmarks.positions[parentPosition];
      }
    });
}

module.exports = {
  pillarsObj,
  calculatePlayerScores,
  calculatePlayerOverallScore,
  normalizeProgramBenchmarks,
};
