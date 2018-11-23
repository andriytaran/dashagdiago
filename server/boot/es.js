'use strict';

const R = require('ramda');
const {ELASTICSEARCH_URL} = require('../env');
const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
  host: ELASTICSEARCH_URL,
});
const domain = require('./domain');

/**
 * @typedef {Object} ProgramBenchmarks
*/

const pillarsObj = domain.pillarsObj;

function getAttributeInfo(attribute) {
  for (let pillar in pillarsObj) {
    const pillarObj = pillarsObj[pillar];
    const attributeObj = pillarObj.fields[attribute];
    if (attributeObj) return Object.assign({
      pillar,
      reverse: false,
      factor: 10,
    }, attributeObj);
  }
  return null;
}

class QueryBuilder {
  constructor() {
    this.query = {};
  }

  add(query) {
    this.query = mergeQuery(this.query, query);
    return this;
  }

  cloneQuery() {
    return R.clone(this.query);
  }

  build() {
    return this.query;
  }
}

class AggregationBuilder {
  constructor() {
    this.avgFields = [];
    this.percentileFields = [];
    this.percentilesFields = [];
    this.queryBuilder = new QueryBuilder();
    this.queryBuilder.add({
      'body': {
        'size': 0,
      },
    });
  }

  addAvg(field, name = field) {
    let fieldObj;
    if (typeof field === 'string') {
      fieldObj = {
        'field': field,
      };
    } else {
      fieldObj = field;
    }

    this.queryBuilder.add({
      'body': {
        'aggs': {
          [name]: {
            'avg': fieldObj,
          },
        },
      },
    });
    this.avgFields.push(name);
    return this;
  }

  addPercentile(field, percentile, name = field) {
    let fieldObj;
    if (typeof field === 'string') {
      fieldObj = {
        'field': field,
      };
    } else {
      fieldObj = field;
    }

    this.queryBuilder.add({
      'body': {
        'aggs': {
          [name]: {
            'percentiles': R.mergeDeepRight({
              'keyed': false,
              'percents': [percentile],
            }, fieldObj),
          },
        },
      },
    });
    this.percentileFields.push(name);
    return this;
  }

  addPercentiles(field, percentiles, name = field) {
    let fieldObj;
    if (typeof field === 'string') {
      fieldObj = {
        'field': field,
      };
    } else {
      fieldObj = field;
    }

    this.queryBuilder.add({
      'body': {
        'aggs': {
          [name]: {
            'percentiles': R.mergeDeepRight({
              'percents': percentiles,
            }, fieldObj),
          },
        },
      },
    });
    this.percentilesFields.push(name);
    return this;
  }

  build() {
    return this.queryBuilder.build();
  }

  parseResponse(response) {
    const res = {};

    for (let field of this.avgFields) {
      res[field] = response.aggregations[field].value;
    }

    for (let field of this.percentileFields) {
      res[field] = response.aggregations[field].values[0].value;
    }

    for (let field of this.percentilesFields) {
      res[field] = response.aggregations[field].values;
    }

    return res;
  }
}

function mergeQuery(def, query) {
  return R.mergeDeepRight(def, query);
}

/**
 * Count all objects that satisfy query.
 * @param {Object} query ES Query object to filter results.
 * @param {string} team Team to query for.
 * @return {number}
 */
async function fetchCount(query, team) {
  const {count} = await client.count(mergeQuery({
    'index': team,
    'body': {
      // 'size': 0,
    },
  }, query));
  return count;
}

/**
 * Calculate average pillar score for given parameters.
 * @param {Object} query ES Query object to filter results.
 * @param {string} team Team to query for.
 * @param {string} pillar Pillar to calculate score for
 * @param {ProgramBenchmarks} [programBenchmarks]
 * Benchmarks to build score upon.
 * @return {number} 0-100 range percent score.
 */
async function fetchScore(query, team, pillar, programBenchmarks) {
  programBenchmarks = typeof programBenchmarks === 'undefined' ?
    await fetchProgramBenchmarks({}, team) :
    programBenchmarks;
  if (!programBenchmarks) return null;

  const aggregationBuilder = new AggregationBuilder()
    .addAvg(
      {
        'script': buildScoreScript(pillar, programBenchmarks),
      },
      pillar
    );

  const fetchObj = new QueryBuilder()
    .add({
      'index': team,
    })
    .add(aggregationBuilder.build())
    .add(query)
    .build();

  const fetchResponse = await client.search(fetchObj);

  const {[pillar]: score} = aggregationBuilder.parseResponse(fetchResponse);

  return score;
}

/**
 * Calculate 75 percentile of pillar score for agdiago
 * baseline players for given parameters.
 * @param {Object} query ES Query object to filter results.
 * @param {string} team Team to query for.
 * @param {string} pillar Pillar to calculate score for
 * @param {ProgramBenchmarks} [programBenchmarks]
 * Benchmarks to build score upon.
 * @return {number} 0-100 range percent score.
 */
