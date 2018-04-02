const _ = require('lodash');
const crypto = require('crypto');
const config = require('config');
const validate = require('validate.js');

const sha256 = require('../utils/sha256');
const secure = require('../services/secure');

const cookieMaxAge = config.get('user_token_max_age');

function find(db, name) {
  return db.get('users')
    .find({ name });
}

function User(db) {
  return {
    row: _({
      token: false,
      token_expire: 0
    }),

    fetch(name) {
      this.row = find(db, name || this.row.value().name);
      return this;
    },

    value() {
      return this.row.value();
    },

    assign(...args) {
      this.row = this.row.assign(...args);

      const newPasswordArg = _(args).reverse()
        .find(arg => arg.password);

      if (newPasswordArg) {
        this.row = this.row.set('password', sha256(String(newPasswordArg.password)));
      }
      return this;
    },

    push() {
      return db.get('users')
        .push(this.row.value())
        .write();
    },

    write() {
      if (this.row.write) {
        return this.row.write();
      }
      return Promise.reject(Error('Row is not database value'));
    },

    publish() {
      return this.row.pick(['name', 'token_expire', 'access']).value();
    },

    async login(password) {
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
    },

    async logout() {
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
    },

    createValidate() {
      const fields = this.row.value();

      let errors = validate(fields, {
        name: {
          presence: true,
          format: {
            pattern: /^[\w]{4,20}$/,
            message: 'user name must be string with 4-20 characters'
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
        find(db, fields.name).value()) {
        errors = {
          name: [`User with name "${fields.name}" already exists`]
        };
      }

      return errors;
    },
    editValidate() {
      const fields = this.row.value();

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
  };
}

module.exports = User;
