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
    agdiagoFactor: 50,
    fields: {
      '_all': {
        'forty': {
          reverse: true,
          factor: 10,
        },
        'vertical': {factor: 5},
        'gamesPlayed': {factor: 5},
        'gamesStarted': {factor: 5},
        'height': {factor: 5},
        'weight': {factor: 1},
      },
      'dl': {
        'forty': {
          reverse: true,
          factor: 10,
        },
        'vertical': {factor: 5},
        'gamesPlayed': {factor: 5},
        'gamesStarted': {factor: 5},
        'height': {factor: 5},
        'weight': {factor: 1},

        // 'soloTackles': {factor: 10},
        // 'totalTackles': {factor: 10},
        // 'sacks': {factor: 10},
        // 'tacklesForLoss': {factor: 10},
        // 'interceptions': {factor: 10},
      },
      'lb': {
        'forty': {
          reverse: true,
          factor: 10,
        },
        'vertical': {factor: 5},
        'gamesPlayed': {factor: 5},
        'gamesStarted': {factor: 5},
        'height': {factor: 5},
        'weight': {factor: 1},

        // 'soloTackles': {factor: 10},
        // 'totalTackles': {factor: 10},
        // 'sacks': {factor: 10},
        // 'tacklesForLoss': {factor: 10},
        // 'interceptions': {factor: 10},
      },
      'qb': {
        'forty': {
          reverse: true,
          factor: 10,
        },
        'vertical': {factor: 5},
        'gamesPlayed': {factor: 5},
        'gamesStarted': {factor: 5},
        'height': {factor: 5},
        'weight': {factor: 1},

        // 'completions': {factor: 5},
        // 'passingYards': {factor: 5},
        // 'touchdownsThrown': {factor: 5},
        // 'interceptionsThrown': {factor: 5},
        // // TODO: check carries in UI
        // 'carries': {factor: 5},
        // 'rushingYards': {factor: 5},
        // 'rushingTouchdowns': {factor: 5},
      },
      'rb': {
        'forty': {
          reverse: true,
          factor: 10,
        },
        'vertical': {factor: 10},
        'gamesPlayed': {factor: 2},
        'gamesStarted': {factor: 2},
        'height': {factor: 5},
        'weight': {factor: 1},

        // 'carries': {factor: 10},
        // 'rushingYards': {factor: 10},
        // 'rushingTouchdowns': {factor: 10},
        // 'receptions': {factor: 10},
        // 'receivingYards': {factor: 10},
      },
    },
  },
  // 'emotionalIntel': {
  //   factor: 5,
  //   agdiagoFactor: 5,
  //   fields: {
  //     '_all': {
  //       'emotionalIntelBehavior': {factor: 10},
  //       'emotionalIntelReflection': {factor: 10},
  //       'emotionalIntelTeamWork': {factor: 10},
  //       'emotionalIntelRelationships': {factor: 10},
  //       'emotionalIntelAccountability': {factor: 10},
  //       'emotionalIntelResponsibility': {factor: 10},
  //       'emotionalIntelIndependence': {factor: 10},
  //     },
  //   },
  // },
  'academic': {
    factor: 10,
    agdiagoFactor: 15,
    fields: {
      '_all': {
        'gpa': {factor: 10},
        'sat': {factor: 10},
        'act': {factor: 10},
        'coreGpa': {factor: 10},
      },
    },
  },
  // 'socialProfile': {
  //   factor: 5,
  //   agdiagoFactor: 5,
  //   fields: {
  //     '_all': {
  //       'socialTwitterSentiment': {factor: 10},
  //       'twitterFollowers': {factor: 10},
  //       'socialInstagramSentiment': {factor: 10},
  //       'instagramFollowers': {factor: 10},
  //       'facebookSentiment': {factor: 10},
  //       'newsMediaCoverageSentiment': {factor: 10},
  //       'newsMediaCoverageMentions': {factor: 10},
  //       'newsMediaCoverageNational': {factor: 10},
  //       'newsMediaCoverageRegional': {factor: 10},
  //       'pressReleaseSentiment': {factor: 10},
  //       'pressReleaseSentimentCounter': {factor: 10},
  //     },
  //   },
  // },
  // 'coreAttributes': {
  //   factor: 25,
  //   agdiagoFactor: 25,
  //   fields: {
  //     '_all': {
  //       'coreAttributesCompetitiveness': {factor: 10},
  //       'coreAttributesPersistence': {factor: 10},
  //       'coreAttributesWorkEthic': {factor: 10},
  //       'coreAttributesTeamOrientation': {factor: 10},
  //       'coreAttributesMastery': {factor: 10},
  //     },
  //   },
  // },
};

function getParentPosition(position) {
  if (position === '_all') return null;
  const parentPosition = positionsHierarchyReversed[position] || '_all';
  return parentPosition;
}

function getPillarAttributes(pillar, position, visited = {}) {
  if (position === null) {
    position = '_all';
  }

  const attributes = R.compose(
    R.uniq,
    R.flatten,
    position ? R.compose(
      R.keys,
      R.pathOr({}, [pillar, 'fields', position])
    ) : R.compose(
      R.values,
      R.map(R.keys),
      R.path([pillar, 'fields'])
    )
  )(pillarsObj);

  if (attributes.length || !position) {
    return attributes;
  } else {
    visited[position] = true;
    const parentPosition = getParentPosition(position);
    if (!parentPosition) return attributes;
    if (visited[parentPosition]) return attributes;
    return getPillarAttributes(pillar, parentPosition, visited);
  }
}

function getPillarsAttributes(pillars) {
  return R.compose(
    R.uniq,
    R.flatten,
    R.map(getPillarAttributes)
  )(pillars);
}

function calculatePlayerScores(player, programBenchmarks) {
  const position = player.position;
  const benchmark = programBenchmarks.positions[position];
  if (!benchmark) return R.map(() => null, pillarsObj);

  const scores = R.map(() => 0, pillarsObj);
  const factors = R.map(() => 0, pillarsObj);
  for (let attribute in benchmark) {
    const value = player[attribute];
    if (value == null) continue;

    const programValue = benchmark[attribute].value;
    if (programValue == null) continue;

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
    // HACK: until client fixes calculation
    return totalScore / 100;
    // return totalScore / totalFactor;
  }
}

function normalizeProgramBenchmarks(programBenchmarks) {
  Object.entries(positionsHierarchyReversed)
    .forEach(([position, parentPosition]) => {
      if (programBenchmarks.positions[position]) return;
      if (programBenchmarks.positions[parentPosition]) {
        programBenchmarks.positions[position] =
          programBenchmarks.positions[parentPosition];
      } else {
        programBenchmarks.positions[position] =
          programBenchmarks.positions['_all'];
      }
    });
}

module.exports = {
  positionsHierarchy,
  pillarsObj,
  getParentPosition,
  getPillarAttributes,
  getPillarsAttributes,
  calculatePlayerScores,
  calculatePlayerOverallScore,
  normalizeProgramBenchmarks,
};
