const config = require('config');
const express = require('express');
const logger = require('./logger');
const version = require('./version');
const csrfService = require('./services/csrf');

const host = config.get('host');
const port = config.get('port');
const apiPrefix = config.get('api_prefix');

const backendApp = express();

backendApp.use(csrfService);

backendApp.get(`${apiPrefix}/version`, version);

backendApp.listen(port, host);

logger.info(`Running on http://${host}:${port}`);
