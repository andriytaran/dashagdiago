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

const BluebirdPromise = require('bluebird');


const parseTeamFromQuery = (req) => {
  let team = req.query.school || 'cincinnati';
  if (team === 'null') {
    team = 'cincinnati';
  }
  return team
};

module.exports = app => {
  // Home
  app.get('/', async function (req, res, next) {
    const team = parseTeamFromQuery(req);

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
      ])
      .catch(function (err) {
        // @TODO fix
        console.log(err);
        return res.redirect('/new');
      });

    res.render('home', {
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
      team: 'Cincinnati Bearcats',
      teamDisplay: 'Cincinnati Bearcats',
      teamName: team,
    });
  });

  app.get('/profile', function (req, res, next) {
    const team = parseTeamFromQuery(req);
    res.render('pages/profile',{
      teamName: team,
    });
  });

  app.post('/api/createNewSchool', async function (req, res, next) {
    const { folderName } = req.body;
    const schoolName = req.body.schoolName.toLowerCase();

    await BluebirdPromise.mapSeries(positionF, (elem, i)=>{
      console.log(schoolName + '-benchmarks')
        return es.addDocument(schoolName + '-benchmarks', i+1, 'post', {
          "position": elem.value,
          "coreAttributesPersistence": 87,
          "coreAttributesWorkEthic": 63,
          "coreAttributesTeamOrientation": 49,
          "coreAttributesMastery": 53,
          "coreAttributesCompetitiveness": 55,
          "coreAttributesOverallScore": 59
        });
      })

    await ftp.importPlayersData('testSchool', folderName)
      .then(res => {
        return BluebirdPromise.mapSeries(res, (elem, i)=>{
          console.log(schoolName)
          const player = {
            id: elem.id,
            position: elem.position || 'DE',
            "fname": elem.fname,
            "lname": elem.lname,
            "coreAttributesCompetitiveness": parseFloat(elem.Competitiveness),
            "coreAttributesPersistence": parseFloat(elem.Persistence),
            "coreAttributesWorkEthic": parseFloat(elem['Work Ethic']),
            "coreAttributesTeamOrientation": parseFloat(elem['Team Orientation']),
            "coreAttributesMastery": parseFloat(elem.Mastery),
            "coreAttributesOverallScore": parseFloat(elem.Score),
          };
          return es.addPlayer(schoolName, player);
        });
      });

    res.send({});
  });

  app.get('/new', function (req, res, next) {
    const team = parseTeamFromQuery(req);
    res.render('new', { team: 'new', teamName: team, });
  });

  app.get('/contact', function (req, res, next) {
    const team = parseTeamFromQuery(req);
    res.render('pages/contact', {teamName: team,});
  });

  app.get('/faq', function (req, res, next) {
    const team = parseTeamFromQuery(req);
    res.render('pages/faq', {teamName: team,});
  });

  app.get('/branding', function (req, res, next) {
    const team = parseTeamFromQuery(req);
    res.render('pages/branding_page', {teamName: team,});
  });

  // Cultural Fit
  app.get('/cultural_fit', (req, res, next) => {
    const team = parseTeamFromQuery(req);
    res.render('pages/cultural_fit', {teamName: team,});
  });

  //dashboard-category
  app.get('/dashboard-category', async function (req, res, next) {
    const team = parseTeamFromQuery(req);
    const position = req.query.category != null ?
      req.query.category.toLowerCase() :
      null;
    const overallScore = await es.fetchOverallScore(
      es.queryByTerm('position', position),
      team
    );

    res.render('dashboard-category', {
      position: position.toUpperCase(),
      overallScore: Math.round(overallScore),
      teamName: team,
    });
  });

  //dashboard-position
  app.get('/dashboard-position', async function (req, res, next) {
    const team = parseTeamFromQuery(req);
    const position = req.query.position != null ?
      req.query.position.toLowerCase() :
      null;
    const overallScore = await es.fetchOverallScore(
      es.queryByTerm('position', position),
      team
    );

    res.render('dashboard-position', {
      position: position.toUpperCase(),
      overallScore: Math.round(overallScore),
      teamName: team,
    });
  });

  //dashboard-player
  app.get('/dashboard-player', async function (req, res, next) {
    const team = parseTeamFromQuery(req);
    res.render('dashboard-player', {teamName: team,});
  });

  // Player Assessment
  app.get('/player_assessment', (req, res, next) => {
    const team = parseTeamFromQuery(req);
    res.render('pages/player_assessment', {teamName: team,});
  });

  // Login
  app.get('/login', function (req, res, next) {
    const team = parseTeamFromQuery(req);
    res.render('login');
  });

  // Register
  app.get('/register', function (req, res, next) {
    const team = parseTeamFromQuery(req);
    res.render('register');
  });

  // create custom pillar
  app.get('/addnewpillar', function (req, res, next) {
    const team = parseTeamFromQuery(req);
    res.render('addnewpillar', {
      team: 'Cincinnati Bearcats',
      positions: positionF,
      teamName: team,
    });
  });

  // academic benchmark setup
  app.get('/academbench', function (req, res, next) {
    const team = parseTeamFromQuery(req);
    res.render('academbench', {
      team: 'Cincinnati Bearcats',
      positions: positionF,
      teamName: team,
    });
  });

  // emotional benchmark setup
  app.get('/emotionalbench', function (req, res, next) {
    const team = parseTeamFromQuery(req);
    res.render('emotionalbench', {
      team: 'Cincinnati Bearcats',
      positions: positionF,
      teamName: team,
    });
  });

  // core attributes benchmark setup
  app.get('/corebench', function (req, res, next) {
    const team = parseTeamFromQuery(req);
    res.render('corebench', {
      team: 'Cincinnati Bearcats',
      positions: positionF,
      teamName: team,
    });
  });

  // social benchmark setup
  app.get('/socialbench', function (req, res, next) {
    const team = parseTeamFromQuery(req);
    res.render('socialbench', {
      team: 'Cincinnati Bearcats',
      positions: positionF,
      teamName: team,
    });
  });

  // athletic benchmark setup
  app.get('/athleticbench', function (req, res, next) {
    const team = parseTeamFromQuery(req);
    res.render('athleticbench', {
      team: 'Cincinnati Bearcats',
      positions: positionF,
      teamName: team,
    });
  });

  const positionF = [
    { title: 'Quarterback', value: 'QB' },
    { title: 'Running Back', value: 'RB' },
    { title: 'Tight End', value: 'TE' },
    { title: 'Wide Receiver', value: 'WR' },
    { title: 'Punter', value: 'P' },
    { title: 'Kicker', value: 'K' },
    { title: 'Defensive Back', value: 'DB' },
    { title: 'Defensive End', value: 'DE' },
    { title: 'Defensive Tackle', value: 'DT' },
    { title: 'Defensive Line', value: 'DL' },
    { title: 'Long Snapper', value: 'LS' },
    { title: 'Offensive Line', value: 'OL' },
    { title: 'Linebacker', value: 'LB' },
    { title: 'Corner Back', value: 'CB' },
    { title: 'Offensive Guard', value: 'OG' },
    { title: 'Offensive Tackler', value: 'OT' },
    { title: 'Safety', value: 'S' },
  ];

  // dashboard data ajax handler
  // TODO: use loopback for this? or move to '/' handler?

  app.post('/api/dashboard-data', async function (req, res) {
    const team = parseTeamFromQuery(req);
    const response = { team };

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
            new es.QueryBuilder()
              .add(query)
              .add(es.queryByTerm('position', player.position.toLowerCase()))
              .build(),
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

      const player = await es.fetchPlayer(query, team, id);

      const [
        pillarAttributes,
        programPillarAttributes,
        agdiagoPillarAttributes,
      ] = await Promise.all([
        await es.fetchPillarAttributes(
          query,
          team,
          pillar,
          player.position
        ),
        await es.fetchProgramPillarAttributes(
          benchmarkQuery,
          team,
          pillar,
          player.position
        ),
        await es.fetchAgdiagoPillarAttributes(
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

      const isScript = ~pillars.indexOf(attribute) ||
        attribute === 'overallScore';

      if (isScript) {
        const programBenchmarks = await es.fetchProgramBenchmarks(
          {},
          team,
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
        team,
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

      const pillars = Object.keys(domain.pillarsObj);

      const defaultValueIfScript = 0;
      const isScript = ~pillars.indexOf(attribute) ||
        attribute === 'overallScore';

      let attributeParam;
      if (isScript) {
        const programBenchmarks = await es.fetchProgramBenchmarks(
          {},
          team,
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

      console.log(query, team, attributeParam);

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

      response.players = players.map(elem => {
        elem.team = team;
        return elem;
      });

      break;
    }
    }
    ;

    return res.json(response);
  });


  app.post('/api/dashboard-data-update', async function (req, res) {

    const team = 'test';
    const response = { team };

    const parser = new Parser(req, response);

    const type = parser.parseRequiredParameter('type');
    const position = parser.parseRequiredParameter('position');
    const benchmarks = parser.parseRequiredParameter('benchmarks');

    switch (type) {
    case 'benchmarks': {
      const attr = parser.parseParameter('attr');
      const query = {
        match: {
          position
        }
      };
      es.addOrUpdateDocument(team + '-benchmarks', query, 'test_type', benchmarks);
      break;
    }

    }
    ;

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
