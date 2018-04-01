const dbAdapter = require('./services/db');
const server = require('./server');

dbAdapter.then((db) => {
  server(db);
});
