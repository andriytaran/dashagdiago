const attributesNamesMatches = {
  coreAttributesCompetitiveness: 'Competitiveness',
  coreAttributesMastery: 'Mastery',
  coreAttributesPersistence: 'Persistence',
  coreAttributesTeamOrientation: 'Team Orientation',
  coreAttributesWorkEthic: 'Work Ethic',
};

const positions = [
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
]

const getFullNamePosition = (shortName) =>{
  const position = positions.find(elem => elem.value.toLowerCase() === shortName.toLowerCase());

  if (position) {
    return position.title || shortName
  }

  return shortName

}

const getPositionValueOnSelect = (value) => {
  return positions.reduce(function(acc, elem){
    if (elem.title === value){
      acc = elem.value
    }
    return acc
  }, 'QB');
};

const updateHeaderLinks = () =>{
  const urlParams = new URLSearchParams(window.location.search);
  const highschoolGraduationYear = (urlParams.get("highschoolGraduationYear") || "").toUpperCase() || "ALL";

  $('#benchmark-input-link').html(`<a class="header__nav-link" href="/benchmark-input?highschoolGraduationYear=${highschoolGraduationYear}">Benchmark-input</a>`);
  $('#add-new-athlete-link').html(`<a class="header__nav-link" href="/addnewathlete?highschoolGraduationYear=${highschoolGraduationYear}">Add new Athlete info</a>`);

}


