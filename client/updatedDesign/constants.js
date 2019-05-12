const attributesNamesMatches = {
  fname: "First name",
  lname: "Last name",
  twitter: "Twitter",
  instagram: "Instagram",
  snapchat: "Snapchat",
  position: "Position",
  offenseDefense: "Offense defense",
  facebook: "Facebook",
  school: "School",
  hometown: "Hometown",
  state: "State",
  height: "Height",
  weight: "Weight",
  highschoolGraduationYear: "Highschool Graduation Year",
  collegeYear: "College Year",
  momParent: "Mom Parent",
  dadParent: "Dad Parent",
  grandmotherParent: "Grandmother Parent",
  grandfatherParent: "Grandfather Parent",
  guardian: "Guardian",
  multisportAthlete: "Multisport Athlete",
  forty: "40 yd Time",
  vertical: "Vertical Jump",
  gamesStarted: "Games started",
  gamesPlayed: "Games played",
  completions: "Completions",
  attempts: "Attempts",
  passingYards: "Passing Yards",
  touchdownsThrown: "Touchdowns Thrown",
  interceptionsThrown: "Interceptions Thrown",
  kickoffYards: "Kickoff Yards",
  averageKickoff: "Average Kickoff",
  touchBacks: "Touch Backs",
  totalPuntYards: "Total Punt Yards",
  averagePunt: "Average Punt",
  fieldGoalPercentage: "Field Goal Percentage",
  carries: "Carries",
  rushingYards: "Rushing Yards",
  rushingTouchdowns: "Rushing Touchdowns",
  receptions: "Receptions",
  receivingYards: "Receiving Yards",
  recievingTouchdowns: "Recieving Touchdowns",
  soloTackles: "Solo Tackles",
  totalTackles: "Total Tackles",
  sacks: "Sacks",
  tacklesForLoss: "Tackles For Loss",
  interceptions: "Interceptions",
  gpa: "GPA",
  sat: "SAT",
  act: "ACT",
  coreGpa: "Core GPA",
  emotionalIntelBehavior: "Emotional Intel Behavior",
  emotionalIntelReflection: "Emotional Intel Reflection",
  emotionalIntelTeamWork: "Emotional Intel TeamWork",
  emotionalIntelRelationships: "Emotional Intel Relationships",
  emotionalIntelAccountability: "Emotional Intel Accountability",
  emotionalIntelResponsibility: "Emotional Intel Responsibility",
  emotionalIntelIndependence: "Emotional Intel Independence",
  socialTwitterSentiment: "Social Twitter Sentiment",
  twitterFollowers: "Twitter Followers",
  socialInstagramSentiment: "Social Instagram Sentiment",
  instagramFollowers: "Instagram Followers",
  facebookSentiment: "Facebook Sentiment",
  newsMediaCoverageSentiment: "News Media Coverage Sentiment",
  newsMediaCoverageMentions: "News Media Coverage Mentions",
  newsMediaCoverageNational: "News Media Coverage National",
  newsMediaCoverageRegional: "News Media Coverage Regional",
  pressReleaseSentiment: "Press Release Sentiment",
  pressReleaseSentimentCounter: "Press Release SentimentCounter",
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


