'use strict';

require('express-async-errors');

const path = require('path');
const os = require('os');
const fs = require('fs');
const R = require('ramda');
const Client = require('ssh2-sftp-client');
const ftp = require('./../ftp');

const es = require('./es');
const domain = require('./domain');
const defaults = require('./defaults');
const {format} = require('./utils');
const auth = require('../login');
const { positionF } = defaults;

const parseTeamFromQuery = async (req, res) => {
  const team = (req.user && req.user.school) || 'cincinnati';

  const school = await es.getSchool(team);
  if (!school) res.redirect('/new');
  return school;
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// TODO delete this (it adds pillarsObj for cincinnati team to ES)
es.addDocument('cincinnati' + '-pillars', 1, 'post', defaults.pillarsObj);
es.addDocument('schools', 'cincinnati', 'post', {
  fullName: 'University of Cincinnati',
  shortName: 'cincinnati',
  id: 'cincinnati',
});

module.exports = app => {
  // Home
  app.get('/login', async function (req, res, next) {
    res.render('login', {
      errorMessage: ''
    });
  });

  app.use((req, res, next) => {
    const User = app.models.user;
    const AccessToken = app.models.AccessToken;
    const accessTokenId = req.signedCookies.access_token;
    if (!accessTokenId) {
      return next();
    }

    AccessToken.findById(accessTokenId, function (err, token) {
      if (err || !token) {
        return next();
      } else {
        User.findById(token.userId, (err, user) => {
          if (err) {
            return next();
          } else {
            req.user = user;
            return next();
          }
        });
      }
    });
  });

  app.use(function (req, res, next) {
    // console.log(req.user);
    if (!req.user) {
      res.redirect('/login');
    } else {
      next();
    }
  });

  app.get('/', async (req, res, next) => {

    const { athleteId, school, role } = req.user;

    const user = req.user || {};

    if (role === 'player') {
      return res.redirect(`dashboard-player/?id=${athleteId}`);
    }
    const team = await parseTeamFromQuery(req, res);

    res.render('welcome', {
      team: team.id,
      teamDisplay: capitalizeFirstLetter(team.fullName),
      user,
    });
  });

  app.get('/all', async (req, res, next) => {

    const team = await parseTeamFromQuery(req, res);
    const user = req.user || {};
    const { highschoolGraduationYear = "ALL" } = req.query;

    res.render('all', {
      overallCount:0,
      defenseCount:0,
      offenseCount:0,
      overallScore: 0,
      team: team.id,
      teamDisplay: capitalizeFirstLetter(team.fullName),
      user,
      highschoolGraduationYear
    });
  });


  app.get('/class', async (req, res, next) => {

    const { highschoolGraduationYear = "ALL" } = req.query;

    const { athleteId, school, role } = req.user;

    const user = req.user || {};

    if (role === 'player') {
      return res.redirect(`dashboard-player/?id=${athleteId}`);
    }
    const team = await parseTeamFromQuery(req, res);
    const pillarsObj = await es.getPillarsObj(team.id);
    const [
      overallCount,
      offenseCount,
      defenseCount,
      overallScore,
    ] = await Promise.all([
        es.fetchCount({}, team.id),
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
        }, team.id),
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
        }, team.id),
        es.fetchOverallScore(pillarsObj, {}, team.id),
      ])
      .catch(function (err) {
        // @TODO fix
        console.log(err);
        return res.redirect('/new');
      });

    res.render('class', {
      overallCount,
      defenseCount,
      offenseCount,
      // defensePercent: overallCount ?
      //   Math.round(100 * defenseCount / overallCount) :
      //   null,
      // offensePercent: overallCount ?
      //   Math.round(100 * offenseCount / overallCount) :
      //   null,
      overallScore: Math.round(overallScore),
      team: team.id,
      teamDisplay: capitalizeFirstLetter(team.fullName),
      user,
      highschoolGraduationYear,
    });
  });

  app.get('/profile', async function (req, res, next) {
    const team = await parseTeamFromQuery(req, res);
    const user = req.user || {};
    res.render('pages/profile', {
      team: team.id,
      teamDisplay: capitalizeFirstLetter(team.fullName),
      user,
    });
  });

  app.post('/api/createNewSchool', async function (req, res, next) {
    try {
      await ftp.importPlayersData(req.body);
    } catch (err) {
      return res.status(500).send('Please check file name');
    }
    res.send({});
  });

  app.get('/new', async function (req, res, next) {
    const user = req.user || {};
    res.render('new', {
      team: '',
      teamDisplay: '',
      user,
    });
  });

  app.get('/contact', async function (req, res, next) {
    const team = await parseTeamFromQuery(req, res);
    const user = req.user || {};
    res.render('pages/contact', {
      team: team.id,
      teamDisplay: capitalizeFirstLetter(team.fullName),
      user,
    });
  });

  app.get('/faq', async function (req, res, next) {
    const team = await parseTeamFromQuery(req, res);
    const user = req.user || {};
    res.render('pages/faq', {
      team: team.id,
      teamDisplay: capitalizeFirstLetter(team.fullName),
      user,
    });
  });

  app.get('/branding', async function (req, res, next) {
    const team = await parseTeamFromQuery(req, res);
    const user = req.user || {};
    res.render('pages/branding_page', {
      team: team.id,
      teamDisplay: capitalizeFirstLetter(team.fullName),
      user,
    });
  });

  // Cultural Fit
  app.get('/cultural_fit', async (req, res, next) => {
    const team = await parseTeamFromQuery(req, res);
    const user = req.user || {};
    res.render('pages/cultural_fit', {
      team: team.id,
      teamDisplay: capitalizeFirstLetter(team.fullName),
      user,
    });
  });

  //dashboard-category
  app.get('/dashboard-category', async function (req, res, next) {
    const team = await parseTeamFromQuery(req, res);
    const user = req.user || {};
    const pillarsObj = await es.getPillarsObj(team.id);
    const position = req.query.category != null ?
      req.query.category.toLowerCase() :
      null;
    const overallScore = await es.fetchOverallScore(
      pillarsObj,
      es.queryByTerm('position', position),
      team.id
    );

    res.render('dashboard-category', {
      position: position.toUpperCase(),
      overallScore: Math.round(overallScore),
      team: team.id,
      teamDisplay: capitalizeFirstLetter(team.fullName),
      user,
    });
  });

  //dashboard-position
  app.get('/dashboard-position', async function (req, res, next) {

    const { highschoolGraduationYear = "ALL" } = req.query;

    const user = req.user || {};
    const { athleteId, school, role } = req.user;

    if (role === 'player') {
      return res.redirect(`/dashboard-player/?id=${athleteId}`);
    }

    const team = await parseTeamFromQuery(req, res);
    const pillarsObj = await es.getPillarsObj(team.id);
    const position = req.query.position != null ?
      req.query.position.toLowerCase() :
      null;
    const overallScore = await es.fetchOverallScore(
      pillarsObj,
      es.queryByTerm('position', position),
      team.id
    );

    res.render('dashboard-position', {
      position: position.toUpperCase(),
      overallScore: Math.round(overallScore),
      team: team.id,
      teamDisplay: capitalizeFirstLetter(team.fullName),
      user,
      highschoolGraduationYear
    });
  });

  app.get('/oldDashboard-position', async function (req, res, next) {

    const { highschoolGraduationYear = "ALL" } = req.query;

    const user = req.user || {};
    const { athleteId, school, role } = req.user;

    if (role === 'player') {
      return res.redirect(`/dashboard-player/?id=${athleteId}`);
    }

    const team = await parseTeamFromQuery(req, res);
    const pillarsObj = await es.getPillarsObj(team.id);
    const position = req.query.position != null ?
      req.query.position.toLowerCase() :
      null;
    const overallScore = await es.fetchOverallScore(
      pillarsObj,
      es.queryByTerm('position', position),
      team.id
    );

    res.render('oldDashboard-position', {
      position: position.toUpperCase(),
      overallScore: Math.round(overallScore),
      team: team.id,
      teamDisplay: capitalizeFirstLetter(team.fullName),
      user,
      highschoolGraduationYear
    });
  });

  //dashboard-player
  app.get('/dashboard-player', async function (req, res, next) {
    const { highschoolGraduationYear = "ALL" } = req.query;

    const user = req.user || {};
    const team = await parseTeamFromQuery(req, res);
    res.render('dashboard-player', {
      team: team.id,
      teamDisplay: capitalizeFirstLetter(team.fullName),
      user,
      highschoolGraduationYear
    });
  });

  // Player Assessment
  app.get('/player_assessment', async (req, res, next) => {
    const team = await parseTeamFromQuery(req, res);
    const user = req.user || {};
    res.render('pages/player_assessment', {
      team: team.id,
      teamDisplay: capitalizeFirstLetter(team.fullName),
      user,
    });
  });

  // Login
  app.get('/login', async function (req, res, next) {
    const team = await parseTeamFromQuery(req, res);
    res.render('login', {
      errorMessage: ''
    });
  });

  // Register
  app.get('/register', async function (req, res, next) {
    const team = await parseTeamFromQuery(req, res);
    res.render('register');
  });

  // New Athlete Info setup
  app.get('/addnewathlete', async function (req, res, next) {
    const team = await parseTeamFromQuery(req, res);
    const user = req.user || {};
    const { athleteId, school, role } = req.user;
    const { highschoolGraduationYear = "ALL" } = req.query;
    const { id } = req.query;

    let athlete = {};

    const playerId = athleteId || id;

    if (playerId) {
      athlete = await es.getPlayer(school, playerId) || {};
    }

    res.render('addnewplayer', {
      team: team.shortName,
      positions: positionF,
      teamDisplay: team.fullName,
      format,
      user,
      athlete,
      highschoolGraduationYear,
    });
  });

  app.get('/oldAddnewathlete', async function (req, res, next) {
    const team = await parseTeamFromQuery(req, res);
    const user = req.user || {};
    const { athleteId, school, role } = req.user;

    const athlete = await es.getPlayer(school, athleteId) || {};

    res.render('addnewplayer', {
      team: team.shortName,
      format,
      positions: positionF,
      teamDisplay: team.fullName,
      user,
      athlete,
    });
  });

  app.post('/api/updatePlayer', async function (req, res, next) {
    const player = req.body;
    const { athleteId, school, role } = req.user;
    await es.updatePlayer(school, player.id, player);
    return res.json({status: "OK"});

  });

  app.post('/api/createPlayer', async function (req, res, next) {
    const player = req.body;
    const { school } = req.user;
    await es.createPlayer(school, player);
    return res.json({status: "OK"});
  });

  // create custom pillar
  app.get('/addnewpillar', async function (req, res, next) {
    const team = await parseTeamFromQuery(req, res);
    const user = req.user || {};
    res.render('addnewpillar', {
      positions: positionF,
      team: team.id,
      teamDisplay: capitalizeFirstLetter(team.fullName),
      user,
    });
  });

  // academic benchmark setup
  app.get('/academbench', async function (req, res, next) {
    const team = await parseTeamFromQuery(req, res);
    const user = req.user || {};
    res.render('academbench', {
      positions: positionF,
      team: team.id,
      teamDisplay: capitalizeFirstLetter(team.fullName),
      user,
    });
  });

  // emotional benchmark setup
  app.get('/emotionalbench', async function (req, res, next) {
    const team = await parseTeamFromQuery(req, res);
    const user = req.user || {};
    res.render('emotionalbench', {
      positions: positionF,
      team: team.id,
      teamDisplay: capitalizeFirstLetter(team.fullName),
      user,
    });
  });

  // core attributes benchmark setup
  app.get('/benchmark-input', async function (req, res, next) {
    const team = await parseTeamFromQuery(req, res);

    const {pillar = 'coreAttributes'} = req.query ;

    const user = req.user || {};
    const benchmarks = await es.getBenchmarks(team.id, 'QB');
    const factors = await es.getFactors(team.id, pillar);
    const factor = await es.getFactor(team.id, pillar);

    const renderData = {
      positions: positionF,
      team: team.id,
      teamDisplay: capitalizeFirstLetter(team.fullName),
      benchmarks,
      pillar,
      factors,
      factor,
      user,
    };

    res.render('benchmark-input', renderData);
  });

  app.get('/corebench', async function (req, res, next) {
    const team = await parseTeamFromQuery(req, res);
    const user = req.user || {};
    const benchmarks = await es.getBenchmarks(team.id, 'QB');
    const factors = await es.getFactors(team.id, 'coreAttributes');
    res.render('corebench', {
      positions: positionF,
      team: team.id,
      teamDisplay: capitalizeFirstLetter(team.fullName),
      benchmarks,
      factors,
      user,
    });
  });

  // social benchmark setup
  app.get('/socialbench', async function (req, res, next) {
    const team = await parseTeamFromQuery(req, res);
    const user = req.user || {};
    res.render('socialbench', {
      positions: positionF,
      team: team.id,
      teamDisplay: capitalizeFirstLetter(team.fullName),
      user,
    });
  });

  // athletic benchmark setup
  app.get('/athleticbench', async function (req, res, next) {
    const team = await parseTeamFromQuery(req, res);
    const user = req.user || {};
    res.render('athleticbench', {
      positions: positionF,
      team: team.id,
      teamDisplay: capitalizeFirstLetter(team.fullName),
      user,
    });
  });

  app.get('api/update-new-player', async function (req, res, next) {
    const team = await parseTeamFromQuery(req, res);
    const user = req.user || {};
    res.render('athleticbench', {
      positions: positionF,
      team: team.id,
      teamDisplay: capitalizeFirstLetter(team.fullName),
      user,
    });
  })

  // dashboard data ajax handler
  // TODO: use loopback for this? or move to '/' handler?

  app.post('/api/dashboard-data', async function (req, res) {

    const team = await parseTeamFromQuery(req, res);
    const pillarsObj = await es.getPillarsObj(team.id);
    const response = { team: team.id };

    const parser = new Parser(req, response);

    const position = parser.parseParameter('position');
    let highschoolGraduationYear = parser.parseOptionalParameter('highschoolGraduationYear');

    if (highschoolGraduationYear === 'ALL'){
      highschoolGraduationYear = null;
    }

    const type = parser.parseRequiredParameter('type');

    const queryBuilder = new es.QueryBuilder();
    queryBuilder.add(es.queryByTerm('position', position));
    queryBuilder.add(es.queryByTerm(
      'highschoolGraduationYear',
      highschoolGraduationYear
    ));

    const { athleteId, school, role } = req.user;
    let ID;
    if (role === 'player' && parser.parseParameter('id')) {
      ID = athleteId;
    }

    switch (type) {
      case 'single_player': {
        const id = ID || parser.parseRequiredParameter('id');
        const query = queryBuilder.build();
        const [
          programBenchmarks,
          player,
        ] = await Promise.all([
          es.fetchProgramBenchmarks(pillarsObj, {}, team.id),
          es.fetchPlayer(query, team.id, id),
        ]);

        const scores = domain.calculatePlayerScores(pillarsObj, player, programBenchmarks);
        const overallScore = domain.calculatePlayerOverallScore(
          scores,
          programBenchmarks
        );

        const pillars = Object.keys(scores);
        const agdiagoScoresArr = await Promise.all(
          pillars.map(
            pillar => es.fetchAgdiagoScore(
              pillarsObj,
              new es.QueryBuilder()
                .add(query)
                .add(es.queryByTerm('position', player.position.toLowerCase()))
                .build(),
              team.id,
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
        const id = ID || parser.parseParameter('id');

        if (!pillar) throw new Error('Unsupported pillar: ' + pillar);

        const benchmarkQuery = queryBuilder.cloneQuery();
        queryBuilder.add(es.queryByTerm('_id', id));
        const query = queryBuilder.build();

        const player = await es.fetchPlayer(query, team.id, id);

        const [
          pillarAttributes,
          programPillarAttributes,
          agdiagoPillarAttributes,
        ] = await Promise.all([
          await es.fetchPillarAttributes(
            pillarsObj,
            query,
            team.id,
            pillar,
            player.position
          ),
          await es.fetchProgramPillarAttributes(
            pillarsObj,
            benchmarkQuery,
            team.id,
            pillar,
            player.position
          ),
          await es.fetchAgdiagoPillarAttributes(
            pillarsObj,
            benchmarkQuery,
            pillar,
            player.position
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

        const pillars = Object.keys(pillarsObj);

        const programBenchmarks = await es.fetchProgramBenchmarks(
          pillarsObj,
          {},
          team.id,
          pillars
        );

        const [scoresArr, agdiagoScoresArr] = await Promise.all([
          Promise.all(pillars.map(
            pillar => es.fetchScore(
              pillarsObj,
              query,
              team.id,
              pillar,
              programBenchmarks
            )
          )),
          Promise.all(pillars.map(
            pillar => es.fetchAgdiagoScore(
              pillarsObj,
              query,
              team.id,
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

        const pillars = Object.keys(pillarsObj);

        let attributeParam;

        const isScript = ~pillars.indexOf(attribute) ||
          attribute === 'overallScore';

        if (isScript) {
          const programBenchmarks = await es.fetchProgramBenchmarks(
            pillarsObj,
            {},
            team.id,
            attribute === 'overallScore' ? undefined : [attribute]
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
          team.id,
          attributeParam
        );

        response.groups = percentileGroups;

        break;
      }
      case 'players': {
        const attribute = parser.parseRequiredParameter('attribute');

        const sort = parser.parseParameter('sort');
        if (sort && sort !== 'asc' && sort !== 'desc') throw new Error(`Unsupported sort: ${sort}`);

        const limit = parser.parseParameter('limit');

        const between = parser.parseParameter('between');
        if (between && !(between instanceof Array)) throw new Error(`Unsupported between: ${between}`);

        const offenseDefense = parser.parseParameter('offenseDefense');
        if (
          offenseDefense != null &&
          offenseDefense !== 0 &&
          offenseDefense !== 1
        ) {
          throw new Error(`Unsupported offenseDefense: ${offenseDefense}`);
        }

        if (offenseDefense != null) {
          queryBuilder.add(es.queryByTerm('offenseDefense', offenseDefense));
        }

        const pillars = Object.keys(pillarsObj);

        const defaultValueIfScript = 0;
        const isScript = ~pillars.indexOf(attribute) ||
          attribute === 'overallScore';

        let attributeParam;
        if (isScript) {
          const programBenchmarks = await es.fetchProgramBenchmarks(
            pillarsObj,
            {},
            team.id,
            attribute === 'overallScore' ? undefined : [attribute]
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
                { defaultValue: defaultValueIfScript }
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

        const players = await es.fetchPlayers(query, team.id, attributeParam);

        // HACK: sort doesn't work on nulls, so
        // have to supply default value and here revert it
        if (isScript) {
          players.forEach(player => {
            if (player.value === defaultValueIfScript) {
              player.value = null;
            }
          });
        }

        response.players = players.map(elem => {
          elem.team = team.id;
          return elem;
        });

        break;
      }
      case 'benchmarks':
        const sort = parser.parseParameter('sort');
        const group = parser.parseParameter('group');
        if (sort && sort !== 'asc' && sort !== 'desc') throw new Error(`Unsupported sort: ${sort}`);

        const benchmarks = await es.getBenchmarks(team.id, position);
        const factors = await es.getFactors(team.id, group);

        response.benchmarks = benchmarks || {};
        response.factors = factors;
    };

    return res.json(response);
  });

  app.post('/api/dashboard-data-update', async function (req, res) {
    const team = await parseTeamFromQuery(req, res);

    const response = { team: team.id };

    const parser = new Parser(req, response);

    const type = parser.parseRequiredParameter('type');
    const position = parser.parseRequiredParameter('position');
    const benchmarks = parser.parseRequiredParameter('benchmarks');
    const factors = parser.parseRequiredParameter('factors');
    const factor = parser.parseRequiredParameter('factor');
    const pillar = parser.parseRequiredParameter('pillar');

    const existingBenchmarks = (await es.getBenchmarks(team.id, position)) || {};

    switch (type) {
      case 'benchmarks': {
        const query = {
          match: {
            position,
          },
        };
        es.addOrUpdateDocument(team.id + '-benchmarks', query, 'post', {...existingBenchmarks, ...benchmarks});
        es.updatePillarsObj(team.id, pillar, factor, factors);
        break;
      }
    }

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

  parseOptionalParameter(param, part) {
    const value = parseParameter(param, this.req, part);
    if (value !== null) {
      this.response[param] = value;
    }
    return value;
  }

  parseRequiredParameter(param, part) {
    const value = this.parseParameter.apply(this, arguments);
    if (value == null) throw new Error(`Unsupported ${param}: ${value}`);
    return value;
  }
}
