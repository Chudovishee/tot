function userService(db) {
  return function (req, res, next) {
    const token = req.headers['access-token'] || req.cookies['access-token'];

    if (token) {
      const user = db.get('users').find({ token }).value();
      if (user && user.token_expire > Date.now()) {
        req.user = user;
      }
    }

    next();
  };
}

module.exports = userService;
