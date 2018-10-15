#!/usr/bin/env node

'use strict';

const path = require('path');
const fs = require('fs');

const supportedExtensions = ['csv', 'json'];

const middlewares = [
  createMiddleware('input', normalizeInput),
];
// check is called BEFORE middlewares are applied so need to apply it twice :(
const check = withMiddlewares(middlewares, createCheck(function check(argv) {
  const {input} = argv;
  if (!fileExists(input)) {
    return 'Argument check failed: input is not a readable file: ' +
      input;
  }

  return true;
}));

const argv = require('yargs')
      .version('0.1.0')
      .command(
        '$0 <input>',
        `Convert input file to ElasticSearch bulp update compatible json.
Supported extensions: ${supportedExtensions}`,
        function builder() {},
        function handler(argv) {
          const {input} = argv;

          console.log('Processing file: ' + input);
        }
      )
      .middleware(middlewares)
      .help('h')
      .alias('h', 'help')
      .check(check)
      .argv;

function createCheck(fn) {
  return function check() {
    const res = fn.apply(this, arguments);
    if (typeof res === 'string') {
      return 'Arguments check failed: ' + res;
    } else {
      return res;
    }
  };
}

function applyMiddleware(middleware, argv) {
  return Object.assign({}, argv, middleware(argv));
}

function withMiddlewares(middlewares, fn) {
  return function middlewared(argv) {
    const transformedArgv = (middlewares && middlewares.length) ?
          middlewares.reduce((acc, curr) => applyMiddleware(curr, acc), argv) :
          argv;
    return fn(transformedArgv);
  };
}

function createMiddleware(name, fn) {
  return function middleware(argv) {
    const arg = argv[name];
    if (arg != null) {
      return {
        [name]: fn(arg),
      };
    } else {
      return {};
    }
  };
}

function normalizeInput(input) {
  return path.resolve(input);
}

function fileExists(filename) {
  try {
    fs.accessSync(filename, fs.constants.R_OK);
    return true;
  } catch (err) {
    return false;
  }
}
