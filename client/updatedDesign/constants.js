const attributesNamesMatches = {

  position: "Position",

  // New Athlete Info Input
  fname: "First name",
  lname: "Last name",
  school: "School",
  hometown: "Hometown",
  state: "State",
  highschoolGraduationYear: "Highschool Graduation Year",
  collegeYear: "College Year",
  multisportAthlete: "Multisport Athlete",
  momParent: "Mom Parent",
  dadParent: "Dad Parent",
  grandmotherParent: "Grandmother Parent",
  grandfatherParent: "Grandfather Parent",
  twitter: "Twitter",
  instagram: "Instagram",
  facebook: "Facebook",
  snapchat: "Snapchat",

  // Academic Info
  sat: "SAT",
  act: "ACT",
  gpa: "GPA",
  coreGpa: "Core GPA",

  // Core Attributes Info
  coreAttributesCompetitiveness: 'Competitiveness',
  coreAttributesMastery: 'Mastery',
  coreAttributesPersistence: 'Persistence',
  coreAttributesTeamOrientation: 'Team Orientation',
  coreAttributesWorkEthic: 'Work Ethic',
  coreAttributesOverallScore: "core Attributes Overall Score",

  // Athletic Info
  gamesPlayed: "Games played",
  gamesStarted: "Games started",
  carries: "Carries",
  rushingYards: "Rushing Yards",
  rushingTouchdowns: "Rushing Touchdowns",
  completions: "Completions",
  attempts: "Attempts",
  interceptionsThrown: "Interceptions Thrown",
  touchdownsThrown: "Touchdowns Thrown",
  passingYards: "Passing Yards",
  receptions: "Receptions",
  sacks: "Sacks",
  soloTackles: "Solo Tackles",
  tacklesForLoss: "Tackles For Loss",
  totalTackles: "Total Tackles",
  forty: "40 yd Time",
  vertical: "Vertical Jump",
  weight: "Weight",
  height: "Height",

  // there are no these attr on addnewathlete page
  kickoffYards: "Kickoff Yards",
  averageKickoff: "Average Kickoff",
  touchBacks: "Touch Backs",
  totalPuntYards: "Total Punt Yards",
  averagePunt: "Average Punt",
  fieldGoalPercentage: "Field Goal Percentage",
  receivingYards: "Receiving Yards",
  recievingTouchdowns: "Recieving Touchdowns",
  offenseDefense: "Offense defense",
  guardian: "Guardian",
  interceptions: "Interceptions",

  // Emotional Info
  emotionalIntelAccountability: "Emotional Intel Accountability",
  emotionalIntelBehavior: "Emotional Intel Behavior",
  emotionalIntelIndependence: "Emotional Intel Independence",
  emotionalIntelReflection: "Emotional Intel Reflection",
  emotionalIntelRelationships: "Emotional Intel Relationships",
  emotionalIntelResponsibility: "Emotional Intel Responsibility",
  emotionalIntelTeamWork: "Emotional Intel TeamWork",

  // Social profile Info
  facebookSentiment: "Facebook Sentiment",
  instagramFollowers: "Instagram Followers",
  newsMediaCoverageMentions: "News Media Coverage Mentions",
  newsMediaCoverageRegional: "News Media Coverage Regional",
  newsMediaCoverageSentiment: "News Media Coverage Sentiment",
  newsMediaCoverageNational: "News Media Coverage National",
  pressReleaseSentiment: "Press Release Sentiment",
  pressReleaseSentimentCounter: "Press Release Sentiment Counter",
  socialInstagramSentiment: "Social Instagram Sentiment",
  socialTwitterSentiment: "Social Twitter Sentiment",
  twitterFollowers: "Twitter Followers",

  // pillars names (not player attributes - just for displaying on dashboard-player page and dashboard-position page)
  athletic: "Athletic Attributes",
  coreAttributes: "Core Attributes",
  emotionalIntel: "Emotional Intel Attributes",
  academic: "Academic Attributes",
  socialProfile: "Social Profile Attributes",
};

const getAttrName = (shortName) => attributesNamesMatches[shortName] || shortName;

const orderOfAttr = Object.keys(attributesNamesMatches);

const sortAttr = (values)=>{
  return values.sort((a,b) => {
    if(orderOfAttr.indexOf(a) < orderOfAttr.indexOf(b)) { return -1; }
    if(orderOfAttr.indexOf(a) > orderOfAttr.indexOf(b)) { return 1; }
    return 0;
  })
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
];

const getFullNamePosition = (shortName) =>{
  const position = positions.find(elem => elem.value.toLowerCase() === shortName.toLowerCase());

  if (position) {
    return position.title || shortName
  }

  return shortName

};

const getPositionValueOnSelect = (value) => {
  return positions.reduce(function(acc, elem){
    if (elem.title === value){
      acc = elem.value
    }
    return acc
  }, 'QBPRO');
};

const updateHeaderLinks = () =>{
  const urlParams = new URLSearchParams(window.location.search);
  const highschoolGraduationYear = (urlParams.get("highschoolGraduationYear") || "").toUpperCase() || "ALL";

  $('#benchmark-input-link').html(`<a class="header__nav-link" href="/benchmark-input?highschoolGraduationYear=${highschoolGraduationYear}">Benchmark-input</a>`);
  $('#add-new-athlete-link').html(`<a class="header__nav-link" href="/addnewathlete?highschoolGraduationYear=${highschoolGraduationYear}">Add new Athlete info</a>`);

};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
