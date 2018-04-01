module.exports = {
  up(db) {
    return db
      .get('users')
      .each((user) => {
        user.token_expire = 0;
      })
      .write();
  },
  down(db) {
    return db.get('users')
      .each((user) => {
        delete user.token_expire;
      })
      .write();
  }
};
