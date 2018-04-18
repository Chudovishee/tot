const config = require('config');
const express = require('express');
const bodyParser = require('body-parser');

const logger = require('./services/logger');

const host = config.get('host');
const port = config.get('port');

const app = express();
app.use(bodyParser.json());

const server = app.listen(port, host);
logger.info(`Running on http://${host}:${port}`);
