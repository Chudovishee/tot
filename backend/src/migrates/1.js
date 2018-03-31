const sha256 = require('../utils/sha256');

module.exports = {
  up(db) {
    return db
      .set('users', [
        { id: 0, name: 'admin', password: sha256('admin'), token: false }
      ])
      .write();
  },
  down: false
};