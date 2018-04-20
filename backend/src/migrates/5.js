
module.exports = {
  up(db) {
    return db.set('dashboards', [])
      .write();
  },
  down(db) {
    return db.remove('dashboards')
      .write();
  }
};
