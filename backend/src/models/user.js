const _ = require('lodash');
const crypto = require('crypto');
const config = require('config');

const sha256 = require('../utils/sha256');

const cookieMaxAge = config.get('user_token_max_age');

function User(db) {
  this.row = _({});

  this.fetch = function (name) {
    this.row = db.get('users')
      .find({ name });

    return this;
  };

  this.value = function () {
    return this.row.value();
  };

  this.assign = function (data) {
    this.row = this.row.assign(data);
    return this;
  };

  this.publish = function () {
    return this.row.pick(['name', 'token_expire', 'access']).value();
  };

  this.login = async function (password) {
    if (this.row.value() && this.row.value().password === sha256(String(password))) {
      const accessToken = crypto.randomBytes(32).toString('hex');

      await this.row.assign({
        token: accessToken,
        token_expire: Date.now() + cookieMaxAge
      })
        .write();

      return accessToken;
    }

    return false;
  };

  this.logout = async function () {
    if (this.row.value()) {
      await this.row
        .assign({
          token: false,
          token_expire: 0
        })
        .write();

      return true;
    }
    return false;
  };

  return this;
}

module.exports = User;
