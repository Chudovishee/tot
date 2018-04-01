const _ = require('lodash');
const crypto = require('crypto');
const express = require('express');
const config = require('config');
const sha256 = require('../utils/sha256');
const logger = require('../services/logger');
const secure = require('../services/secure');

function publishUser(user) {
  return _.pick(user, ['id', 'name', 'token_expire', 'access']);
}

function userApi(db) {
  const cookieMaxAge = config.get('user_token_max_age');
  const router = express.Router();

  // curl -D - -H "x-requested-with:XMLHttpRequest" -H "Content-Type: application/json" -X POST -d '{"password":"8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918"}'  http://127.0.0.1:8080/api/user/admin/login
  router.post('/:user/login', secure.ALL, async (req, res) => {
    let user = db.get('users')
      .find({ name: req.params.user, password: sha256(String(req.body.password)) });

    if (user.value()) {
      const accessToken = crypto.randomBytes(32).toString('hex');

      await user.assign({
        token: accessToken,
        token_expire: Date.now() + cookieMaxAge
      })
        .write();

      res.cookie('access-token', accessToken, {
        maxAge: cookieMaxAge,
        httpOnly: true
      });

      res.status(200)
        .json({ token: accessToken });

      user = user.value();
      logger.info(`success login, user: ${user.name}(${user.id})`);
    }
    else {
      res.status(403).end();
      logger.info(`fail login, user: ${req.params.user}`);
    }
  });

  router.post('/logout', secure.USER, async (req, res) => {
    await db.get('users')
      .find({ id: req.user.id })
      .assign({
        token: false,
        token_expire: 0
      })
      .write();

    res.status(200).end();
    logger.info(`success logout, user: ${req.user.name}(${req.user.id})`);
  });

  router.get('/', secure.USER, (req, res) => {
    res.json(publishUser(req.user));
  });

  router.get('/:user', secure.ADMIN, (req, res) => {
    const user = db.get('users')
      .find({ name: req.params.user })
      .value();

    if (user) {
      res.json(publishUser(user));
    }
    else {
      res.status(404).end();
    }
  });

  return router;
}

module.exports = userApi;
