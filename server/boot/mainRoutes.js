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
      team: 'Cincinnati Bearcats',
      teamDisplay: 'Cincinnati Bearcats',
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

  // create custom pillar
  app.get('/addnewpillar', function(req, res, next) {
    res.render('addnewpillar', {
      team: 'Cincinnati Bearcats',
      positions: positionF,
    });
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
          es.fetchProgramBenchmarks({}, team),
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
          {},
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

        const pillars = Object.keys(domain.pillarsObj);

        let attributeParam;
        if (~pillars.indexOf(attribute)) {
          const programBenchmarks = await es.fetchProgramBenchmarks(
            {},
            team,
            [attribute]
          );
          attributeParam = {
            'script': es.buildScoreScript(attribute, programBenchmarks),
          };
        } else {
          attributeParam = attribute;
        }

        const query = queryBuilder.build();

        const percentileGroups = await es.fetchPercentileGroups(
          query,
          team,
          attributeParam,
        );

        response.groups = percentileGroups;

        break;
      }
      case 'players': {
        const attribute = parser.parseRequiredParameter('attribute');
        const sort = parser.parseParameter('sort');
        if (sort && sort !== 'asc' && sort !== 'desc') throw new Error(`Unsupported sort: ${sort}`);

        // TODO: implement between
        const limit = parser.parseParameter('limit');
        const between = parser.parseParameter('between');
        if (between && !(between instanceof Array)) throw new Error(`Unsupported between: ${between}`);

        const pillars = Object.keys(domain.pillarsObj);

        const defaultValueIfScript = 0;
        const isScript = ~pillars.indexOf(attribute);

        let attributeParam;
        if (isScript) {
          const programBenchmarks = await es.fetchProgramBenchmarks(
            {},
            team,
            [attribute]
          );

          if (between) {
            const [from, to] = between;
            queryBuilder.add(es.queryScoreRange(
              attribute,
              programBenchmarks,
              from,
              to
            ));
          }

          attributeParam = {
            [attribute]: {
              'script': es.buildScoreScript(
                attribute,
                programBenchmarks,
                {defaultValue: defaultValueIfScript}
                // HACK: sort doesn't work on nulls, so
                // have to supply default value
              ),
            },
          };
        } else {
          if (between) {
            const [from, to] = between;
            queryBuilder.add(es.queryRange(
              attribute,
              from,
              to
            ));
          }

          attributeParam = attribute;
        }

        if (limit != null) {
          queryBuilder.add({
            'body': {
              'size': limit,
            },
          });
        }

        if (sort) {
          let sortParam;
          if (attributeParam[attribute]) {
            sortParam = {
              '_script': {
                'type': 'number',
                'script': attributeParam[attribute]['script'],
                'order': sort,
              },
            };
          } else {
            sortParam = [
              {
                [attribute]: sort,
              },
            ];
          }
          queryBuilder.add({
            'body': {
              'sort': sortParam,
            },
          });
        }

        const query = queryBuilder.build();

        const players = await es.fetchPlayers(query, team, attributeParam);

        // HACK: sort doesn't work on nulls, so
        // have to supply default value and here revert it
        if (isScript) {
          players.forEach(player => {
            if (player.value === defaultValueIfScript) {
              player.value = null;
            }
          });
        }

        response.players = players;

        break;
      }
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
