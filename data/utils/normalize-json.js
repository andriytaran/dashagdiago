'use strict';

const {Transform} = require('stream');

const uniqueId = require('./unique-id');

function normalizeKey(key) {
  key = key.trim();
  return key[0].toLowerCase() + key.slice(1);
}

module.exports = function normalizeJson(json) {
  for (let key in json) {
    if (!json.hasOwnProperty(key)) continue;
    const normkey = normalizeKey(key);
    var value = json[key];
    delete json[key];
    json[normkey] = value;
  }
};
