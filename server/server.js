'use strict';

const loopback = require('loopback');
const boot = require('loopback-boot');
const app = module.exports = loopback();

const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const helmet = require('helmet');

const cors = require('cors');

app.use(cors());

// Passport configurators..
var loopbackPassport = require('loopback-component-passport');
var PassportConfigurator = loopbackPassport.PassportConfigurator;
var passportConfigurator = new PassportConfigurator(app);
/*
 * body-parser is a piece of express middleware that
 *   reads a form's input and stores it as a javascript
 *   object accessible through `req.body`
 *
 */

 var config = {};
try {
  config = require('../providers.json');
} catch (err) {
  console.trace(err);
  process.exit(1); // fatal
}

const bodyParser = require('body-parser');

// configure body parser
const engine = require('ejs-locals');

app.use(loopback.token());

// boot(app, __dirname);
// app.use(cookieParser());
//
// app.use(loopback.token({
//   model: app.models.accessToken,
//   cookies: ['access_token'],
// }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(loopback.static(require('path').join(__dirname, '..', 'client')));
// configure view handler
app.set('view engine', 'ejs');
app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));

// Proxy
app.set('trust proxy', true);
// boot scripts mount components like REST API

// to support JSON-encoded bodies
app.middleware('parse', bodyParser.json());
// to support URL-encoded bodies
app.middleware('parse', bodyParser.urlencoded({
  extended: true,
}));

app.middleware('auth', loopback.token({
  model: app.models.accessToken,
  // cookies: ['access_token'],
}));

// @TODO ???? - cookieSecret
app.middleware('session:before', cookieParser(app.get('access_token')));

const maxAge = 14400000;
app.middleware('session', session({
  secret: 'kitty',
  saveUninitialized: true,
  resave: true,
  // cookie expires in two hours.
  cookie: {maxAge},
}));

app.start = () => {
  // start the web server
  return app.listen(() => {
    app.emit('started');
    const baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      const explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
// app.use(loopback.token({ model: app.models.accessToken }));

// boot(app, __dirname);

boot(app, __dirname, (err) => {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
