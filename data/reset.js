#!/usr/bin/env node

'use strict';

const elasticsearch = require('elasticsearch');

const urlDefault = 'https://search-agdiago-ajvfe7hmdvjahbf6544srce6xy.us-east-1.es.amazonaws.com/';

const argv = require('yargs')
  .version('0.1.0')
  .command(
    '$0',
    'Remove ElasticSearch data and apply default mappings.',
    function builder() {},
    handler
  )
  .coerce('url', normalizeUrl)
  .option('u', {
    alias: 'url',
    default: urlDefault,
    describe: 'ElasticSearch url',
    type: 'string',
  })
  .help('h')
  .alias('h', 'help')
  .argv;

async function handler(argv) {
  const {url} = argv;

  console.log('Resetting ES: ' + url);

  // TODO: implement
  const client = new elasticsearch.Client({
    host: url,
  });

  try {
    const indices = ['baseline', 'cincinnati', 'cincinnati-benchmarks'];
    await client.indices.delete({
      'index': indices,
    });

    for (let index of indices) {
      await client.indices.create({
        'index': index,
        'body': {
          'mappings': {
            'post': {
              'dynamic_templates': [
                {
                  'floats': {
                    'match_mapping_type': 'long',
                    'mapping': {
                      'type': 'float',
                    },
                  },
                },
              ],
            },
          },
        },
      });
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}

function normalizeUrl(url) {
  if (url.endsWith('/')) {
    return url;
  } else {
    return url + '/';
  }
}
