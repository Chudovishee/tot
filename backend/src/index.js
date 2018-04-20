const dbAdapter = require('./services/db');
const Server = require('./server');
const logger = require('./services/logger');

dbAdapter
  .then((db) => {
    Server(db, logger);
  })
  .catch((error) => {
    logger.error(`Unable to read database: ${error}`);
    throw error;
  });
