const Base = require('./base');

class Dashboard extends Base {
  fetch(db) {
    this.data = db.get('dashboards')
      .find({ name: this.get('name') });
    return this;
  }

  publish() {
    return this.data.pick(['name']).value();
  }
}

module.exports = Dashboard;
