Package.describe({
  name: 'simple:pg',
  version: '0.0.2',
  summary: 'XXX it almost does what you would expect',
  documentation: null
});

Npm.depends({
  'pg': '4.4.1',
  'murmurhash-js': '1.0.0'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');

  // PACKAGE DEPENDENCIES
  api.use([
    'underscore',
    'ecmascript',
    'simple:bookshelf'
  ]);

  api.use([
    'random',
    'ejson',
    'jsx'
  ], 'server');

  api.use([
    'dburles:mongo-collection-instances',
    'mongo'
  ], 'client');

  // ADD FILES
  api.addFiles([
    'pre.js',
    'transaction.js'
  ]);

  // observe driver
  api.use(['underscore', 'ddp-server'], 'server');
  api.addFiles(['observe-driver/polling-driver.js'], 'server');

  if (api.addAssets) {
    api.addAssets([
      'observe-driver/setup-triggers.sql',
      'observe-driver/poll-n-diff.sql',
      'observe-driver/poll.sql'
    ], 'server');
  } else {
    api.addFiles([
      'observe-driver/setup-triggers.sql',
      'observe-driver/poll-n-diff.sql',
      'observe-driver/poll.sql'
    ], 'server', { isAsset: true });
  }

  api.addFiles([
    'pg.js',
    'collection-server.js'
  ], 'server');

  api.addFiles([
    'collection-client.js'
  ], 'client');

  // Needs to be loaded last, uses setup from client or server
  api.addFiles([
    'collection.js'
  ]);

  // EXPORT
  api.export('PG');
  api.export('PgLiveQuery');
});

Package.onTest(function(api) {
  api.use(['tinytest', 'promise', 'simple:pg', 'ecmascript']);
  api.addFiles('pg-tests.js');
  api.addFiles('pg-server-tests.js', 'server');

  api.use(['ddp-server'], 'server');
  api.addFiles(['observe-driver/tests.js'], 'server');
});
