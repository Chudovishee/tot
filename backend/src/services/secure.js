const logger = require('../services/logger');

const LEVEL = {
  ALL: 0,
  USER: 1,
  CONFIGURE: 2,
  ADMIN: 3
};
module.exports = {
  LEVEL,
  ALL(req, res, next) {
    logger.info(`success ALL access to ${req.originalUrl}`);
    next();
  },
  USER(req, res, next) {
    if (req.user) {
      logger.info(`success USER access to ${req.originalUrl}`);
      next();
    }
    else {
      logger.info(`forbidden USER access to ${req.originalUrl}`);
      res.status(403).end();
    }
  },
  ADMIN(req, res, next) {
    if (req.user && req.user.access >= LEVEL.ADMIN) {
      logger.info(`success ADMIN access to ${req.originalUrl}`);
      next();
    }
    else {
      logger.info(`forbidden ADMIN access to ${req.originalUrl}`);
      res.status(403).end();
    }
  }
};
