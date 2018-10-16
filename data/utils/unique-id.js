'use strict';

const ids = {};
let lastid = 1;

module.exports = function uniqueId(id) {
  if (id != null && id !== '') {
    if (ids[id] === true) throw new Error('Requesting already used id: ' + id);
    ids[id] = true;
    return id;
  }
  while (ids[lastid] === true) {
    lastid += 1;
  }
  ids[lastid] = true;
  return lastid;
};
