const secure = require('../services/secure');

module.exports = {
  up(db) {
    return db
      .get('users')
      .each((user) => {
        user.access = secure.LEVEL.USER;
      })
      .find({ id: 0 })
      .set('access', secure.LEVEL.ADMIN)
      .write();
  },
  down(db) {
    return db.get('users')
      .each((user) => {
        delete user.access;
      })
      .write();
  }
};
