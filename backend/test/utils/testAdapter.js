const Base = require('lowdb/adapters/Base');
const _ = require('lodash');

class TestAdapter extends Base {
  read() {
    return Promise.resolve(_.cloneDeep(this.defaultValue));
  }

  write() {
    return Promise.resolve();
  }
}

module.exports = TestAdapter;
