
module.exports = {
  up(db) {
    return db.get('users')
      .each((user) => {
        delete user.id;
      })
      .write();
  },
  down: false
};
