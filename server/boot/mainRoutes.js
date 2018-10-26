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
    const playerPosition = req.body.playerPosition != null ?
      req.body.playerPosition.toLowerCase() :
      null;
    const type = req.body.type != null ? req.body.type : null;
    var response = {
      playerPosition,
    };

    const query = playerPosition ? {
      'query': {
        'term': {
          'position': playerPosition,
        },
      },
    } : {};

    switch (type) {
      case 'emotional_intel': {
        // dashboard emotional intel chart

        const emotionalIntelObj = Object.assign({
          'size': 0,
          'aggs': {
            'emotionalIntelBehavior': {
              'avg': {
                'field': 'emotionalIntelBehavior',
              },
            },
            'emotionalIntelReflection': {
              'avg': {
                'field': 'emotionalIntelReflection',
              },
            },
            'emotionalIntelteamWork': {
              'avg': {
                'field': 'emotionalIntelteamWork',
              },
            },
            'emotionalIntelRelationships': {
              'avg': {
                'field': 'emotionalIntelRelationships',
              },
            },
            'emotionalIntelAccountability': {
              'avg': {
                'field': 'emotionalIntelAccountability',
              },
            },
            'emotionalIntelResponsibility': {
              'avg': {
                'field': 'emotionalIntelResponsibility',
              },
            },
            'emotionalIntelIndependence': {
              'avg': {
                'field': 'emotionalIntelIndependence',
              },
            },
          },
        }, query);

        // TODO: combine as single request if possible?
        const emotionalIntelPromise = client.search({
          index: 'cincinnati',
          body: emotionalIntelObj,
        });

        const agdiagoBenchmarkPromise = client.search({
          index: 'baseline',
          body: emotionalIntelObj,
        });

        const programBenchmarkPromise = client.search({
          index: 'cincinnati-benchmarks',
          body: emotionalIntelObj,
        });

        const [
          emotionalIntelResponse,
          agdiagoBenchmarkResponse,
          programBenchmarkResponse,
        ] = await Promise.all([
          emotionalIntelPromise,
          agdiagoBenchmarkPromise,
          programBenchmarkPromise,
        ]);

        response.emotionalIntel = emotionalIntelResponse.aggregations;
        response.agdiagoBenchmark = agdiagoBenchmarkResponse.aggregations;
        response.programBenchmark = programBenchmarkResponse.aggregations;

        break;
      }
      case 'athletic': {
        // dashboard athletic chart

        const athleticObj = Object.assign({
          'size': 0,
          'aggs': {
            'forty': {
              'avg': {
                'field': 'forty',
              },
            },
            'vertical': {
              'avg': {
                'field': 'vertical',
              },
            },
            // 'carries': {
            //   'avg': {
            //     'field': 'carries',
            //   },
            // },
            // 'rushingYards': {
            //   'avg': {
            //     'field': 'rushingYards',
            //   },
            // },
            // 'rushingTouchdowns': {
            //   'avg': {
            //     'field': 'rushingTouchdowns',
            //   },
            // },
            // 'receptions': {
            //   'avg': {
            //     'field': 'receptions',
            //   },
            // },
            // 'recievingYards': {
            //   'avg': {
            //     'field': 'recievingYards',
            //   },
            // },
            'gamesPlayed': {
              'avg': {
                'field': 'gamesPlayed',
              },
            },
            'gamesStarted': {
              'avg': {
                'field': 'gamesStarted',
              },
            },
            'height': {
              'avg': {
                'field': 'height',
              },
            },
            'weight': {
              'avg': {
                'field': 'weight',
              },
            },
            // 'completions': {
            //   'avg': {
            //     'field': 'completions',
            //   },
            // },
            // 'passingYards': {
            //   'avg': {
            //     'field': 'passingYards',
            //   },
            // },
            // 'touchdownsThrown': {
            //   'avg': {
            //     'field': 'touchdownsThrown',
            //   },
            // },
            // 'interceptionsThrown': {
            //   'avg': {
            //     'field': 'interceptionsThrown',
            //   },
            // },
            // 'soloTackle': {
            //   'avg': {
            //     'field': 'soloTackles',
            //   },
            // },
            // 'totalTackles': {
            //   'avg': {
            //     'field': 'totalTackles',
            //   },
            // },
            // 'sacks': {
            //   'avg': {
            //     'field': 'sacks',
            //   },
            // },
            // 'tacklesForLoss': {
            //   'avg': {
            //     'field': 'tacklesForLoss',
            //   },
            // },
          },
        }, query);

        // TODO: combine as single request if possible?
        const athleticPromise = client.search({
          index: 'cincinnati',
          body: athleticObj,
        });

        const agdiagoBenchmarkPromise = client.search({
          index: 'baseline',
          body: athleticObj,
        });

        const programBenchmarkPromise = client.search({
          index: 'cincinnati-benchmarks',
          body: athleticObj,
        });

        const [
          athleticResponse,
          agdiagoBenchmarkResponse,
          programBenchmarkResponse,
        ] = await Promise.all([
          athleticPromise,
          agdiagoBenchmarkPromise,
          programBenchmarkPromise,
        ]);

        response.athletic = athleticResponse.aggregations;
        response.agdiagoBenchmark = agdiagoBenchmarkResponse.aggregations;
        response.programBenchmark = programBenchmarkResponse.aggregations;

        break;
      }
      case 'single_player': {
        // dashboard single player page

        const id = req.body.playerId;

        const playerResponse = await client.get({
          index: 'cincinnati',
          type: '_all',
          id: id,
        });

        response.player = Object.assign({
          id: id,
        }, playerResponse._source);

        break;
      }
      case 'players_data': {
        // dashboard players table modal

        const field = req.body.field;

        const playersObj = Object.assign({
          'size': 10000,
          '_source': ['fname', 'lname', 'position', field],
        }, query);

        const playersResponse = await client.search({
          index: 'cincinnati',
          body: playersObj,
        });

        response.players = playersResponse.hits.hits.map(hit => ({
          id: hit._id,
          fname: hit._source.fname,
          lname: hit._source.lname,
          position: hit._source.position,
          score: hit._source[field],
        }));
        break;
      }
      case 'core_attributes': {
        // dashboard core attributes chart

        const coreAttributesObj = Object.assign({
          'size': 0,
          'aggs': {
            'coreAttributesCompetitiveness': {
              'avg': {
                'field': 'coreAttributesCompetitiveness',
              },
            },
            'coreAttributesPersistence': {
              'avg': {
                'field': 'coreAttributesPersistence',
              },
            },
            'coreAttributesWorkethic': {
              'avg': {
                'field': 'coreAttributesWorkethic',
              },
            },
            'coreAttributesTeamOrientation': {
              'avg': {
                'field': 'coreAttributesTeamOrientation',
              },
            },
            'coreAttributesMastery': {
              'avg': {
                'field': 'coreAttributesMastery',
              },
            },
          },
        }, query);

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
      }
      case 'academic': {
        // dashboard academic chart
        var academicObj = Object.assign({
          'size': 0,
          'aggs': {
            'gpa': {
              'avg': {
                'field': 'gpa',
              },
            },
            'sat': {
              'avg': {
                'field': 'sat',
              },
            },
            'act': {
              'avg': {
                'field': 'act',
              },
            },
            'coreGpa': {
              'avg': {
                'field': 'coreGpa',
              },
            },
          },
        }, query);

        // TODO: combine as single request if possible?
        const academicPromise = client.search({
          index: 'cincinnati',
          body: academicObj,
        });

        const agdiagoBenchmarkPromise = client.search({
          index: 'baseline',
          body: academicObj,
        });

        const programBenchmarkPromise = client.search({
          index: 'cincinnati-benchmarks',
          body: academicObj,
        });

        const [
          academicResponse,
          agdiagoBenchmarkResponse,
          programBenchmarkResponse,
        ] = await Promise.all([
          academicPromise,
          agdiagoBenchmarkPromise,
          programBenchmarkPromise,
        ]);

        response.academic = academicResponse.aggregations;
        response.agdiagoBenchmark = agdiagoBenchmarkResponse.aggregations;
        response.programBenchmark = programBenchmarkResponse.aggregations;

        break;
      }
      case 'social_profile': {
        // dashboard social profile chart
        var socialProfileObj = Object.assign({
          'size': 0,
          'aggs': {
            'socialTwitterSentiment': {
              'avg': {
                'field': 'socialTwitterSentiment',
              },
            },
            'twitterFollowers': {
              'avg': {
                'field': 'twitterFollowers',
              },
            },
            'socialInstagramSentiment': {
              'avg': {
                'field': 'socialInstagramSentiment',
              },
            },
            'instagramFollowers': {
              'avg': {
                'field': 'instagramFollowers',
              },
            },
            'facebookSentiment': {
              'avg': {
                'field': 'facebookSentiment',
              },
            },
            'newsMediaCoverageSentiment': {
              'avg': {
                'field': 'newsMediaCoverageSentiment',
              },
            },
            'newsMedaiCoveragementions': {
              'avg': {
                'field': 'newsMedaiCoveragementions',
              },
            },
            'newsMediacoverageNational': {
              'avg': {
                'field': 'newsMediacoverageNational',
              },
            },
            'newsMediaCoverageRegional': {
              'avg': {
                'field': 'newsMediaCoverageRegional',
              },
            },
            'pressReleaseSentiment': {
              'avg': {
                'field': 'pressReleaseSentiment',
              },
            },
            'pressReleaseSentimentCounter': {
              'avg': {
                'field': 'pressReleaseSentimentCounter',
              },
            },
          },
        }, query);

        // TODO: combine as single request if possible?
        const socialProfilePromise = client.search({
          index: 'cincinnati',
          body: socialProfileObj,
        });

        const agdiagoBenchmarkPromise = client.search({
          index: 'baseline',
          body: socialProfileObj,
        });

        const programBenchmarkPromise = client.search({
          index: 'cincinnati-benchmarks',
          body: socialProfileObj,
        });

        const [
          socialProfileResponse,
          agdiagoBenchmarkResponse,
          programBenchmarkResponse,
        ] = await Promise.all([
          socialProfilePromise,
          agdiagoBenchmarkPromise,
          programBenchmarkPromise,
        ]);

        response.socialProfile = socialProfileResponse.aggregations;
        response.agdiagoBenchmark = agdiagoBenchmarkResponse.aggregations;
        response.programBenchmark = programBenchmarkResponse.aggregations;

        break;
      }
      case 'cultural_fit': {
        // TODO: use actual cultural fit
        const culturalFitField = 'weight';

        // dashboard cultural fit chart
        const culturalFitBaselineObj = Object.assign({
          'size': 0,
          'aggs': {
            'percCulturalFit': {
              'percentiles': {
                'field': culturalFitField,
                'keyed': false,
                'percents': [
                  45,
                  75,
                ],
              },
            },
          },
        }, query);

        const culturalFitBaselineResponse = await client.search({
          index: 'baseline',
          body: culturalFitBaselineObj,
        });
        const [percLowFit, percMedFit] =
              culturalFitBaselineResponse.aggregations.percCulturalFit.values;
        const percentiles = [{
          percentileStart: 0,
          percentileEnd: 44,
        }, {
          percentileStart: 45,
          percentileEnd: 74,
        }, {
          percentileStart: 75,
          percentileEnd: 100,
        }];

        const culturalFitTeamObj = {
          'aggs': {
            'rangeCulturalFit': {
              'range': {
                'field': culturalFitField,
                'ranges': [
                  {'to': percLowFit.value},
                  {'from': percLowFit.value, 'to': percMedFit.value},
                  {'from': percMedFit.value},
                ],
              },
            },
          },
        };

        const culturalFitTeamResponse = await client.search({
          index: 'cincinnati',
          body: culturalFitTeamObj,
        });

        response.culturalFit = culturalFitTeamResponse
          .aggregations
          .rangeCulturalFit
          .buckets
          .map((bucket, i) => ({
            rangeStart: bucket.from || 0,
            rangeEnd: bucket.to || 100,
            count: bucket.doc_count,
            percentileStart: percentiles[i].percentileStart,
            percentileEnd: percentiles[i].percentileEnd,
          }));

        break;
      }
    };

    return res.json(response);
  });
};
