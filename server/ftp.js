'use strict';
const Client = require('ssh2-sftp-client');
const fs = require('fs');
const csv = require('csvtojson');
const es = require('./boot/es');
const defaults = require('./boot/defaults');
const { positionF } = defaults;

const parseCsv = (content) => {
  return csv()
    .fromString(content)
    .then((jsonObj) => {
      return jsonObj;
    });
};

const importPlayersData = (body) => {
  const sftp = new Client();
  const { shortNameSchool, nameSchool, fileName } = body;

  const path =  (fileName || '').split('/');
  const nameForSaving = path[path.length - 1];

  return sftp.connect({
      host: 'host1.gallup.com',
      username: 'menza',
      password: 'KC1002#18',
    })
    .then(() => {
      if (fileName){
        return sftp.fastGet(fileName, `./imports/${nameForSaving}`);
      }
    })
    .then(() => {
      let pathToFile = 'Menza_Althete_Results 03-21-2019.csv';
      if (fileName){
        pathToFile = nameForSaving;
      }
      const contents = fs.readFileSync(`./imports/${pathToFile}`, 'utf8');
      return parseCsv(contents);
    })
    .then(async players => {
      const schoolId = shortNameSchool.toLowerCase().replace(/ /gi, '');
      await es.addDocument('schools', schoolId, 'post', {
        fullName: nameSchool,
        shortName: shortNameSchool,
        id: schoolId,
      });

      for (const elem of positionF) {
        await es.addDocument(schoolId + '-benchmarks', elem.id, 'post', {
          position: elem.value,
          coreAttributesPersistence: 1,
          coreAttributesWorkEthic: 1,
          coreAttributesTeamOrientation: 1,
          coreAttributesMastery: 1,
          coreAttributesCompetitiveness: 1,
          coreAttributesOverallScore: 1,

          forty: 1,
          vertical: 1,
          gamesPlayed: 1,
          gamesStarted: 1,
          height: 1,
          weight: 1,
          emotionalIntelBehavior: 1,
          emotionalIntelReflection: 1,
          emotionalIntelTeamWork: 1,
          emotionalIntelRelationships: 1,
          emotionalIntelAccountability: 1,
          emotionalIntelResponsibility: 1,
          emotionalIntelIndependence: 1,
          gpa: 1,
          sat: 1,
          act: 1,
          coreGpa: 1,
          socialTwitterSentiment: 1,
          twitterFollowers: 1,
          socialInstagramSentiment: 1,
          instagramFollowers: 1,
          facebookSentiment: 1,
          newsMediaCoverageSentiment: 1,
          newsMediaCoverageMentions: 1,
          newsMediaCoverageNational: 1,
          newsMediaCoverageRegional: 1,
          pressReleaseSentiment: 1,
          pressReleaseSentimentCounter: 1,
        });
      }

      await es.addDocument(schoolId + '-pillars', 1, 'post', defaults.pillarsObj);

      let playerId = 1;
      for (const elem of players) {
        const player = {
          id: playerId++,
          position: elem.Position,
          fname: elem.Name.split(', ')[0],
          lname: elem.Name.split(', ')[1],
          // collegeYear: elem.Year || "Senior",
          coreAttributesCompetitiveness: parseFloat(elem.Competitiveness),
          coreAttributesPersistence: parseFloat(elem.Persistence),
          coreAttributesWorkEthic: parseFloat(elem['Work Ethic']),
          coreAttributesTeamOrientation: parseFloat(elem['Team Orientation']),
          coreAttributesMastery: parseFloat(elem.Mastery),
          coreAttributesOverallScore: parseFloat(elem.Score),
          highschoolGraduationYear: parseFloat(elem.highschoolGraduationYear),
          reportLink: elem['REPORT LINK'] || '',
        };
        await es.addPlayer(schoolId, player);
      }
    });
};

module.exports = {
  importPlayersData,
};
