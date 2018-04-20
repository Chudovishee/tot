const Base = require('lowdb/adapters/Base');
const _ = require('lodash');

class ResolveAdapter extends Base {
  read() {
    return Promise.resolve(_.cloneDeep(this.defaultValue));
  }

  write() {
    return Promise.resolve();
  }
}

class RejectAdapter extends Base {
  read() {
    return Promise.resolve(_.cloneDeep(this.defaultValue));
  }

  write() {
    return Promise.reject();
  }
}

module.exports = {
  ResolveAdapter,
  RejectAdapter
};
