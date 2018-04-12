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
    this.data.assign(...args);
  }

  write(...args) {
    return this.data.write(...args);
  }
}

module.exports = Base;
