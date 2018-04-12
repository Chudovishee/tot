const _ = require('lodash');
const Base = require('./base');
const BaseCollection = require('./baseCollection');
const User = require('./user');


class Users extends BaseCollection {
  fetch(db) {
    this.data = db.get('users');
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
      .map(model => _.defaults(model, { token: false, token_expire: 0 }));

    this.data = this.data.push(...toPush);
    return this;
  }

  publish() {
    return this.data.map(user => new User(user).publish()).value();
  }
}

module.exports = Users;
