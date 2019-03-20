"use strict";

const path = require("path");
const os = require("os");
const fs = require("fs");
const { ELASTICSEARCH_URL } = require("../env");
var request = require("request-promise");
var baseSearchUri = ELASTICSEARCH_URL;

var elasticsearch = require("elasticsearch");
var client = new elasticsearch.Client({
    host: ELASTICSEARCH_URL
});
const validator = require("email-validator");
var Isemail = require('isemail');

module.exports = app => {
  var User = app.models.user;

//log a user in
  app.post('/login', function(req, res) {
    console.log('login');
    User.login({
      email: req.body.email,
      password: req.body.password
    }, 'user', function(err, token) {
      if (err) {
        if (err.details && err.code === 'LOGIN_FAILED_EMAIL_NOT_VERIFIED') {
          res.render('reponseToTriggerEmail', {
            title: 'Login failed',
            content: err,
            redirectToEmail: '/api/users/'+ err.details.userId + '/verify',
            redirectTo: '/',
            redirectToLinkText: 'Click here',
            userId: err.details.userId
          });
        } else {
          res.render('login', {
            errorMessage: 'Login failed. Wrong username or password'
          });
        }
        return;
      }
      res.cookie('access_token', token.id, { signed: true, maxAge: 14400000 });
      res.redirect('/');
      // res.render('/', {
      //   email: req.body.email,
      //   accessToken: token.id,
      //   redirectUrl: '/api/users/change-password?access_token=' + token.id,
      // });
    });
  });

  //log a user out
  app.get('/logout', function(req, res, next) {
    res.cookie('access_token', '', { signed: true, maxAge: 14400000 });
    res.redirect('/');
    // if (!req.accessToken) return res.sendStatus(401);
    // User.logout(req.accessToken.id, function(err) {
    //   if (err) return next(err);
    //   res.redirect('/');
    // });
  });

  //send an email with instructions to reset an existing user's password
  app.post('/request-password-reset', function(req, res, next) {
    User.resetPassword({
      email: req.body.email
    }, function(err) {
      if (err) return res.status(401).send(err);

      res.render('response', {
        title: 'Password reset requested',
        content: 'Check your email for further instructions',
        redirectTo: '/',
        redirectToLinkText: 'Log in'
      });
    });
  });

  //show password reset form
  app.get('/reset-password', function(req, res, next) {
    if (!req.accessToken) return res.sendStatus(401);
    res.render('password-reset', {
      redirectUrl: '/api/users/reset-password?access_token='+
      req.accessToken.id
    });
  });

}
