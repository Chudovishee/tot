const Base = require('lowdb/adapters/Base');

class TestAdapter extends Base {
  read() {
    return Promise.resolve(this.defaultValue);
  }

  write(data) {
    return Promise.resolve();
  }
}

module.exports = TestAdapter
