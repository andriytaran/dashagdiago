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
};

const positionF = [
  { title: 'Quarterback', value: 'QB', id: 1 },
  { title: 'Running Back', value: 'RB', id: 2 },
  { title: 'Tight End', value: 'TE', id: 3 },
  { title: 'Wide Receiver', value: 'WR', id: 4 },
  { title: 'Punter', value: 'P', id: 5 },
  { title: 'Kicker', value: 'K', id: 6 },
  { title: 'Defensive Back', value: 'DB', id: 7 },
  { title: 'Defensive End', value: 'DE', id: 8 },
  { title: 'Defensive Tackle', value: 'DT', id: 9 },
  { title: 'Defensive Line', value: 'DL', id: 10 },
  { title: 'Long Snapper', value: 'LS', id: 11 },
  { title: 'Offensive Line', value: 'OL', id: 12 },
  { title: 'Linebacker', value: 'LB', id: 13 },
  { title: 'Corner Back', value: 'CB', id: 14 },
  { title: 'Offensive Guard', value: 'OG', id: 15 },
  { title: 'Offensive Tackler', value: 'OT', id: 16 },
  { title: 'Safety', value: 'S', id: 17 },
];

module.exports = {
  pillarsObj,
  positionF,
};
