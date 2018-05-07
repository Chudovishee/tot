const _ = require('lodash');

const Base = require('./base');
const BaseCollection = require('./baseCollection');
const Dashboard = require('./dashboard');

class Dashboards extends BaseCollection {
  fetch(db) {
    this.data = db.get('dashboards');
    return this;
  }

  push(...args) {
    const toPush = _(args)
      .map((model) => {
        if (model instanceof Base) {
          return model.value();
        }
        return model;
      })
      .map(model => _.defaults(model, { description: '', grid: [] }));

    this.data = this.data.push(...toPush);
    return this;
  }

  remove(predicate) {
    if (predicate instanceof Dashboard) {
      this.data = this.data.remove({ name: predicate.get('name').value() });
    }
    else {
      this.data = this.data.remove(predicate);
    }
    return this;
  }

  publish() {
    return this.data.map(dashboard => new Dashboard(dashboard).shortPublish()).value();
  }
}

module.exports = Dashboards;
