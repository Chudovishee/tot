const _ = require('lodash');
const express = require('express');
const config = require('config');

const logger = require('../services/logger');
const secure = require('../services/secure');
const User = require('../models/user');

function userApi(db) {
  const cookieMaxAge = config.get('user_token_max_age');
  const router = express.Router();

  router.post('/:user/login', secure.ALL, async (req, res) => {
    const user = User(db).fetch(req.params.user);

    const accessToken = await user.login(req.body.password);

    if (accessToken) {
      res.cookie('access-token', accessToken, {
        maxAge: cookieMaxAge,
        httpOnly: true
      });

      res.status(200)
        .json({ token: accessToken });

      logger.info(`success login, user: ${user.name}`);
    }
    else {
      res.status(403).end();
      logger.info(`fail login, user: ${user.name}`);
    }
  });

  router.post('/logout', secure.USER, async (req, res) => {
    await User(db).fetch(req.user.name).logout();

    res.status(200).end();
    logger.info(`success logout, user: ${req.user.name}(${req.user.id})`);
  });

  router.get('/', secure.USER, (req, res) => {
    res.json(User().assign(req.user).publish());
  });

  router.get('/:user', secure.ADMIN, (req, res) => {
    const user = User(db).fetch(req.params.user);

    if (user.value()) {
      res.json(user.publish());
    }
    else {
      res.status(404).end();
    }
  });

  router.post('/', secure.ADMIN, async (req, res) => {
    const user = User(db).assign(_.pick(req.body, ['name', 'password', 'access']));
    const errors = user.createValidate();

    if (!errors || Object.keys(errors).length === 0) {
      await user.push();
      res.status(200).end();
    }
    else {
      res.status(400)
        .json(errors);
    }
  });

  router.put('/:user', secure.ADMIN, async (req, res) => {
    const user = User(db).fetch(req.params.user);

    if (user.value()) {
      const newUser = User().assign({ name: req.params.user }, _.pick(req.body, ['password', 'access']));
      const errors = newUser.editValidate();

      if (!errors || Object.keys(errors).length === 0) {
        await user.assign(newUser.value())
          .write();
        res.status(200).end();
      }
      else {
        res.status(400)
          .json(errors);
      }
    }
    else {
      res.status(404).end();
    }
  });

  return router;
}

module.exports = userApi;
