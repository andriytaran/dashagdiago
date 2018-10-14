'use strict';

const path = require('path');
const os = require('os');
const fs = require('fs');
var request = require('request-promise');
var baseSearchUri = 'https://search-agdiago-ajvfe7hmdvjahbf6544srce6xy.us-east-1.es.amazonaws.com/';


var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'https://search-agdiago-ajvfe7hmdvjahbf6544srce6xy.us-east-1.es.amazonaws.com'
});

module.exports = (app) => {
  // Home
app.get('/', async function(req, res, next) {

    var response = {};
    var responseObj = {};


    const overallCountResponse = await request({ uri: baseSearchUri + '_count', method: 'get' });
    responseObj = JSON.parse(overallCountResponse);
    response.overallCount = responseObj.count;

    var offenseObj = {
        "size": 0,
        "query": {
            "bool": {
                "must": {
                    "match": {
                        "offenseDefense": 0
                    }
                }
            }
        }
    }

    var defenseObj = {
        "size": 0,
        "query": {
            "bool": {
                "must": {
                    "match": {
                        "offenseDefense": 1
                    }
                }
            }
        }
    }

    const offenseResponse = await client.search({ index: 'baseline', body: offenseObj })
      response.offenseCount = Math.round((offenseResponse.hits.total / response.overallCount ) * 100);

    const defenseResponse = await client.search({ index: 'baseline', body: defenseObj })
      response.defenseCount = Math.round(( defenseResponse.hits.total / response.overallCount ) * 100)

    res.render('home', { response: response });

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
  app.post('/api/dashboard-data', async function (req, res) {
    const type = (req.body.type !== undefined) ? req.body.type : '';
    var response = {};

    switch (type) {
      case 'core_attributes':
        // dashboard core attributes chart
        var coreAttributesObj = {
          "aggs": {
            "avgCompetitiveness": { "avg": { "field": "CoreAttributesCompetitiveness" } },
            "avgPersistence": { "avg": { "field": "CoreAttributesPersistence" } },
            "avgWorkethic": { "avg": { "field": "CoreAttributesWorkethic" } },
            "avgTeamOrientation": { "avg": { "field": "CoreAttributesTeamOrientation" } },
            "avgMastery": { "avg": { "field": "CoreAttributesMastery" } },
          }
        }

        const coreAttributesResponse = await client.search({ index: 'baseline', body: coreAttributesObj })
        response.coreAttributes = coreAttributesResponse.aggregations;

        break;
    };

    return res.json(response);
  });

};
