const config = require('config');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const version = require('./api/version');
const users = require('./api/users');
const dashboards = require('./api/dashboards');
const stat = require('./api/stat');

const csrfService = require('./services/csrf');
const userService = require('./services/user');

const host = config.get('host');
const port = config.get('port');
const apiPrefix = config.get('api_prefix');

function Server(db, logger) {
  const app = express();
  app.use(csrfService);
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(userService(db));

  app.use(`${apiPrefix}/version`, version);
  app.use(`${apiPrefix}/users`, users(db, logger));
  app.use(`${apiPrefix}/dashboards`, dashboards(db, logger));
  app.use(`${apiPrefix}/stat`, stat(logger));

  const server = app.listen(port, host);
  logger.info(`Running on http://${host}:${port}`);

  return {
    app,
    server
  };
}

module.exports = Server;
