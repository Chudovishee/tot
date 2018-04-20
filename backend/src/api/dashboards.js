const express = require('express');
const secure = require('../services/secure');

const Dashboards = require('../models/dashboards');
const Dashboard = require('../models/dashboard');

function dashboardsApi(db) {
  const router = express.Router();

  router.get('/', secure.USER, async (req, res) => {
    res.json(new Dashboards().fetch(db).publish());
  });

  router.get('/:dashboard', secure.USER, async (req, res) => {
    const dashboard = new Dashboard({ name: req.params.dashboard })
      .fetch(db);

    if (dashboard.value()) {
      res.json(dashboard.publish());
    }
    else {
      res.status(404).end();
    }
  });

  return router;
}

module.exports = dashboardsApi;
