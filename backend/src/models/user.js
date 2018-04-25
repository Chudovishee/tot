const crypto = require('crypto');
const config = require('config');
const validate = require('validate.js');

const sha256 = require('../utils/sha256');
const secure = require('../services/secure');

const Base = require('./base');

const cookieMaxAge = config.get('user_token_max_age');

class User extends Base {
  fetch(db) {
    this.data = db.get('users')
      .find({ name: this.get('name') });
    return this;
  }

  publish() {
    return this.data.pick(['name', 'token_expire', 'access']).value();
  }

  async login(password) {
    if (this.data.value() && this.data.value().password === sha256(String(password))) {
      const accessToken = crypto.randomBytes(32).toString('hex');

      await this.data.assign({
        token: accessToken,
        token_expire: Date.now() + cookieMaxAge
      })
        .write();

      return accessToken;
    }

    return false;
  }

  async logout() {
    if (this.data.value()) {
      await this.data
        .assign({
          token: false,
          token_expire: 0
        })
        .write();

      return true;
    }
    return false;
  }

  createValidate(db) {
    const fields = this.data.value();

    let errors = validate(fields, {
      name: {
        presence: true,
        format: {
          pattern: /^[\w]{4,20}$/,
          message: 'must be string with 4-20 characters'
        }
      },
      password: {
        presence: true
      },
      access: {
        presence: true,
        inclusion: {
          within: [secure.LEVEL.USER, secure.LEVEL.CONFIGURE, secure.LEVEL.ADMIN]
        }
      }
    });

    if ((!errors || Object.keys(errors).length === 0) &&
      db.get('users').find({ name: fields.name }).value()) {
      errors = {
        name: [`User with name "${fields.name}" already exists`]
      };
    }

    return errors;
  }

  editValidate() {
    const fields = this.data.value();

    return validate(fields, {
      name: {
        format: {
          pattern: /^[\w]{4,20}$/,
          message: 'user name must be string with 4-20 characters'
        }
      },
      access: {
        inclusion: {
          within: [secure.LEVEL.USER, secure.LEVEL.CONFIGURE, secure.LEVEL.ADMIN]
        }
      }
    });
  }

  setPassword(password) {
    if (password) {
      this.data = this.data.set('password', sha256(String(password)));
    }
    return this;
  }
}

module.exports = User;
