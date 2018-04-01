const dbAdapter = require('./services/db');
const Server = require('./server');

dbAdapter.then((db) => {
  Server(db);
});
