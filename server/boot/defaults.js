const pillarsObj = {
  'coreAttributes': {
    factor: 25,
    agdiagoFactor: 25,
    fields: {
      '_all': {
        'coreAttributesCompetitiveness': {factor: 10},
        'coreAttributesPersistence': {factor: 10},
        'coreAttributesWorkEthic': {factor: 10},
        'coreAttributesTeamOrientation': {factor: 10},
        'coreAttributesMastery': {factor: 10},
      },
    },
  },
  'athletic': {
    factor: 55,
    agdiagoFactor: 50,
    fields: {
      '_all': {
        'forty': {factor: 5},
        'vertical': {factor: 5},
        'gamesPlayed': {factor: 5},
        'gamesStarted': {factor: 5},
        'height': {factor: 5},
        'weight': {factor: 1},
        'carries': {factor: 5},
        'rushingYards': {factor: 5},
        'rushingTouchdowns': {factor: 5},
        'completions': {factor: 5},
        'attempts': {factor: 5},
        'interceptionsThrown': {factor: 5},
        'touchdownsThrown': {factor: 5},
        'passingYards': {factor: 5},
        'receptions': {factor: 5},
        'sacks': {factor: 5},
        'soloTackles': {factor: 5},
        'tacklesForLoss': {factor: 5},
        'totalTackles': {factor: 5},
      },
    },
  },
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
};

const positionF = [
  {title: 'Quarterback Pro Style', value: 'QBPRO'},
  {title: 'Quarterback Dual Style', value: 'QBDUAL'},
  {title: 'Running Back', value: 'RB'},
  {title: 'Wide Receiver', value: 'WR'},
  {title: 'Tight End', value: 'TE'},
  {title: 'Offensive Tackle', value: 'OT'},
  {title: 'Offensive Guard', value: 'OG'},
  {title: 'Defensive End', value: 'DE'},
  {title: 'Defensive Tackle', value: 'DT'},
  {title: 'Outside Linebacker', value: 'OLB'},
  {title: 'Inside Linebacker', value: 'ILB'},
  {title: 'Middle Linebacker', value: 'MLB'},
  {title: 'Defensive Back', value: 'DB'},
  {title: 'Safety', value: 'S'},
  {title: 'Punter', value: 'P'},
  {title: 'Kicker', value: 'K'},
  {title: 'Long Snapper', value: 'LS'},
];

module.exports = {
  pillarsObj,
  positionF,
};
