const express = require('express');
const config = require('config');

const logger = require('../services/logger');
const secure = require('../services/secure');
const User = require('../models/user');

// function userValidator(user) {
//   return validate(user, {
//     name: {
//       presence: true,
//       format: {
//         pattern: /^[\w]{4,20}$/,
//         message: 'user name must be string with 4-20 characters'
//       }
//     },
//     password: {
//       presence: true,
//       length: {
//         minimum: 6,
//         maximum: 32
//       }
//     },
//     access: {
//       presence: true,
//       exclusion: {
//         within: [secure.LEVEL.USER, secure.LEVEL.CONFIGURE, secure.LEVEL.ADMIN]
//       }
//     }
//   });
// }

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

  // router.post('/', secure.ADMIN, async (req, res) => {
  //   const newUser = req.body;

  //   let validatorErrors = userValidator(newUser);

  //   if (Object.keys(validatorErrors).length === 0 &&
  //     db.get('users').find({ name: req.body.name }).value()) {
  //     validatorErrors = {
  //       name: [`user with name "${req.body.name}" already exist`]
  //     };
  //   }

  //   if (Object.keys(validatorErrors).length === 0) {
  //     await db.get('users')
  //       .push({
  //         name: newUser.name,
  //         password: sha256(newUser.password),
  //         access: newUser.access,
  //         token: false
  //       })
  //       .write();
  //   }

  //   res.status(200).end();
  // });

  return router;
}

module.exports = userApi;
