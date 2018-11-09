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
      uri: baseSearchUri + 'cincinnati/_count',
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
      index: 'cincinnati',
      body: offenseObj,
    });
    response.offenseCount =
      Math.round((offenseResponse.hits.total / response.overallCount) * 100);

    const defenseResponse = await client.search({
      index: 'cincinnati',
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


  //dashboard-category
  app.get('/dashboard-category', function(req, res, next) {
    res.render('dashboard-category', {position: req.query.category});
  });

  //dashboard-position
  app.get('/dashboard-position', function(req, res, next) {
    res.render('dashboard-position', {position: req.query.position});
  });

  //dashboard-player
  app.get('/dashboard-player', function(req, res, next) {
    res.render('dashboard-player', {id: req.query.id});
  });

  // Player Assessment
  app.get('/player_assessment', (req, res, next) => {
    res.render('pages/player_assessment');
  });

  // Login
  app.get('/login', function(req, res, next) {
    res.render('login');
  });

  // Login
  app.get('/register', function(req, res, next) {
    res.render('register');
  });

  // dashboard data ajax handler
  // TODO: use loopback for this? or move to '/' handler?
  const athleticFields = [
    'forty',
    'vertical',
    'carries',
    'rushingYards',
    'rushingTouchdowns',
    'receptions',
    'recievingYards',
    'gamesPlayed',
    'gamesStarted',
    'height',
    'weight',
    'completions',
    'passingYards',
    'touchdownsThrown',
    'interceptionsThrown',
    'soloTackle',
    'totalTackles',
    'sacks',
    'tacklesForLoss',
  ];

  const emotionalIntelFields = [
    'emotionalIntelBehavior',
    'emotionalIntelReflection',
    'emotionalIntelteamWork',
    'emotionalIntelRelationships',
    'emotionalIntelAccountability',
    'emotionalIntelResponsibility',
    'emotionalIntelIndependence',
  ];

  const academicFields = [
    'gpa',
    'sat',
    'act',
    'coreGpa',
  ];

  const socialProfileFields = [
    'socialTwitterSentiment',
    'twitterFollowers',
    'socialInstagramSentiment',
    'instagramFollowers',
    'facebookSentiment',
    'newsMediaCoverageSentiment',
    'newsMedaiCoveragementions',
    'newsMediacoverageNational',
    'newsMediaCoverageRegional',
    'pressReleaseSentiment',
    'pressReleaseSentimentCounter',
  ];

  const coreAttributesFields = [
    'coreAttributesCompetitiveness',
    'coreAttributesPersistence',
    'coreAttributesWorkethic',
    'coreAttributesTeamOrientation',
    'coreAttributesMastery',
  ];

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

        const emotionalIntelObj =
              Object.assign(getAggregationObj(emotionalIntelFields), query);

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

        const athleticObj =
              Object.assign(getAggregationObj(athleticFields), query);

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

        const athleticObj =
              Object.assign(getAggregationObj(athleticFields), query);
        const emotionalIntelObj =
              Object.assign(getAggregationObj(emotionalIntelFields), query);
        const academicObj =
              Object.assign(getAggregationObj(academicFields), query);
        const socialProfileObj =
              Object.assign(getAggregationObj(socialProfileFields), query);
        const coreAttributesObj =
              Object.assign(getAggregationObj(coreAttributesFields), query);

        const programAthleticPromise = client.search({
          index: 'cincinnati-benchmarks',
          body: athleticObj,
        });
        const programEmotionalIntelPromise = client.search({
          index: 'cincinnati-benchmarks',
          body: emotionalIntelObj,
        });
        const programAcademicPromise = client.search({
          index: 'cincinnati-benchmarks',
          body: academicObj,
        });
        const programSocialProfilePromise = client.search({
          index: 'cincinnati-benchmarks',
          body: socialProfileObj,
        });
        const programCoreAttributesPromise = client.search({
          index: 'cincinnati-benchmarks',
          body: coreAttributesObj,
        });

        const agdiagoAthleticPromise = client.search({
          index: 'baseline',
          body: athleticObj,
        });
        const agdiagoEmotionalIntelPromise = client.search({
          index: 'baseline',
          body: emotionalIntelObj,
        });
        const agdiagoAcademicPromise = client.search({
          index: 'baseline',
          body: academicObj,
        });
        const agdiagoSocialProfilePromise = client.search({
          index: 'baseline',
          body: socialProfileObj,
        });
        const agdiagoCoreAttributesPromise = client.search({
          index: 'baseline',
          body: coreAttributesObj,
        });

        const playerPromise = client.get({
          index: 'cincinnati',
          type: '_all',
          id: id,
        });

        const [
          programAthleticResponse,
          programEmotionalIntelResponse,
          programAcademicResponse,
          programSocialProfileResponse,
          programCoreAttributesResponse,
          agdiagoAthleticResponse,
          agdiagoEmotionalIntelResponse,
          agdiagoAcademicResponse,
          agdiagoSocialProfileResponse,
          agdiagoCoreAttributesResponse,
          playerResponse,
        ] = await Promise.all([
          programAthleticPromise,
          programEmotionalIntelPromise,
          programAcademicPromise,
          programSocialProfilePromise,
          programCoreAttributesPromise,
          agdiagoAthleticPromise,
          agdiagoEmotionalIntelPromise,
          agdiagoAcademicPromise,
          agdiagoSocialProfilePromise,
          agdiagoCoreAttributesPromise,
          playerPromise,
        ]);

        const player = Object.assign({
          id: id,
        }, playerResponse._source);

        const athleticScore = calculateScore(
          player,
          programAthleticResponse.aggregations
        );
        const emotionalIntelScore = calculateScore(
          player,
          programEmotionalIntelResponse.aggregations
        );
        const academicScore = calculateScore(
          player,
          programAcademicResponse.aggregations
        );
        const socialProfileScore = calculateScore(
          player,
          programSocialProfileResponse.aggregations
        );
        const coreAttributesScore = calculateScore(
          player,
          programCoreAttributesResponse.aggregations
        );

        response.player = player;
        response.scores = {
          athletic: athleticScore,
          emotionalIntel: emotionalIntelScore,
          academic: academicScore,
          socialProfile: socialProfileScore,
          coreAttributes: coreAttributesScore,
        };

        response.programScores = {
          athletic: await fetchBenchmarkScore(
            'cincinnati',
            query,
            mapAggsToScores(programAthleticResponse.aggregations)
          ),
          emotionalIntel: await fetchBenchmarkScore(
            'cincinnati',
            query,
            mapAggsToScores(programEmotionalIntelResponse.aggregations)
          ),
          academic: await fetchBenchmarkScore(
            'cincinnati',
            query,
            mapAggsToScores(programAcademicResponse.aggregations)
          ),
          socialProfile: await fetchBenchmarkScore(
            'cincinnati',
            query,
            mapAggsToScores(programSocialProfileResponse.aggregations)
          ),
          coreAttributes: await fetchBenchmarkScore(
            'cincinnati',
            query,
            mapAggsToScores(programCoreAttributesResponse.aggregations)
          ),
        };

        response.agdiagoScores = {
          athletic: await fetchBenchmarkScore(
            'baseline',
            query,
            mapAggsToScores(agdiagoAthleticResponse.aggregations)
          ),
          emotionalIntel: await fetchBenchmarkScore(
            'baseline',
            query,
            mapAggsToScores(agdiagoEmotionalIntelResponse.aggregations)
          ),
          academic: await fetchBenchmarkScore(
            'baseline',
            query,
            mapAggsToScores(agdiagoAcademicResponse.aggregations)
          ),
          socialProfile: await fetchBenchmarkScore(
            'baseline',
            query,
            mapAggsToScores(agdiagoSocialProfileResponse.aggregations)
          ),
          coreAttributes: await fetchBenchmarkScore(
            'baseline',
            query,
            mapAggsToScores(agdiagoCoreAttributesResponse.aggregations)
          ),
        };

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

        const coreAttributesObj =
              Object.assign(getAggregationObj(coreAttributesFields), query);

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
        var academicObj =
            Object.assign(getAggregationObj(academicFields), query);

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
        var socialProfileObj =
            Object.assign(getAggregationObj(socialProfileFields), query);

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

function getAggregationObj(fields) {
  const obj = {
    size: 0,
    aggs: {},
  };

  fields.forEach(field => {
    obj.aggs[field] = {
      avg: {
        field,
      },
    };
  });

  return obj;
}

function calculateScore(player, programAggs) {
  const scores = Object.keys(programAggs).map(field => {
    const value = player[field];
    const programValue = programAggs[field].value;
    if (value == null) return null;
    if (programValue == null) return null;
    if (programValue === 0) return 1;
    return value / programValue;
  });
  const totalNonNull = scores.filter(score => score != null).length;
  if (!totalNonNull) return null;
  const score = scores.reduce((acc, curr) => curr == null ? acc : acc + curr);
  return 100 * score / totalNonNull;
}

const programScoreWeights = {
  athletic: 0.55,
  emotionalIntel: 0.05,
  academic: 0.10,
  socialProfile: 0.05,
  coreAttributes: 0.25,
};

function calculateOverallScore(scores) {
  // TODO: implement
}

function mapAggsToScores(aggs) {
  const res = {};
  Object.keys(aggs).forEach(field => {
    res[field] = aggs[field].value;
  });
  return res;
}

async function fetchBenchmarkScore(index, query, programScores) {
  const nonNullKeys = Object.keys(programScores)
    .filter(field => programScores[field] != null);
  if (!nonNullKeys.length) return null;
  const fetchObj = Object.assign({
    'size': 0,
    'aggs': {
      'benchmarkScore': {
        'percentiles': {
          'script': {
            'lang': 'painless',
            'source': `
float score = 0;
for (int i = 0; i < params['fields'].length; ++i) {
  def field = params['fields'][i];
  if (params['scores'][i] == 0) {
    score += 1.0;
  } else {
    score += (float)doc[field].value / (float)params['scores'][i];
  }
}
return score / (float)params['fields'].length;
`,
            'params': {
              'fields': nonNullKeys,
              'scores': nonNullKeys.map(field => programScores[field]),
            },
          },
          'keyed': false,
          'percents': [
            75,
          ],
        },
      },
    },
  }, query);

  const fetchResponse = await client.search({
    index,
    body: fetchObj,
  });

  const [agg] =
        fetchResponse.aggregations.benchmarkScore.values;
  return agg.value * 100;
}
