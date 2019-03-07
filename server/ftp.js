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

  return sftp.connect({
      host: 'host1.gallup.com',
      username: 'menza',
      password: 'KC1002#18',
    })
    // TODO uncomment for FTP
    // .then(() => {
    //
    //   return sftp.list('/ToMenza');
    // })
    // .then(res => {
    //   const lastModifiedFile = res.reduce((acc, elem) => {
    //     if (!acc) {
    //       acc = elem;
    //     }
    //     if (elem.modifyTime > acc.modifyTime) {
    //       acc = elem;
    //     }
    //     return acc;
    //   });
    //   return lastModifiedFile.name;
    // })
    // .then(fileName => {
    //   // console.log(fileName);
    //   return sftp.fastGet('/ToMenza/Menza_Althete_Results 02-21-2019.csv',
    // `./imports/${schoolName}.csv`);
    // })
    .then(() => {
      const { fileName = 'csv adjango.csv' } = body;
      const contents = fs.readFileSync(`./imports/${fileName}`, 'utf8');
      return parseCsv(contents);
    })
    .then(async players => {
      const { shortNameSchool, nameSchool } = body;
      const schoolId = shortNameSchool.toLowerCase();
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
        });
      }
      await es.addDocument(schoolId + '-pillars', 1, 'post', defaults.pillarsObj);

      let playerId = 1;
      for (const elem of players) {
        const player = {
          id: playerId++,
          position: elem.Postion,
          fname: elem.Fname,
          lname: elem.lname,
          collegeYear: elem.Year,
          coreAttributesCompetitiveness: parseFloat(elem.Competitiveness),
          coreAttributesPersistence: parseFloat(elem.Persistence),
          coreAttributesWorkEthic: parseFloat(elem['Work Ethic']),
          coreAttributesTeamOrientation: parseFloat(elem['Team Orientation']),
          coreAttributesMastery: parseFloat(elem.Mastery),
          coreAttributesOverallScore: parseFloat(elem.Score),
          reportLink: elem['Report Link'],
        };
        await es.addPlayer(schoolId, player);
      }
    });
};

module.exports = {
  importPlayersData,
};
