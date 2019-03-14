const MongoClient = require('mongodb').MongoClient;
const axios = require('axios');
const bluebird = require('bluebird');
const url = 'mongodb://localhost:27017';
const dbName = 'dashdjango';


const mockUsers = [
  {
    email: 'player1@gmail.com',
    password: '1',
    role: 'player',
    school: 'cincinnati',
    athleteId: 1,
  },
  {
    email: 'coach1@gmail.com',
    password: '1',
    role: 'coach',
    school: 'cincinnati',
  },
  {
    email: 'player2@gmail.com',
    password: '1',
    role: 'player',
    school: 'ts',
    athleteId: 7,
  },
  {
    email: 'coach2@gmail.com',
    password: '1',
    role: 'coach',
    school: 'ts',
  },
];

const getUsers = () => {
  return new Promise((resolve, reject) => {
    return MongoClient.connect(url, (err, client) => {
      console.log('Connected successfully to server');

      const db = client.db(dbName);
      const collection = db.collection('user');

      collection.find({}).toArray(function (err, docs) {
        if (err) {
          return reject(err);
        }
        return resolve(docs);
      });
      client.close();
    });
  });
};

const verifyUsers = (docs) => {
  return bluebird.mapSeries(docs, user => axios.get(`http://0.0.0.0:3000/api/users/confirm?uid=${user._id}&redirect=%2Flogin&token=${user.verificationToken}`));
};

const fillDb = (mockUsers) => {
  return bluebird.mapSeries(mockUsers, user => axios.post('http://localhost:3000/api/users', user));
};

return fillDb(mockUsers)
  // .then(() => getUsers())
  // .then(users => verifyUsers(users))
  .catch(err => console.error(err));
