'use strict';

require('express-async-errors');

const path = require('path');
const os = require('os');
const fs = require('fs');
const R = require('ramda');

const es = require('./es');
const domain = require('./domain');

module.exports = app => {
  // Home
  app.get('/', async function(req, res, next) {
    const team = 'cincinnati';

    const [
      overallCount,
      offenseCount,
      defenseCount,
      overallScore,
    ] = await Promise.all([
      es.fetchCount({}, team),
      es.fetchCount({
        'body': {
          'query': {
            'bool': {
              'must': {
                'match': {
                  'offenseDefense': 0,
                },
              },
            },
          },
        },
      }, team),
      es.fetchCount({
        'body': {
          'query': {
            'bool': {
              'must': {
                'match': {
                  'offenseDefense': 1,
                },
              },
            },
          },
        },
      }, team),
      es.fetchOverallScore({}, team),
    ]);

    res.render('home', {
      overallCount,
      defensePercent: overallCount ?
        Math.round(100 * defenseCount / overallCount) :
        null,
      offensePercent: overallCount ?
        Math.round(100 * offenseCount / overallCount) :
        null,
      overallScore: Math.round(overallScore),
    });
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
  app.get('/dashboard-position', async function(req, res, next) {
    const team = 'cincinnati';
    const position = req.query.position != null ?
      req.query.position.toLowerCase() :
      null;

    const overallScore = await es.fetchOverallScore({
      'body': {
        'query': {
          'term': {
            'position': position,
          },
        },
      },
    }, team);

    res.render('dashboard-position', {
      position: position.toUpperCase(),
      overallScore: Math.round(overallScore),
    });
  });

  //dashboard-player
  app.get('/dashboard-player', async function(req, res, next) {
    res.render('dashboard-player', {});
  });

  // Player Assessment
  app.get('/player_assessment', (req, res, next) => {
    res.render('pages/player_assessment');
  });

  // Login
  app.get('/login', function(req, res, next) {
    res.render('login');
  });

  // Register
  app.get('/register', function(req, res, next) {
    res.render('register');
  });

  // academic benchmark setup
  app.get('/academbench', function(req, res, next) {
    res.render('academbench', {
      team: 'Cincinnati Bearcats',
      positions: positionF,
    });
  });

  // emotional benchmark setup
  app.get('/emotionalbench', function(req, res, next) {
    res.render('emotionalbench', {
      team: 'Cincinnati Bearcats',
      positions: positionF,
    });
  });

  // core attributes benchmark setup
  app.get('/corebench', function(req, res, next) {
    res.render('corebench', {
      team: 'Cincinnati Bearcats',
      positions: positionF,
    });
  });

  // social benchmark setup
  app.get('/socialbench', function(req, res, next) {
    res.render('socialbench', {
      team: 'Cincinnati Bearcats',
      positions: positionF,
    });
  });

  // athletic benchmark setup
  app.get('/athleticbench', function(req, res, next) {
    res.render('athleticbench', {
      team: 'Cincinnati Bearcats',
      positions: positionF,
    });
  });

  const positionF = [
    'Defensive End',
    'Defensive Tackle',
    'Offensive Guard',
    'Offensive Center',
    'Offensive Tackle',
    'Long Snapper',
    'Running Backs',
    'Tight Ends',
    'Wide Receivers',
    'Punter',
    'Kicker',
    'Corner Backs',
    'Safety',
    'Pro Style',
    'Dual Threat',
    'Inside Linebacker',
    'Outside Linebacker',
    'Middle Linebacker',
  ];

  // dashboard data ajax handler
  // TODO: use loopback for this? or move to '/' handler?

  app.post('/api/dashboard-data', async function(req, res) {
    const team = 'cincinnati';
    const response = {team};

    const parser = new Parser(req, response);

    const position = parser.parseParameter('position');
    const type = parser.parseRequiredParameter('type');

    const queryBuilder = new es.QueryBuilder();
    queryBuilder.add(es.queryByTerm('position', position));

    switch (type) {
      case 'single_player': {
        const id = parser.parseRequiredParameter('id');

        const query = queryBuilder.build();
        const [
          programBenchmarks,
          player,
        ] = await Promise.all([
          es.fetchProgramBenchmarks(query, team),
          es.fetchPlayer(query, team, id),
        ]);

        const scores = domain.calculatePlayerScores(player, programBenchmarks);
        const overallScore = domain.calculatePlayerOverallScore(
          scores,
          programBenchmarks
        );

        const pillars = Object.keys(scores);
        const agdiagoScoresArr = await Promise.all(
          pillars.map(
            pillar => es.fetchAgdiagoScore(
              query,
              team,
              pillar,
              programBenchmarks
            )
          )
        );
        const agdiagoScores = {};
        for (let index in pillars) {
          const pillar = pillars[index];
          agdiagoScores[pillar] = agdiagoScoresArr[index];
        }

        response.player = player;
        response.scores = {
          player: scores,
          agdiago: agdiagoScores,
        };
        response.overallScore = {
          player: overallScore,
          agdiago: null, // TODO: maybe implement
        };
        break;
      }
      case 'pillar': {
        const pillar = parser.parseParameter('pillar');
        const id = parser.parseParameter('id');

        if (!pillar) throw new Error('Unsupported pillar: ' + pillar);

        const benchmarkQuery = queryBuilder.cloneQuery();
        queryBuilder.add(es.queryByTerm('_id', id));
        const query = queryBuilder.build();

        const [
          pillarAttributes,
          programPillarAttributes,
          agdiagoPillarAttributes,
        ] = await Promise.all([
          await es.fetchPillarAttributes(
            query,
            team,
            pillar
          ),
          await es.fetchProgramPillarAttributes(
            benchmarkQuery,
            team,
            pillar
          ),
          await es.fetchAgdiagoPillarAttributes(
            benchmarkQuery,
            pillar
          ),
        ]);

        response.attributes = {
          player: pillarAttributes,
          program: programPillarAttributes,
          agdiago: agdiagoPillarAttributes,
        };

        break;
      }
      case 'scores': {
        const query = queryBuilder.build();

        const pillars = Object.keys(domain.pillarsObj);

        const programBenchmarks = await es.fetchProgramBenchmarks(
          query,
          team,
          pillars
        );

        const [scoresArr, agdiagoScoresArr] = await Promise.all([
          Promise.all(pillars.map(
            pillar => es.fetchScore(
              query,
              team,
              pillar,
              programBenchmarks
            )
          )),
          Promise.all(pillars.map(
            pillar => es.fetchAgdiagoScore(
              query,
              team,
              pillar,
              programBenchmarks
            )
          )),
        ]);

        const scores = {
          player: {},
          agdiago: {},
        };
        for (let i in pillars) {
          const pillar = pillars[i];
          const score = scoresArr[i];
          const agdiagoScore = agdiagoScoresArr[i];
          scores.player[pillar] = score;
          scores.agdiago[pillar] = agdiagoScore;
        }

        response.scores = scores;

        break;
      }
      case 'percentile_groups': {
        const attribute = parser.parseRequiredParameter('attribute');

        const query = queryBuilder.build();

        const percentileGroups = await es.fetchPercentileGroups(
          query,
          team,
          attribute,
        );

        response.groups = percentileGroups;

        break;
      }

      // old
      // case 'emotional_intel': {
      //   // dashboard emotional intel chart

      //   const emotionalIntelObj =
      //         Object.assign(getAggregationObj(emotionalIntelFields), query);

      //   // TODO: combine as single request if possible?
      //   const emotionalIntelPromise = client.search({
      //     index: 'cincinnati',
      //     body: emotionalIntelObj,
      //   });

      //   const agdiagoBenchmarkPromise = client.search({
      //     index: 'baseline',
      //     body: emotionalIntelObj,
      //   });

      //   const programBenchmarkPromise = client.search({
      //     index: 'cincinnati-benchmarks',
      //     body: emotionalIntelObj,
      //   });

      //   const [
      //     emotionalIntelResponse,
      //     agdiagoBenchmarkResponse,
      //     programBenchmarkResponse,
      //   ] = await Promise.all([
      //     emotionalIntelPromise,
      //     agdiagoBenchmarkPromise,
      //     programBenchmarkPromise,
      //   ]);

      //   response.emotionalIntel = emotionalIntelResponse.aggregations;
      //   response.agdiagoBenchmark = agdiagoBenchmarkResponse.aggregations;
      //   response.programBenchmark = programBenchmarkResponse.aggregations;

      //   break;
      // }
      // case 'athletic': {
      //   // dashboard athletic chart

      //   const athleticObj =
      //         Object.assign(getAggregationObj(athleticFields), query);

      //   // TODO: combine as single request if possible?
      //   const athleticPromise = client.search({
      //     index: 'cincinnati',
      //     body: athleticObj,
      //   });

      //   const agdiagoBenchmarkPromise = client.search({
      //     index: 'baseline',
      //     body: athleticObj,
      //   });

      //   const programBenchmarkPromise = client.search({
      //     index: 'cincinnati-benchmarks',
      //     body: athleticObj,
      //   });

      //   const [
      //     athleticResponse,
      //     agdiagoBenchmarkResponse,
      //     programBenchmarkResponse,
      //   ] = await Promise.all([
      //     athleticPromise,
      //     agdiagoBenchmarkPromise,
      //     programBenchmarkPromise,
      //   ]);

      //   response.athletic = athleticResponse.aggregations;
      //   response.agdiagoBenchmark = agdiagoBenchmarkResponse.aggregations;
      //   response.programBenchmark = programBenchmarkResponse.aggregations;

      //   break;
      // }
      // // case 'single_player': {
      // //   // dashboard single player page

      // //   const id = req.body.playerId;

      // //   const athleticObj =
      // //         Object.assign(getAggregationObj(athleticFields), query);
      // //   const emotionalIntelObj =
      // //         Object.assign(getAggregationObj(emotionalIntelFields), query);
      // //   const academicObj =
      // //         Object.assign(getAggregationObj(academicFields), query);
      // //   const socialProfileObj =
      // //         Object.assign(getAggregationObj(socialProfileFields), query);
      // //   const coreAttributesObj =
      // //         Object.assign(getAggregationObj(coreAttributesFields), query);

      // //   const programAthleticPromise = client.search({
      // //     index: 'cincinnati-benchmarks',
      // //     body: athleticObj,
      // //   });
      // //   const programEmotionalIntelPromise = client.search({
      // //     index: 'cincinnati-benchmarks',
      // //     body: emotionalIntelObj,
      // //   });
      // //   const programAcademicPromise = client.search({
      // //     index: 'cincinnati-benchmarks',
      // //     body: academicObj,
      // //   });
      // //   const programSocialProfilePromise = client.search({
      // //     index: 'cincinnati-benchmarks',
      // //     body: socialProfileObj,
      // //   });
      // //   const programCoreAttributesPromise = client.search({
      // //     index: 'cincinnati-benchmarks',
      // //     body: coreAttributesObj,
      // //   });

      // //   const agdiagoAthleticPromise = client.search({
      // //     index: 'baseline',
      // //     body: athleticObj,
      // //   });
      // //   const agdiagoEmotionalIntelPromise = client.search({
      // //     index: 'baseline',
      // //     body: emotionalIntelObj,
      // //   });
      // //   const agdiagoAcademicPromise = client.search({
      // //     index: 'baseline',
      // //     body: academicObj,
      // //   });
      // //   const agdiagoSocialProfilePromise = client.search({
      // //     index: 'baseline',
      // //     body: socialProfileObj,
      // //   });
      // //   const agdiagoCoreAttributesPromise = client.search({
      // //     index: 'baseline',
      // //     body: coreAttributesObj,
      // //   });

      // //   const playerPromise = client.get({
      // //     index: 'cincinnati',
      // //     type: '_all',
      // //     id: id,
      // //   });

      // //   const [
      // //     programAthleticResponse,
      // //     programEmotionalIntelResponse,
      // //     programAcademicResponse,
      // //     programSocialProfileResponse,
      // //     programCoreAttributesResponse,
      // //     agdiagoAthleticResponse,
      // //     agdiagoEmotionalIntelResponse,
      // //     agdiagoAcademicResponse,
      // //     agdiagoSocialProfileResponse,
      // //     agdiagoCoreAttributesResponse,
      // //     playerResponse,
      // //   ] = await Promise.all([
      // //     programAthleticPromise,
      // //     programEmotionalIntelPromise,
      // //     programAcademicPromise,
      // //     programSocialProfilePromise,
      // //     programCoreAttributesPromise,
      // //     agdiagoAthleticPromise,
      // //     agdiagoEmotionalIntelPromise,
      // //     agdiagoAcademicPromise,
      // //     agdiagoSocialProfilePromise,
      // //     agdiagoCoreAttributesPromise,
      // //     playerPromise,
      // //   ]);

      // //   const player = Object.assign({
      // //     id: id,
      // //   }, playerResponse._source);

      // //   const athleticScore = calculateScore(
      // //     player,
      // //     programAthleticResponse.aggregations
      // //   );
      // //   const emotionalIntelScore = calculateScore(
      // //     player,
      // //     programEmotionalIntelResponse.aggregations
      // //   );
      // //   const academicScore = calculateScore(
      // //     player,
      // //     programAcademicResponse.aggregations
      // //   );
      // //   const socialProfileScore = calculateScore(
      // //     player,
      // //     programSocialProfileResponse.aggregations
      // //   );
      // //   const coreAttributesScore = calculateScore(
      // //     player,
      // //     programCoreAttributesResponse.aggregations
      // //   );

      // //   response.player = player;
      // //   response.scores = {
      // //     athletic: athleticScore,
      // //     emotionalIntel: emotionalIntelScore,
      // //     academic: academicScore,
      // //     socialProfile: socialProfileScore,
      // //     coreAttributes: coreAttributesScore,
      // //   };

      // //   response.programScores = {
      // //     athletic: await fetchBenchmarkScore(
      // //       'cincinnati',
      // //       query,
      // //       mapAggsToScores(programAthleticResponse.aggregations)
      // //     ),
      // //     emotionalIntel: await fetchBenchmarkScore(
      // //       'cincinnati',
      // //       query,
      // //       mapAggsToScores(programEmotionalIntelResponse.aggregations)
      // //     ),
      // //     academic: await fetchBenchmarkScore(
      // //       'cincinnati',
      // //       query,
      // //       mapAggsToScores(programAcademicResponse.aggregations)
      // //     ),
      // //     socialProfile: await fetchBenchmarkScore(
      // //       'cincinnati',
      // //       query,
      // //       mapAggsToScores(programSocialProfileResponse.aggregations)
      // //     ),
      // //     coreAttributes: await fetchBenchmarkScore(
      // //       'cincinnati',
      // //       query,
      // //       mapAggsToScores(programCoreAttributesResponse.aggregations)
      // //     ),
      // //   };

      // //   response.agdiagoScores = {
      // //     athletic: await fetchBenchmarkScore(
      // //       'baseline',
      // //       query,
      // //       mapAggsToScores(agdiagoAthleticResponse.aggregations)
      // //     ),
      // //     emotionalIntel: await fetchBenchmarkScore(
      // //       'baseline',
      // //       query,
      // //       mapAggsToScores(agdiagoEmotionalIntelResponse.aggregations)
      // //     ),
      // //     academic: await fetchBenchmarkScore(
      // //       'baseline',
      // //       query,
      // //       mapAggsToScores(agdiagoAcademicResponse.aggregations)
      // //     ),
      // //     socialProfile: await fetchBenchmarkScore(
      // //       'baseline',
      // //       query,
      // //       mapAggsToScores(agdiagoSocialProfileResponse.aggregations)
      // //     ),
      // //     coreAttributes: await fetchBenchmarkScore(
      // //       'baseline',
      // //       query,
      // //       mapAggsToScores(agdiagoCoreAttributesResponse.aggregations)
      // //     ),
      // //   };

      // //   break;
      // // }
      // case 'players_data': {
      //   // dashboard players table modal

      //   const field = req.body.field;

      //   const playersObj = Object.assign({
      //     'size': 10000,
      //     '_source': ['fname', 'lname', 'position', field],
      //   }, query);

      //   const playersResponse = await client.search({
      //     index: 'cincinnati',
      //     body: playersObj,
      //   });

      //   response.players = playersResponse.hits.hits.map(hit => ({
      //     id: hit._id,
      //     fname: hit._source.fname,
      //     lname: hit._source.lname,
      //     position: hit._source.position,
      //     score: hit._source[field],
      //   }));
      //   break;
      // }
      // case 'core_attributes': {
      //   // dashboard core attributes chart

      //   const coreAttributesObj =
      //         Object.assign(getAggregationObj(coreAttributesFields), query);

      //   // TODO: combine as single request if possible?
      //   const coreAttributesPromise = client.search({
      //     index: 'cincinnati',
      //     body: coreAttributesObj,
      //   });

      //   const agdiagoBenchmarkPromise = client.search({
      //     index: 'baseline',
      //     body: coreAttributesObj,
      //   });

      //   const programBenchmarkPromise = client.search({
      //     index: 'cincinnati-benchmarks',
      //     body: coreAttributesObj,
      //   });

      //   const [
      //     coreAttributesResponse,
      //     agdiagoBenchmarkResponse,
      //     programBenchmarkResponse,
      //   ] = await Promise.all([
      //     coreAttributesPromise,
      //     agdiagoBenchmarkPromise,
      //     programBenchmarkPromise,
      //   ]);

      //   response.coreAttributes = coreAttributesResponse.aggregations;
      //   response.agdiagoBenchmark = agdiagoBenchmarkResponse.aggregations;
      //   response.programBenchmark = programBenchmarkResponse.aggregations;

      //   break;
      // }
      // case 'academic': {
      //   // dashboard academic chart
      //   var academicObj =
      //       Object.assign(getAggregationObj(academicFields), query);

      //   // TODO: combine as single request if possible?
      //   const academicPromise = client.search({
      //     index: 'cincinnati',
      //     body: academicObj,
      //   });

      //   const agdiagoBenchmarkPromise = client.search({
      //     index: 'baseline',
      //     body: academicObj,
      //   });

      //   const programBenchmarkPromise = client.search({
      //     index: 'cincinnati-benchmarks',
      //     body: academicObj,
      //   });

      //   const [
      //     academicResponse,
      //     agdiagoBenchmarkResponse,
      //     programBenchmarkResponse,
      //   ] = await Promise.all([
      //     academicPromise,
      //     agdiagoBenchmarkPromise,
      //     programBenchmarkPromise,
      //   ]);

      //   response.academic = academicResponse.aggregations;
      //   response.agdiagoBenchmark = agdiagoBenchmarkResponse.aggregations;
      //   response.programBenchmark = programBenchmarkResponse.aggregations;

      //   break;
      // }
      // case 'social_profile': {
      //   // dashboard social profile chart
      //   var socialProfileObj =
      //       Object.assign(getAggregationObj(socialProfileFields), query);

      //   // TODO: combine as single request if possible?
      //   const socialProfilePromise = client.search({
      //     index: 'cincinnati',
      //     body: socialProfileObj,
      //   });

      //   const agdiagoBenchmarkPromise = client.search({
      //     index: 'baseline',
      //     body: socialProfileObj,
      //   });

      //   const programBenchmarkPromise = client.search({
      //     index: 'cincinnati-benchmarks',
      //     body: socialProfileObj,
      //   });

      //   const [
      //     socialProfileResponse,
      //     agdiagoBenchmarkResponse,
      //     programBenchmarkResponse,
      //   ] = await Promise.all([
      //     socialProfilePromise,
      //     agdiagoBenchmarkPromise,
      //     programBenchmarkPromise,
      //   ]);

      //   response.socialProfile = socialProfileResponse.aggregations;
      //   response.agdiagoBenchmark = agdiagoBenchmarkResponse.aggregations;
      //   response.programBenchmark = programBenchmarkResponse.aggregations;

      //   break;
      // }
      // case 'cultural_fit': {
      //   // TODO: use actual cultural fit
      //   const culturalFitField = 'weight';

      //   // dashboard cultural fit chart
      //   const culturalFitBaselineObj = Object.assign({
      //     'size': 0,
      //     'aggs': {
      //       'percCulturalFit': {
      //         'percentiles': {
      //           'field': culturalFitField,
      //           'keyed': false,
      //           'percents': [
      //             45,
      //             75,
      //           ],
      //         },
      //       },
      //     },
      //   }, query);

      //   const culturalFitBaselineResponse = await client.search({
      //     index: 'baseline',
      //     body: culturalFitBaselineObj,
      //   });
      //   const [percLowFit, percMedFit] =
      //         culturalFitBaselineResponse.aggregations.percCulturalFit.values;
      //   const percentiles = [{
      //     percentileStart: 0,
      //     percentileEnd: 44,
      //   }, {
      //     percentileStart: 45,
      //     percentileEnd: 74,
      //   }, {
      //     percentileStart: 75,
      //     percentileEnd: 100,
      //   }];

      //   const culturalFitTeamObj = {
      //     'aggs': {
      //       'rangeCulturalFit': {
      //         'range': {
      //           'field': culturalFitField,
      //           'ranges': [
      //             {'to': percLowFit.value},
      //             {'from': percLowFit.value, 'to': percMedFit.value},
      //             {'from': percMedFit.value},
      //           ],
      //         },
      //       },
      //     },
      //   };

      //   const culturalFitTeamResponse = await client.search({
      //     index: 'cincinnati',
      //     body: culturalFitTeamObj,
      //   });

      //   response.culturalFit = culturalFitTeamResponse
      //     .aggregations
      //     .rangeCulturalFit
      //     .buckets
      //     .map((bucket, i) => ({
      //       rangeStart: bucket.from || 0,
      //       rangeEnd: bucket.to || 100,
      //       count: bucket.doc_count,
      //       percentileStart: percentiles[i].percentileStart,
      //       percentileEnd: percentiles[i].percentileEnd,
      //     }));

      //   break;
      // }
    };

    return res.json(response);
  });
};

/**
 * Use {@link Parser} instead.
 */
function parseParameter(param, req, part = 'body') {
  if (param === 'position') {
    return req[part][param] != null ? req[part][param].toLowerCase() : null;
  }
  return req[part][param] != null ? req[part][param] : null;
}

class Parser {
  constructor(req, response) {
    this.req = req;
    this.response = response;
  }

  parseParameter(param, part) {
    const value = parseParameter(param, this.req, part);
    this.response[param] = value;
    return value;
  }

  parseRequiredParameter(param, part) {
    const value = this.parseParameter.apply(this, arguments);
    if (value == null) throw new Error(`Unsupported ${param}: ${value}`);
    return value;
  }
}

function getAggregationObj(fields) {
  const obj = {
    'size': 0,
    'aggs': {},
  };

  fields.forEach(field => {
    obj.aggs[field] = {
      'avg': {
        'field': field,
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

// async function fetchPillarScore(index, query, programScores, factors) {
//   const nonNullKeys = Object.keys(programScores)
//     .filter(field => programScores[field] != null && programScores[field] > 0);
//   if (!nonNullKeys.length) return null;
//   const factorsArr = nonNullKeys.map(field => factors[field]);

//   const fetchObj = Object.assign({
//     'size': 0,
//     'aggs': {
//       'overallScore': {
//         'avg': {
//           'script': {
//             'lang': 'painless',
//             'source': `
// float score = 0;
// for (int i = 0; i < params['fields'].length; ++i) {
//   def field = params['fields'][i];
//   def value = (float)doc[field]?.value;
//   def programValue = (float)params['scores'][i];
//   def scoreInc = value ?: (value / programValue);
//   if (scoreInc == null) {

//   } else {
//     score += scoreInc;
//   }
// }
// return score / (float)params['fields'].length;
// `,
//             'params': {
//               'fields': nonNullKeys,
//               'scores': nonNullKeys.map(field => programScores[field]),
//             },
//           },
//         },
//       },
//     },
//   }, query);

//   const fetchResponse = await client.search({
//     index,
//     body: fetchObj,
//   });

//   const [agg] =
//         fetchResponse.aggregations.overallScore.value;
//   return agg.value * 100;
// }
