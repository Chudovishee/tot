const BaseCollection = require('./baseCollection');
const Dashboard = require('./dashboard');

class Dashboards extends BaseCollection {
  fetch(db) {
    this.data = db.get('dashboards');
    return this;
  }

  publish() {
    return this.data.map(dashboard => new Dashboard(dashboard).shortPublish()).value();
  }
}

module.exports = Dashboards;
