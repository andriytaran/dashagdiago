const jwt = require('express-jwt');
const config = {
  auth: {
    saltRound: 10,
    secret: 'secret',
  }
};

const getTokenFromHeaders = (req) => {
  const jwtCookie = req.cookies && req.cookies.jwt;
  if (jwtCookie) {
    return jwtCookie;
  }
  return null;
};

const auth = jwt({
  secret: config.auth.secret,
  // userProperty: 'payload',
  getToken: getTokenFromHeaders,
  credentialsRequired: true,
});

module.exports = auth;
