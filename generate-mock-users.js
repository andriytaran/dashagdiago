const axios = require('axios');
const bluebird = require('bluebird');
const app = require('./server/server');

const User = app.models.user;

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

const verifyUsers = (docs) => {
  return bluebird.mapSeries(docs, user => axios.get(`http://0.0.0.0:3000/api/users/confirm?uid=${user._id}&redirect=%2Flogin&token=${user.verificationToken}`));
};

const fillDb = (mockUsers) => {
  return bluebird.mapSeries(mockUsers, user => {
    return User.create(user)
      .then(()=>console.log(user.email, 'was created'))
      .catch(err => console.error(err.message));
  });
};

return fillDb(mockUsers)
  .then(() => console.log('finished'))
  // .then(users => verifyUsers(users))
  .catch(err => console.error(err));
