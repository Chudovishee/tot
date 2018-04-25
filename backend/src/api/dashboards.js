const _ = require('lodash');
const express = require('express');

const secure = require('../services/secure');

const Dashboards = require('../models/dashboards');
const Dashboard = require('../models/dashboard');

function dashboardsApi(db, logger) {
  const router = express.Router();

  router.get('/', secure.USER, (req, res) => {
    res.json(new Dashboards().fetch(db).publish());
  });

  router.get('/:dashboard', secure.USER, (req, res) => {
    const dashboard = new Dashboard({ name: req.params.dashboard })
      .fetch(db);

    if (dashboard.value()) {
      res.json(dashboard.publish());
    }
    else {
      res.status(404).end();
    }
  });

  router.post('/', secure.CONFIGURE, (req, res) => {
    const dashboard = new Dashboard(_.pick(req.body, ['name', 'description']));
    const errors = dashboard.createValidate(db);

    if (!errors || Object.keys(errors).length === 0) {
      new Dashboards().fetch(db)
        .push(dashboard)
        .write()
        .then(() => res.status(200).end())
        .catch((error) => {
          logger.error(`Unable write dahboard with db error: ${error}`);
          return res.status(500).end();
        });
    }
    else {
      res.status(400)
        .json(errors);
    }
  });

  return router;
}

module.exports = dashboardsApi;
