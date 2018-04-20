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
        next();
      }
      else {
        res.status(403).end();
      }
    }
    else {
      res.status(401).end();
    }
  };
}

module.exports = {
  LEVEL,
  ALL(req, res, next) {
    next();
  },
  USER: levelRule(LEVEL.USER),
  CONFIGURE: levelRule(LEVEL.CONFIGURE),
  ADMIN: levelRule(LEVEL.ADMIN)
};