async function fetchAgdiagoScore(query, team, pillar, programBenchmarks) {
  programBenchmarks = typeof programBenchmarks === 'undefined' ?
    await fetchProgramBenchmarks({}, team) :
    programBenchmarks;
  if (!programBenchmarks) return null;

  const aggregationBuilder = new AggregationBuilder()
    .addPercentile(
      {
        'script': buildScoreScript(pillar, programBenchmarks),
      },
      75,
      pillar
    );

  const fetchObj = new QueryBuilder()
    .add({
      'index': 'baseline',
    })
    .add(aggregationBuilder.build())
    .add(query)
    .build();

  const fetchResponse = await client.search(fetchObj);

  const {[pillar]: score} = aggregationBuilder.parseResponse(fetchResponse);

  return score;
}

/**
 * Calculate average overall score for given parameters.
 * @param {Object} query ES Query object to filter results.
 * @param {string} team Team to query for.
 * @param {ProgramBenchmarks} [programBenchmarks]
 * Benchmarks to build overall score upon.
 * @return {number} 0-100 range percent score.
 */
async function fetchOverallScore(query, team, programBenchmarks) {
  programBenchmarks = typeof programBenchmarks === 'undefined' ?
    await fetchProgramBenchmarks({}, team) :
    programBenchmarks;
  if (!programBenchmarks) return null;

  const pillars = Object.keys(programBenchmarks.pillars);
  if (!pillars.length) return null;

  const attributes = R.map(
    p => Object.keys(p),
    programBenchmarks.positions
  );
  const fetchObj = {
    'size': 0,
    'aggs': {
      'overallScore': {
        'avg': {
          'script': {

            'lang': 'painless',
            'source': `
def position = doc['position.keyword'].value;
if (position == null) return 0;
position = position.toLowerCase();

def attributes = params['attributes'][position];
if (attributes == null) return 0;

def attributeObjs = params['benchmarks'].positions[position];

Map scores = new HashMap();
for (int i = 0; i < params['pillars'].length; ++i) {
  scores[params['pillars'][i]] = (float)0;
}

Map factors = new HashMap();
for (int i = 0; i < params['pillars'].length; ++i) {
  factors[params['pillars'][i]] = (float)0;
}

for (int i = 0; i < attributes.length; ++i) {
  def attribute = attributes[i];
  def value = (float)doc[attribute]?.value;
  float score = 0;
  if (value == null) {
    score = score;
  } else {
    def attributeObj = attributeObjs[attribute];
    def programValue = (float)attributeObj.value;
    def reverse = attributeObj.reverse;
    def factor = (float)attributeObj.factor;
    def pillar = attributeObj.pillar;
    if (reverse) {
      score += factor * (programValue / value);
    } else {
      score += factor * (value / programValue);
    }
    scores[pillar] = scores[pillar] + score;
    factors[pillar] = factors[pillar] + factor;
  }
}

float totalScore = 0;
float totalFactor = 0;
for (int i = 0; i < params['pillars'].length; ++i) {
  def pillar = params['pillars'][i];
  def score = scores[pillar];
  if (score > 0) {
    def factor = (float)params['benchmarks'].pillars[pillar].factor;
    totalScore += factor * score / factors[pillar];
    totalFactor += factor;
  }
}
if (totalFactor > 0) {
  return totalScore / totalFactor;
} else {
  return 0;
}
`,
            'params': {
              'pillars': pillars,
              'attributes': attributes,
              'benchmarks': programBenchmarks,
            },
          },
        },
      },
    },
  };

  const fetchResponse = await client.search(mergeQuery({
    'index': team,
    'body': fetchObj,
  }, query));

  const agg =
    fetchResponse.aggregations.overallScore.value;
  return agg ? agg * 100 : null;
}

/**
 * Fetch Program benchmark values (75th percentiles).
 * @param {Object} query ES Query object to filter results.
 * @param {string} team Team to query for.
 * @param {string[]} [pillars] Pillars to get benchmarks for.
 * If omited, get all.
 * @return {ProgramBenchmarks}
 */
async function fetchProgramBenchmarks(
  query,
  team,
  pillars = Object.keys(pillarsObj)
) {
  const fields = R.flatten(
    pillars.map(pillar => Object.keys(pillarsObj[pillar].fields))
  );

  const fetchResponse = await client.search(mergeQuery({
    'index': team + '-benchmarks',
  }, query));

  const agg = fetchResponse.hits.hits.map(hit => hit._source);

  const positions = R.map(([group]) => {
    const res = {};
    fields.forEach(field => {
      if (group[field] != null && group[field] > 0)
        res[field] = Object.assign(
          getAttributeInfo(field),
          {value: group[field]},
        );
    });
    return res;
  }, R.groupBy(hit => hit.position.toLowerCase(), agg));

  return {
    positions: positions,
    pillars: R.map(pillar => ({
      factor: pillar.factor,
    }), pillarsObj),
  };
}

