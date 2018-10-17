'use strict';

const {str, url, port, /* makeValidator, */ cleanEnv} = require('envalid');

// const requiredstr = makeValidator(x => {
//   if (!x) throw new Error('Required non-empty string')
//   return x.trim()
// })

const env = cleanEnv(process.env, {
  ELASTICSEARCH_URL: url({devDefault: 'https://search-agdiago-ajvfe7hmdvjahbf6544srce6xy.us-east-1.es.amazonaws.com'}),
}, {
  strict: true,
  transformer: function transformer(env) {
    if (env.ELASTICSEARCH_URL) {
      if (!env.ELASTICSEARCH_URL.endsWith('/')) {
        return Object.assign(env, {
          ELASTICSEARCH_URL: env.ELASTICSEARCH_URL + '/',
        });
      }
    }
    return env;
  },
});

// Read an environment variable, which is validated and cleaned during
// and/or filtering that you specified with cleanEnv().
// env.ADMIN_EMAIL     // -> 'admin@example.com'

// Envalid parses NODE_ENV automatically, and provides the following
// shortcut (boolean) properties for checking its value:
// env.isProduction    // true if NODE_ENV === 'production'
// env.isTest          // true if NODE_ENV === 'test'
// env.isDev           // true if NODE_ENV === 'development'

module.exports = env;
