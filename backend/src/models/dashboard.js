const Base = require('./base');

class Dashboard extends Base {
  fetch(db) {
    this.data = db.get('dashboards')
      .find({ id: this.get('id') });
    return this;
  }

  shortPublish() {
    return this.data.pick(['id', 'name', 'description']).value();
  }

  publish() {
    return this.data.pick(['id', 'name', 'description', 'grid']).value();
  }
}

module.exports = Dashboard;
