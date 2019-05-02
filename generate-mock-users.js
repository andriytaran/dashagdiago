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
  {
    email: 'coach3@gmail.com',
    password: '1',
    role: 'coach',
    school: 'ts2',
  },
];

const fillDb = (mockUsers) => {
  return bluebird.mapSeries(mockUsers, user => {
    return User.create(user)
      .then(() => console.log(user.email, 'was created'))
      .catch(err => console.error(err.message));
  });
};

return fillDb(mockUsers)
  .then(() => console.log('finished'))
  .then(() => process.exit())
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
