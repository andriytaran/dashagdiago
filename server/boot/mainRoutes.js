'use strict';

const path = require('path');
const os = require('os');
const fs = require('fs');
const {ELASTICSEARCH_URL} = require('../env');
var request = require('request-promise');
var baseSearchUri = ELASTICSEARCH_URL;

var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: ELASTICSEARCH_URL,
});

module.exports = (app) => {
  // Home
  app.get('/', async function(req, res, next) {
    var response = {};
    var responseObj = {};

    const overallCountResponse = await request({
      uri: baseSearchUri + '_count',
      method: 'get',
    });
    responseObj = JSON.parse(overallCountResponse);
    response.overallCount = responseObj.count;

    var offenseObj = {
      'size': 0,
      'query': {
        'bool': {
          'must': {
            'match': {
              'offenseDefense': 0,
            },
          },
        },
      },
    };

    var defenseObj = {
      'size': 0,
      'query': {
        'bool': {
          'must': {
            'match': {
              'offenseDefense': 1,
            },
          },
        },
      },
    };

    const offenseResponse = await client.search({
      index: 'baseline',
      body: offenseObj,
    });
    response.offenseCount =
      Math.round((offenseResponse.hits.total / response.overallCount) * 100);

    const defenseResponse = await client.search({
      index: 'baseline',
      body: defenseObj,
    });
    response.defenseCount =
      Math.round((defenseResponse.hits.total / response.overallCount) * 100);

    res.render('home', {response: response});
  });

  app.get('/profile', function(req, res, next) {
    res.render('pages/profile');
  });

  app.get('/contact', function(req, res, next) {
    res.render('pages/contact');
  });

  app.get('/faq', function(req, res, next) {
    res.render('pages/faq');
  });

  app.get('/branding', function(req, res, next) {
    res.render('pages/branding_page');
  });

  // Cultural Fit
  app.get('/cultural_fit', (req, res, next) => {
    res.render('pages/cultural_fit');
  });

  // Player Assessment
  app.get('/player_assessment', (req, res, next) => {
    res.render('pages/player_assessment');
  });

  // Login
  app.post('/login', (req, res, next) => {
    res.render('coachLandng');
  });

  // dashboard data ajax handler
  // TODO: use loopback for this? or move to '/' handler?
  app.post('/api/dashboard-data', async function(req, res) {
    const type = (req.body.type !== undefined) ? req.body.type : '';
    var response = {};

    switch (type) {
      case 'core_attributes':
        // dashboard core attributes chart
        var coreAttributesObj = {
          'aggs': {
            'avgCompetitiveness': {
              'avg': {
                'field': 'coreAttributesCompetitiveness',
              },
            },
            'avgPersistence': {
              'avg': {
                'field': 'coreAttributesPersistence',
              },
            },
            'avgWorkethic': {
              'avg': {
                'field': 'coreAttributesWorkethic',
              },
            },
            'avgTeamOrientation': {
              'avg': {
                'field': 'coreAttributesTeamOrientation',
              },
            },
            'avgMastery': {
              'avg': {
                'field': 'coreAttributesMastery',
              },
            },
          },
        };

        // TODO: combine as single request if possible?
        const coreAttributesPromise = client.search({
          index: 'cincinnati',
          body: coreAttributesObj,
        });

        const agdiagoBenchmarkPromise = client.search({
          index: 'baseline',
          body: coreAttributesObj,
        });

        const programBenchmarkPromise = client.search({
          index: 'cincinnati-benchmarks',
          body: coreAttributesObj,
        });

        const [
          coreAttributesResponse,
          agdiagoBenchmarkResponse,
          programBenchmarkResponse,
        ] = await Promise.all([
          coreAttributesPromise,
          agdiagoBenchmarkPromise,
          programBenchmarkPromise,
        ]);

        response.coreAttributes = coreAttributesResponse.aggregations;
        response.agdiagoBenchmark = agdiagoBenchmarkResponse.aggregations;
        response.programBenchmark = programBenchmarkResponse.aggregations;

        break;
      case 'cultural_fit':
        response.culturalFit = [{
          percentileStart: 0,
          percentileEnd: 44,
          count: 123,
        }, {
          percentileStart: 45,
          percentileEnd: 74,
          count: 5432,
        }, {
          percentileStart: 75,
          percentileEnd: 100,
          count: 2500,
        }];
        break;
    };

    return res.json(response);
  });
};
