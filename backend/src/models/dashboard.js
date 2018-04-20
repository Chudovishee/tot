const Base = require('./base');

class Dashboard extends Base {
  fetch(db) {
    this.data = db.get('dashboards')
      .find({ name: this.get('name') });
    return this;
  }

  shortPublish() {
    return this.data.pick(['name', 'description']).value();
  }

  publish() {
    return this.data.pick(['name', 'description', 'grid']).value();
  }
}

module.exports = Dashboard;
