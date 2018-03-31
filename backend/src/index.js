const config = require('config');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const logger = require('./services/logger');
const version = require('./api/version');
const user = require('./api/user');
const csrfService = require('./services/csrf');
const db = require('./services/db');
const userService = require('./services/user');

const host = config.get('host');
const port = config.get('port');
const apiPrefix = config.get('api_prefix');

const backendApp = express();

db.then((db) => {
  backendApp.use(csrfService);
  backendApp.use(bodyParser.json());
  backendApp.use(cookieParser());
  backendApp.use(userService(db));

  backendApp.get(`${apiPrefix}/version`, version);
  backendApp.use(`${apiPrefix}/user`, user(db));

  backendApp.listen(port, host);
  logger.info(`Running on http://${host}:${port}`);
});
