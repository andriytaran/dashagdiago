"use strict";

const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

const config = {
  auth: {
    saltRound: 10,
    secret: 'secret',
  }
};

const createUser = (body) => {
  const salt = bcrypt.genSaltSync(config.auth.saltRound);
  return {
    email: body.email.toLowerCase(),
    encrypted_password: bcrypt.hashSync(body.password, salt),
    role: body.role,
    school: body.school,
    id: body.id
  }
};

const generateJWT = (user) => {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign({
    email: user.email.toLowerCase(),
    role: user.role,
    school: user.school,
    id: user.id,
    exp: parseInt(expirationDate.getTime() / 1000, 10),
  }, config.auth.secret);
};

const comparePassword = (user, password) => {
  return bcrypt.compareSync(password, user.encrypted_password);
};

module.exports = {
  createUser,
  generateJWT,
  comparePassword,
};
