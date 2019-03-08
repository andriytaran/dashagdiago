var http = require("http");
var loopback = require("loopback");
var path = require('path');
var app = require('../../server/server.js');
var os = require('os');
var fs = require('fs');
var needle = require('needle');
var request = require('request-promise');
var moment = require('moment');
var isUrl = require('is-url');
var moment = require('moment');
var domain = require('domain-regex');
const isReachable = require('is-reachable');
var URL = require('url-parse');
var dripObject = {};
var dripUrlCounts = {};
var app = require('../../server/server.js');
const dripClient = require('drip-nodejs')({
  token: '87b3a8382ad9d967fc3969d5879585c9',
  accountId: '9206564'
});

const es = require('../../server/boot/es.js');


var URL = require('url-parse');


module.exports = function (User) {

  // User.login = function (obj, model, fn) {
  //   console.log(obj);
  //   return fn(null, '45645464654654564');
  // };

  // User.login = async function (obj, name, fn) {
  //   console.log('login 2', obj);
  //   const user = await es.getUser(obj.email);
  //   console.log(user);
  //   fn(null, user)
  //   // if (user) {
  //   //   const token = auth.generateJWT(user);
  //   //   console.log(token);
  //   //   const isCorrectPassword = auth.comparePassword(user, password);
  //   //   if (isCorrectPassword) {
  //   //     res.cookie('jwt', token);
  //   //     return res.redirect('/');
  //   //   }
  //   // }es.getUser()
  //
  // };

  // User.create = function () {
  //
  // };

  // User.findOne = function (filter, cb) {
  //   return cb(null, {
  //     email: 'newdeveloper2019@gmail.com',
  //     password: '$2a$10$Adyi0BkJU629/5o7Jlu5lurAi3SZKFKYsbmBfPRwYwhOHkp0fA8va',
  //     id: 1,
  //   });
  // };

  User.sendWelcomeEmail = function (obj, cb) {
    if (obj.port != '443') {
      var baseUrl = obj.protocol + '://' + obj.host + ':' + obj.port;
    } else {
      var baseUrl = obj.protocol + '://' + obj.host;
    }
    var url = baseUrl + '/login';
    // create a custom object your want to pass to the email template. You can create as many key-value pairs as you want
    var myMessage = {
      user: obj.user
    };
    var renderer = loopback.template(path.resolve(__dirname, '../../server/views/emails/welcomeUser.ejs'));
    html_body = renderer(myMessage);

    /// console.log(obj.user.email);

    User.app.models.Email.send({
      to: obj.user.email,
      from: { name: "Waypost Support", email: "support@waypost.me" },
      subject: 'Welcome to Waypost',
      text: 'notext',
      html: html_body
    }, function (err, mail) {

      console.log(err);
      console.log(mail);
      //cb(err, mail);
    });
  };


  User.on('resetPasswordRequest', function (info) {
    //  const URL = require('url');
    //  var baseUrl = app.get('url').replace(/\/$/, '');
    // console.log(ctx);

    /* var parseObject = URL.parse(req.protocol + '://' + req.get('host'));
                    var HOST = parseObject.hostname;
                    var PROTOCOL = req.get('x-forwarded-proto');
                    var PORT = parseInt(req.get('x-forwarded-port'));
                    baseUrl = PROTOCOL + '://' + HOST + ':' + PORT; */
    // Had to hard code :( for now

    var url = 'https://alpha.waypost.me' + '/reset-password';


    console.log("url = " + url);

    // create a custom object your want to pass to the email template. You can create as many key-value pairs as you want
    var myMessage = { appUrl: baseUrl, url: url + '?access_token=' + info.accessToken.id };
    var renderer = loopback.template(path.resolve(__dirname, '../../server/views/emails/reset-password.ejs'));
    html_body = renderer(myMessage);

    User.app.models.Email.send({
      to: info.email,
      from: { name: "Waypost Support", email: "support@waypost.me" },
      subject: 'Waypost Password Reset',
      text: 'notext',
      html: html_body
    }, function (err, mail) {
      if (err) {
        return console.log('> error sending password reset email');
      }
      console.log('> sending password reset email to:', info.email);
    });
  });

//remote method


};





