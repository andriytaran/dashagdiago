'use strict';

const JSONStream = require('JSONStream');
const {Transform} = require('stream');

const uniqueId = require('./unique-id');

module.exports = function createStreams(index, type) {
  const input = JSONStream.parse().on('error', console.error);

  const output = new Transform({
    writableObjectMode: true,
    transform(node, _, next) {
      // eslint-disable-next-line max-len
      this.push(`{ "index" : { "_index" : "${index}", "_type" : "${type}", "_id" : "${uniqueId(node.id)}" }}\n`);
      this.push(JSON.stringify(node) + '\n');
      next();
    },
  }).on('error', console.log);

  return [input, output];
};
