const _ = require('lodash');
const express = require('express');

const secure = require('../services/secure');

const Dashboards = require('../models/dashboards');
const Dashboard = require('../models/dashboard');

function pickDashboardData(data) {
  const result = _.pick(data, ['name', 'description', 'grid']);
  if (result.grid) {
    result.grid = _.map(result.grid, item => _.pick(item, ['i', 'x', 'y', 'w', 'h', 'type', 'sources']));
  }
  return result;
}

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
    const dashboard = new Dashboard(pickDashboardData(req.body));
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

  router.put('/:dashboard', secure.CONFIGURE, (req, res) => {
    const dashboard = new Dashboard({ name: req.params.dashboard })
      .fetch(db);

    if (dashboard.value()) {
      const newDashboard = new Dashboard(pickDashboardData(req.body));
      const errors = newDashboard.editValidate(db, req.params.dashboard);

      if (!errors || Object.keys(errors).length === 0) {
        dashboard.assign(newDashboard)
          .write()
          .then(() => res.status(200).end())
          .catch((error) => {
            logger.error(`Unable write dashboard with db error: ${error}`);
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

  router.delete('/:dashboard', secure.CONFIGURE, (req, res) => {
    const dashboard = new Dashboard({ name: req.params.dashboard })
      .fetch(db);

    if (dashboard.value()) {
      new Dashboards().fetch(db)
        .remove(dashboard)
        .write()
        .then(() => res.status(200).end())
        .catch((error) => {
          logger.error(`Unable delete dashboard with db error: ${error}`);
          return res.status(500).end();
        });
    }
    else {
      res.status(404).end();
    }
  });

  return router;
}

module.exports = dashboardsApi;
