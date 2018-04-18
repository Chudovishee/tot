const config = require('config');
const { createLogger, format, transports } = require('winston');

const logFormat = config.get('log_format');

const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format[logFormat] ? format[logFormat]() : format.prettyPrint()
  ),
  level: config.get('log_level'),
  transports: [
    new transports.File({ filename: config.get('log_file') })
  ]
});

module.exports = logger;
