const attributesNamesMatches = {
  fname: "First name",
  lname: "Last name",
  twitter: "twitter",
  instagram: "instagram",
  snapchat: "snapchat",
  position: "position",
  offenseDefense: "offense defense",
  facebook: "facebook",
  school: "school",
  hometown: "hometown",
  state: "state",
  height: "height",
  weight: "weight",
  highschoolGraduationYear: "highschool Graduation Year",
  collegeYear: "college Year",
  momParent: "mom Parent",
  dadParent: "dad Parent",
  grandmotherParent: "grandmother Parent",
  grandfatherParent: "grandfather Parent",
  guardian: "guardian",
  multisportAthlete: "multisport Athlete",
  forty: "forty",
  vertical: "vertical",
  gamesStarted: "games started",
  gamesPlayed: "games played",
  completions: "completions",
  attempts: "attempts",
  passingYards: "passing Yards",
  touchdownsThrown: "touchdowns Thrown",
  interceptionsThrown: "interceptions Thrown",
  kickoffYards: "kickoff Yards",
  averageKickoff: "average Kickoff",
  touchBacks: "touch Backs",
  totalPuntYards: "total Punt Yards",
  averagePunt: "average Punt",
  fieldGoalPercentage: "field Goal Percentage",
  carries: "carries",
  rushingYards: "rushing Yards",
  rushingTouchdowns: "rushing Touchdowns",
  receptions: "receptions",
  receivingYards: "receiving Yards",
  recievingTouchdowns: "recieving Touchdowns",
  soloTackles: "solo Tackles",
  totalTackles: "total Tackles",
  sacks: "sacks",
  tacklesForLoss: "tackles For Loss",
  interceptions: "interceptions",
  gpa: "gpa",
  sat: "sat",
  act: "act",
  coreGpa: "core Gpa",
  emotionalIntelBehavior: "emotional Intel Behavior",
  emotionalIntelReflection: "emotional Intel Reflection",
  emotionalIntelTeamWork: "emotional Intel TeamWork",
  emotionalIntelRelationships: "emotional Intel Relationships",
  emotionalIntelAccountability: "emotional Intel Accountability",
  emotionalIntelResponsibility: "emotional Intel Responsibility",
  emotionalIntelIndependence: "emotional Intel Independence",
  socialTwitterSentiment: "social Twitter Sentiment",
  twitterFollowers: "twitter Followers",
  socialInstagramSentiment: "social Instagram Sentiment",
  instagramFollowers: "instagram Followers",
  facebookSentiment: "facebook Sentiment",
  newsMediaCoverageSentiment: "news Media Coverage Sentiment",
  newsMediaCoverageMentions: "news Media Coverage Mentions",
  newsMediaCoverageNational: "news Media Coverage National",
  newsMediaCoverageRegional: "news Media Coverage Regional",
  pressReleaseSentiment: "press Release Sentiment",
  pressReleaseSentimentCounter: "press Release SentimentCounter",
  coreAttributesCompetitiveness: 'Competitiveness',
  coreAttributesMastery: 'Mastery',
  coreAttributesPersistence: 'Persistence',
  coreAttributesTeamOrientation: 'Team Orientation',
  coreAttributesWorkEthic: 'Work Ethic',
  coreAttributesOverallScore: "core Attributes Overall Score",

  academic: "Academic Attributes",
  athletic: "Athletic Attributes",
  coreAttributes: "Core Attributes",
  emotionalIntel: "Emotional Intel Attributes",
  socialProfile: "Social Profile Attributes",
};

const getAttrName = (shortName) => attributesNamesMatches[shortName] || shortName;

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


