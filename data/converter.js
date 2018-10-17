#!/usr/bin/env node

'use strict';

const path = require('path');
const fs = require('fs');
const {pipeline} = require('stream');

const supportedExtensions = ['csv', 'json'];
const prefix = 'es_';
const url = 'https://search-agdiago-ajvfe7hmdvjahbf6544srce6xy.us-east-1.es.amazonaws.com/_bulk';

// check is called BEFORE middlewares are applied so need to apply it twice :(
const check = createCheck(function check(argv) {
  const {input, type} = argv;

  if (!type) {
    return 'Type is empty';
  }

  const ext = getExt(input);
  if (!~supportedExtensions.indexOf(ext)) {
    return 'Input has unsupported extension: ' +
      ext +
      `. Expected one of ${supportedExtensions}`;
  }

  if (!fileExists(input)) {
    return 'Input is not a readable file: ' +
      input;
  }

  return true;
});

const argv = require('yargs')
  .version('0.1.0')
  .command(
    '$0 <input>',
    `Convert input file to ElasticSearch bulk update compatible json.
Supported extensions: ${supportedExtensions}`,
    function builder() {},
    handler
  )
  .coerce('input', normalizeInput)
  .option('t', {
    alias: 'type',
    default: 'post',
    describe: '_type for es',
    type: 'string',
  })
  .option('i', {
    alias: 'index',
    describe: '_index for es',
    type: 'string',
  })
  .help('h')
  .alias('h', 'help')
  .check(check)
  .argv;

function handler(argv) {
  const {input} = argv;

  console.log('Processing file: ' + input);
  const ext = getExt(input);
  switch (ext) {
    case 'csv':
      csvHandler(argv);
      break;
    case 'json':
      jsonHandler(argv);
      break;
    default:
      throw new Error('Unsupported extension: ' + ext);
  }
}

function csvHandler(argv) {
  const {input} = argv;

  console.log('Applying csv processor');

  const csvtojson = require('csvtojson');

  const output = replaceExt(input, 'json');

  console.log('Output intermediate result to: ' + path.basename(output));

  const readStream = fs.createReadStream(input).on('error', console.error);
  const writeStream = fs.createWriteStream(output).on('error', console.error);
  const transformStream = csvtojson({
    checkType: true,
  }).on('error', console.error);

  pipeline(
    readStream,
    transformStream,
    writeStream,
    function onFinish(err) {
      if (err) console.error(err);

      console.log('Finished csv processor');
      jsonHandler(Object.assign({}, argv, {
        input: output,
      }));
    }
  );
}

function jsonHandler(argv) {
  const {input, type} = argv;

  const index = argv.index || getFilenameWithoutExt(input);

  console.log(`
Applying json processor with:
_index: ${index}
_type: ${type}
`);

  const jsontoesjson = require('./utils/json-to-esjson');

  const output = replaceFilename(input, prefix + path.basename(input));

  console.log('Output final result to: ' + path.basename(output));

  const readStream = fs.createReadStream(input).on('error', console.error);
  const writeStream = fs.createWriteStream(output).on('error', console.error);
  const transformStreams = jsontoesjson(index, type)
    .map(stream => stream.on('error', console.error));

  pipeline(
    readStream,
    ...transformStreams,
    writeStream,
    function onFinish(err) {
      if (err) console.error(err);
      console.log('Finished json processor');
      console.log(`Now you can bulk post the data to es using this command:

curl -s -H "Content-Type: application/x-ndjson" -XPOST ${url} --data-binary "@${output}"; echo`);
    }
  );
}

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

function normalizeInput(input) {
  return path.resolve(input);
}

function fileExists(filepath) {
  try {
    fs.accessSync(filepath, fs.constants.R_OK);
    return true;
  } catch (err) {
    return false;
  }
}

function getExt(filepath) {
  const ext = path.extname(filepath);
  // remove '.' at the start
  return ext ? ext.slice(1) : ext;
}

function replaceExt(filepath, newext) {
  const nameWithoutExt = getFilenameWithoutExt(filepath);
  const newName = nameWithoutExt + '.' + newext;
  return path.resolve(filepath, '..', newName);
}

function getFilenameWithoutExt(filepath) {
  const ext = path.extname(filepath);
  return path.basename(filepath, ext);
}

function replaceFilename(filepath, newfilename) {
  return path.resolve(filepath, '..', newfilename);
}
