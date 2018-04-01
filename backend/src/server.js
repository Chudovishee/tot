const config = require('config');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const logger = require('./services/logger');
const version = require('./api/version');
const user = require('./api/user');
const csrfService = require('./services/csrf');
const userService = require('./services/user');

const host = config.get('host');
const port = config.get('port');
const apiPrefix = config.get('api_prefix');

function server(db) {
  const app = express();
  app.use(csrfService);
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(userService(db));

  app.use(`${apiPrefix}/version`, version);
  app.use(`${apiPrefix}/user`, user(db));

  const server = app.listen(port, host);
  logger.info(`Running on http://${host}:${port}`);

  return {
    app,
    server
  };
}

module.exports = server;