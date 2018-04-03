const logger = require('../services/logger');

const LEVEL = {
  ALL: 0,
  USER: 1,
  CONFIGURE: 2,
  ADMIN: 3
};

function levelRule(min) {
  return function (req, res, next) {
    if (req.user) {
      if (min === undefined || req.user.access >= min) {
        logger.info(`Success level ${req.user.access} access to ${req.originalUrl}`);
        next();
      }
      else {
        logger.info(`Forbidden level ${req.user.access} access to ${req.originalUrl}`);
        res.status(403).end();
      }
    }
    else {
      logger.info(`Unauthorized access to ${req.originalUrl}`);
      res.status(401).end();
    }
  };
}

module.exports = {
  LEVEL,
  ALL(req, res, next) {
    logger.info(`Success ALL access to ${req.originalUrl}`);
    next();
  },
  USER: levelRule(LEVEL.USER),
  CONFIGURE: levelRule(LEVEL.CONFIGURE),
  ADMIN: levelRule(LEVEL.ADMIN)
};