async function fetchPlayer(query, team, id) {
  const fetchObj = mergeQuery(queryByTerm('_id', id), query);

  const fetchResponse = await client.search(mergeQuery({
    'index': team,
  }, fetchObj));

  const playerHit = fetchResponse.hits.hits[0];
  const player = playerHit._source;
  player.id = playerHit._id;
  player.position = player.position == null ?
    player.position :
    player.position.toLowerCase();

  return player;
}

async function fetchPlayers(query, team, attributeParam) {
  const isScript = typeof attributeParam !== 'string';

  const sourceAttributes = ['fname', 'lname', 'position'];
  if (!isScript) {
    sourceAttributes.push(attributeParam);
  }

  const fetchObj = new QueryBuilder()
    .add({
      'index': team,
      'body': {
        'size': 10000,
        '_source': sourceAttributes,
      },
    })
    .add(isScript ? {
      'body': {
        'script_fields': attributeParam,
      },
    } : {})
    .add(query)
    .build();
  const fetchResponse = await client.search(fetchObj);
  const players = fetchResponse.hits.hits.map(hit => ({
    id: hit._id,
    fname: hit._source.fname,
    lname: hit._source.lname,
    position: hit._source.position,
    value: isScript ?
      hit.fields[Object.keys(attributeParam)[0]][0] :
      hit._source[attributeParam],
  }));

  return players;
}

async function fetchPillarAttributes(query, team, pillar) {
  const pillarAttributesList = Object.keys(domain.pillarsObj[pillar].fields);

  const aggregationBuilder = new AggregationBuilder();
  pillarAttributesList.forEach(
    attribute => aggregationBuilder.addAvg(attribute)
  );

  const fetchObj = new QueryBuilder()
    .add({
      'index': team,
    })
    .add(aggregationBuilder.build())
    .add(query)
    .build();

  const fetchResponse = await client.search(fetchObj);

  const pillarAttributes = aggregationBuilder.parseResponse(fetchResponse);

  return pillarAttributes;
}

async function fetchProgramPillarAttributes(query, team, pillar) {
  const pillarAttributesList = Object.keys(domain.pillarsObj[pillar].fields);

  const aggregationBuilder = new AggregationBuilder();
  pillarAttributesList.forEach(
    attribute => aggregationBuilder.addAvg(attribute)
  );

  const fetchObj = new QueryBuilder()
    .add({
      'index': team + '-benchmarks',
    })
    .add(aggregationBuilder.build())
    .add(query)
    .build();

  const fetchResponse = await client.search(fetchObj);

  const pillarAttributes = aggregationBuilder.parseResponse(fetchResponse);

  return pillarAttributes;
}

async function fetchAgdiagoPillarAttributes(query, pillar) {
  const pillarAttributesList = Object.keys(domain.pillarsObj[pillar].fields);

  const aggregationBuilder = new AggregationBuilder();
  pillarAttributesList.forEach(
    attribute => aggregationBuilder.addPercentile(attribute, 75)
  );

  const fetchObj = new QueryBuilder()
    .add({
      'index': 'baseline',
    })
    .add(aggregationBuilder.build())
    .add(query)
    .build();

  const fetchResponse = await client.search(fetchObj);

  const pillarAttributes = aggregationBuilder.parseResponse(fetchResponse);

  return pillarAttributes;
}

async function fetchPercentileGroups(query, team, attribute) {
  const aggregationBuilder = new AggregationBuilder()
    .addPercentiles(attribute, [45, 75], 'percentiles');

  let attributeObj;
  if (typeof attribute === 'string') {
    attributeObj = {
      'field': attribute,
    };
  } else {
    attributeObj = attribute;
  }

  const fetchObj = new QueryBuilder()
    .add({
      'index': 'baseline',
    })
    .add(aggregationBuilder.build())
    .add(query)
    .build();

  const fetchResponse = await client.search(fetchObj);

  const {percentiles} = aggregationBuilder.parseResponse(fetchResponse);
  const percentilesArr = Object.values(percentiles);

  const rangesObj = {
    'body': {
      'aggs': {
        'ranges': {
          'range': Object.assign({}, attributeObj, {
            'ranges': [
              {'to': percentilesArr[0]},
              {'from': percentilesArr[0], 'to': percentilesArr[1]},
              {'from': percentilesArr[1]},
            ],
          }),
        },
      },
    },
  };
  const percentileSteps = [0, 45, 75, 100];

  const rangesResponse = await client.search(new QueryBuilder()
    .add({
      index: team,
    })
    .add(rangesObj)
    .add(query)
    .build()
  );

  return rangesResponse
    .aggregations
    .ranges
    .buckets
    .map((bucket, i) => ({
      rangeStart: bucket.from,
      rangeEnd: bucket.to,
      count: bucket.doc_count,
      percentileStart: percentileSteps[i],
      percentileEnd: percentileSteps[i + 1],
    }));
}

