const logger = require('./logger');

function userService(db) {
  return function(req, res, next) {
    const token = req.headers['access-token'] || req.cookies['access-token'];
    
    if (token) {
      const user = db.get('users').find({ token }).value();
      if (user && user.token_expire > Date.now()) {
        logger.info(`success access by token, user: ${user.name}(${user.id})`)
        req.user = user;
      }
    }

    next();
  }
}

module.exports = userService;
