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



  const {
        AccessToken,
        User
    } = app.models;

    app.post('/register', function(req, res, next) {
        var User = app.models.user;
        var newUser = {};
        newUser.email = req.body.email.toLowerCase();
        newUser.password = req.body.password;

        User.create(newUser, function(err, user) {
            if (err) {
            	console.log(err);
                req.flash('error', err.message);
                return res.redirect('/register');
            } else {
                // Passport exposes a login() function on req (also aliased as logIn())
                // that can be used to establish a login session. This function is
                // primarily used when users sign up, during which req.login() can
                // be invoked to log in the newly registered user.
                // req.login(user, function(err) {
                // if (err) {
                //req.flash('error', err.message);
                // return res.redirect('back');
                //}
                console.log(user);
                return res.redirect('/login');
                //  });
            }
        });
    });


    app.post('/login', function(req, res, next) {
        try {

           // req.logout();
            if (validator.validate(req.body.email) !== true) {
                return res.render('login', {
                    errorMessage: "The Email address " + req.body.email + " is not a valid format.",
                });
            }
            User.login({
                email: req.body.email,
                password: req.body.password
            }, 'user', function(err, token) {

                if (err) {
                    var Message = String(err.code);
                    console.log(err);
                    if (Message.match(/LOGIN_FAILED/g)) {
                        return res.render('login', {
                            errorMessage: "Login / Password Combination not correct",
                        });
                    } else {
                        return res.render('login', {
                            errorMessage: "An unexpected error has taken place, please check back later or contact us at support@waypost.me for assistance",
                        });
                    }
                }
                var ttl = '3000000000000000';
                const maxAge = parseInt(ttl); // Dev 
                //const maxAge = parseInt(process.env.npm_package_config_session_ttl); // Prod
                try {
                    res.cookie('userId', token.userId.toString(), {
                        signed: false,
                        maxAge
                    });

                } catch (e) {
                    console.log(e);
                }
                res.cookie('access_token', token.id, { signed: false, maxAge });
                res.cookie('user_id', token.userId.toString(), { signed: false, maxAge });
                //req.signedCookies.access_token=token.id.toString();
                console.log("About to got Manage - Login");
                return res.redirect('/');
            });
        } catch (err) {
            console.log(err);
        }
    });

}
