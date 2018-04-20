const _ = require('lodash');
const express = require('express');
const config = require('config');

const secure = require('../services/secure');
const User = require('../models/user');
const Users = require('../models/users');

function userApi(db, logger) {
  const cookieMaxAge = config.get('user_token_max_age');
  const router = express.Router();

  router.post('/:user/login', secure.ALL, (req, res) => {
    const user = new User({ name: req.params.user })
      .fetch(db);

    user.login(req.body.password)
      .then((accessToken) => {
        if (accessToken) {
          res.cookie('access-token', accessToken, {
            maxAge: cookieMaxAge,
            httpOnly: true
          });

          res.status(200)
            .json({ token: accessToken });
        }
        else {
          res.status(403).end();
        }
      })
      .catch((error) => {
        logger.error(`Unable login with db error: ${error}`);
        return res.status(500).end();
      });
  });

  router.post('/current/logout', secure.USER, (req, res) => {
    new User({ name: req.user.name })
      .fetch(db)
      .logout()
      .then(() => res.status(200).end())
      .catch((error) => {
        logger.error(`Unable logout with db error: ${error}`);
        return res.status(500).end();
      });
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

  router.post('/', secure.ADMIN, (req, res) => {
    const user = new User(_.pick(req.body, ['name', 'access']));
    user.setPassword(req.body.password);
    const errors = user.createValidate(db);

    if (!errors || Object.keys(errors).length === 0) {
      new Users().fetch(db)
        .push(user)
        .write()
        .then(() => res.status(200).end())
        .catch((error) => {
          logger.error(`Unable write user with db error: ${error}`);
          return res.status(500).end();
        });
    }
    else {
      res.status(400)
        .json(errors);
    }
  });

  router.put('/:user', secure.ADMIN, (req, res) => {
    const user = new User({ name: req.params.user })
      .fetch(db);

    if (user.value()) {
      const newUser = new User({
        name: req.params.user,
        access: req.body.access
      });
      newUser.setPassword(req.body.password);
      const errors = newUser.editValidate();

      if (!errors || Object.keys(errors).length === 0) {
        user.assign(newUser)
          .write()
          .then(() => res.status(200).end())
          .catch((error) => {
            logger.error(`Unable write user with db error: ${error}`);
            return res.status(500).end();
          });
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

  router.delete('/:user', secure.ADMIN, (req, res) => {
    const user = new User({ name: req.params.user })
      .fetch(db);
    if (user.value()) {
      new Users().fetch(db)
        .remove(user)
        .write()
        .then(() => res.status(200).end())
        .catch((error) => {
          logger.error(`Unable delete user with db error: ${error}`);
          return res.status(500).end();
        });
    }
    else {
      res.status(404).end();
    }
  });

  return router;
}

module.exports = userApi;
