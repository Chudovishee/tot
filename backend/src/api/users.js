const _ = require('lodash');
const express = require('express');
const config = require('config');

const logger = require('../services/logger');
const secure = require('../services/secure');
const User = require('../models/user');
const Users = require('../models/users');

function userApi(db) {
  const cookieMaxAge = config.get('user_token_max_age');
  const router = express.Router();

  router.post('/:user/login', secure.ALL, async (req, res) => {
    const user = new User({ name: req.params.user })
      .fetch(db);

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

  router.post('/current/logout', secure.USER, async (req, res) => {
    await new User({ name: req.user.name })
      .fetch(db)
      .logout();

    res.status(200).end();
    logger.info(`success logout, user: ${req.user.name}(${req.user.id})`);
  });

  router.get('/current', secure.USER, (req, res) => {
    res.json(new User({ name: req.user.name }).fetch(db).publish());
  });

  router.get('/:user', secure.ADMIN, (req, res) => {
    const user = new User({ name: req.params.user })
      .fetch(db);

    if (user.value()) {
      res.json(user.publish());
    }
    else {
      res.status(404).end();
    }
  });

  router.get('/', secure.ADMIN, async (req, res) => {
    res.json(new Users().fetch(db).publish());
  });

  router.post('/', secure.ADMIN, async (req, res) => {
    const user = new User(_.pick(req.body, ['name', 'password', 'access']));
    // const user = User(db).assign(_.pick(req.body, ['name', 'password', 'access']));
    const errors = user.createValidate(db);

    if (!errors || Object.keys(errors).length === 0) {
      await new Users().fetch(db)
        .push(user)
        .write();
      res.status(200).end();
    }
    else {
      res.status(400)
        .json(errors);
    }
  });

  router.put('/:user', secure.ADMIN, async (req, res) => {
    const user = new User({ name: req.params.user })
      .fetch(db);

    if (user.value()) {
      const newUser = new User({
        name: req.params.user,
        ..._.pick(req.body, ['password', 'access'])
      });
      const errors = newUser.editValidate();

      if (!errors || Object.keys(errors).length === 0) {
        await user.assign(newUser)
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

  router.delete('/:user', secure.ADMIN, async (req, res) => {
    const user = new User({ name: req.params.user })
      .fetch(db);
    if (user.value()) {
      debugger;
      await new Users().fetch(db)
        .remove(user)
        .write();
      res.status(200).end();
    }
    else {
      res.status(404).end();
    }
  });

  return router;
}

module.exports = userApi;
