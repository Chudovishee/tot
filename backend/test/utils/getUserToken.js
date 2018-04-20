module.exports = function getUserToken(db, user) {
  return db.get('users')
    .find({ name: user })
    .value()
    .token;
};