function queryByTerm(term, value) {
  return value ? {
    'body': {
      'query': {
        'term': {
          [term]: value,
        },
      },
    },
  } : {};
}

function queryScriptField(field, script) {
  return {
    'body': {
      'script_fields': {
        [field]: {
          'script': script,
        },
      },
    },
  };
}

function queryRange(field, from, to) {
  return {
    'body': {
      'query': {
        'range': {
          [field]: {
            'gte': from,
            'lte': to,
          },
        },
      },
    },
  };
}

function queryScoreRange(pillar, programBenchmarks, from, to) {
  const attributes = R.map(
    p => Object.keys(p).filter(attr => p[attr].pillar === pillar),
    programBenchmarks.positions
  );
  return {
    'body': {
      'query': {
        'bool': {
          'filter': {
            'script': {
              'script': {
                'lang': 'painless',
                'source': `
def position = doc['position.keyword'].value;
if (position == null) return false;
position = position.toLowerCase();

def attributes = params['attributes'][position];
if (attributes == null) return false;

def attributeObjs = params['benchmarks'][position];

float totalScore = 0;
float totalFactor = 0;

for (int i = 0; i < attributes.length; ++i) {
  def attribute = attributes[i];
  def value = (float)doc[attribute]?.value;
  float score = 0;
  if (value == null) {
    score = score;
  } else {
    def attributeObj = attributeObjs[attribute];
    def programValue = (float)attributeObj.value;
    def reverse = attributeObj.reverse;
    def factor = (float)attributeObj.factor;
    if (reverse) {
      score += factor * (programValue / value);
    } else {
      score += factor * (value / programValue);
    }
    totalScore += score;
    totalFactor += factor;
  }
}

if (totalFactor > 0) {
  def res = 100 * totalScore / totalFactor;
  if (params['from'] == null) {
    if (params['to'] == null) {
      return true;
    } else {
      return res <= params['to'];
    }
  } else {
    if (params['to'] == null) {
      return res > params['from'];
    } else {
      return res > params['from'] && res < params['to'];
    }
  }
} else {
  return false;
}
            `,
                'params': {
                  'attributes': attributes,
                  'benchmarks': programBenchmarks.positions,
                  'from': from,
                  'to': to,
                },
              },
            },
          },
        },
      },
    },
  };
}

function buildScoreScript(
  pillar,
  programBenchmarks,
  {defaultValue = null} = {}
) {
  const attributes = R.map(
    p => Object.keys(p).filter(attr => p[attr].pillar === pillar),
    programBenchmarks.positions
  );

  return {
    'lang': 'painless',
    'source': `
def position = doc['position.keyword'].value;
if (position == null) return params['defaultValue'];
position = position.toLowerCase();

def attributes = params['attributes'][position];
if (attributes == null) return params['defaultValue'];

def attributeObjs = params['benchmarks'][position];

float totalScore = 0;
float totalFactor = 0;

for (int i = 0; i < attributes.length; ++i) {
  def attribute = attributes[i];
  def value = (float)doc[attribute]?.value;
  float score = 0;
  if (value == null) {
    score = score;
  } else {
    def attributeObj = attributeObjs[attribute];
    def programValue = (float)attributeObj.value;
    def reverse = attributeObj.reverse;
    def factor = (float)attributeObj.factor;
    if (reverse) {
      score += factor * (programValue / value);
    } else {
      score += factor * (value / programValue);
    }
    totalScore += score;
    totalFactor += factor;
  }
}

if (totalFactor > 0) {
  return 100 * totalScore / totalFactor;
} else {
  return params['defaultValue'];
}
`,
    'params': {
      'attributes': attributes,
      'benchmarks': programBenchmarks.positions,
      'defaultValue': defaultValue,
    },
  };
}

function queryScoreField(pillar, programBenchmarks) {
  return queryScriptField(pillar, buildScoreScript(pillar, programBenchmarks));
}

module.exports = {
  QueryBuilder,
  fetchCount,
  fetchScore,
  fetchAgdiagoScore,
  fetchOverallScore,
  fetchProgramBenchmarks,
  fetchPlayer,
  fetchPlayers,
  fetchPillarAttributes,
  fetchProgramPillarAttributes,
  fetchAgdiagoPillarAttributes,
  fetchPercentileGroups,
  buildScoreScript,
  queryByTerm,
  queryScriptField,
  queryScoreField,
  queryRange,
  queryScoreRange,
};
