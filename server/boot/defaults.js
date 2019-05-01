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
    },
  },
  'emotionalIntel': {
    factor: 5,
    agdiagoFactor: 5,
    fields: {
      '_all': {
        'emotionalIntelBehavior': {factor: 10},
        'emotionalIntelReflection': {factor: 10},
        'emotionalIntelTeamWork': {factor: 10},
        'emotionalIntelRelationships': {factor: 10},
        'emotionalIntelAccountability': {factor: 10},
        'emotionalIntelResponsibility': {factor: 10},
        'emotionalIntelIndependence': {factor: 10},
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
  'socialProfile': {
    factor: 5,
    agdiagoFactor: 5,
    fields: {
      '_all': {
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
  },
};

const positionF = [
  {title: 'Quarterback', value: 'QB'},
  {title: 'Quarterback Pro Style', value: 'QBPRO'},
  {title: 'Quarterback Dual Style', value: 'QBDUAL'},
  {title: 'Running Back', value: 'RB'},
  {title: 'Wide Receiver', value: 'WR'},
  {title: 'Offensive Line', value: 'OL'},
  {title: 'Defensive Line', value: 'DL'},
  {title: 'Tight End', value: 'TE'},
  {title: 'Linebacker', value: 'LB'},
  {title: 'Corner Back', value: 'CB'},
  {title: 'Kicker', value: 'K'},
  {title: 'Defensive End', value: 'DE'},
  {title: 'Defensive Tackle', value: 'DT'},
  {title: 'Offensive Guard', value: 'OG'},
  {title: 'Offensive Tackler', value: 'OT'},
  {title: 'Defensive Back', value: 'DB'},
  {title: 'Punter', value: 'P'},
  {title: 'Safety', value: 'S'},
  {title: 'Long Snapper', value: 'LS'},
  {title: 'Inside Linebacker', value: 'ILB'},
  {title: 'Middle Linebacker', value: 'MLB'},
  {title: 'Outside Linebacker', value: 'OLB'},
];

module.exports = {
  pillarsObj,
  positionF,
};
