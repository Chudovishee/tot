const _ = require('lodash');

class Base {
  constructor(data) {
    this.data = _(data || {});
  }

  value() {
    return this.data.value();
  }

  get(...args) {
    return this.data.get(...args);
  }

  push(...args) {
    this.data = this.data.push(...args);
    return this;
  }

  assign(...args) {
    this.data = this.data.assign(...args);
    return this;
  }

  remove(...args) {
    this.data = this.data.remove(...args);
    return this;
  }

  write(...args) {
    return this.data.write(...args);
  }
}

module.exports = Base;
