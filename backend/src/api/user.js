const crypto = require('crypto');
const express = require('express');
const config = require('config');
const logger = require('../services/logger');

function userApi(db) {
  const cookieMaxAge = config.get('user_token_max_age');
  const router = express.Router();

  // curl -D - -H "x-requested-with:XMLHttpRequest" -H "Content-Type: application/json" -X POST -d '{"password":"8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918"}'  http://127.0.0.1:8080/api/user/admin/login
  router.post('/:user/login', async (req, res) => {
    let user = db.get('users')
      .find({ name: req.params.user, password: req.body.password });

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

      res.status(200).end();
      user = user.value();
      logger.info(`success login, user: ${user.name}(${user.id})`);
    }
    else {
      res.status(403).end();
      logger.info(`fail login, user: ${req.params.user}`);
    }
  });

  router.post('/logout', async (req, res) => {
    if (req.user) {
      await db.get('users')
        .find({ id: req.user.id })
        .assign({
          token: false,
          token_expire: 0
        })
        .write();

      res.status(200).end();
      logger.info(`success logout, user: ${req.user.name}(${req.user.id})`);
    }
    else {
      res.status(403).end();
      logger.info('forbidden logout');
    }
  });

  return router;
}

module.exports = userApi;
