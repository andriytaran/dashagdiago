'use strict';
const Client = require('ssh2-sftp-client');
const fs = require('fs');
const csv = require('csvtojson');

const parseCsv = (content) => {
  // const content = fs.readFileSync(fileName, 'utf8');
  return csv()
    .fromString(content)
    .then((jsonObj) => {
      return jsonObj;
    });
};

const importPlayersData = (schoolName) => {
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
      var contents = fs.readFileSync(`./imports/${schoolName}.csv`, 'utf8');
      // console.log(contents);
      return parseCsv(contents);
    });
};

module.exports = {
  parseCsv,
  importPlayersData,
};
