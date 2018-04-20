const express = require('express');
const secure = require('../services/secure');

const Dashboards = require('../models/dashboards');

function dashboardsApi(db) {
  const router = express.Router();

  router.get('/', secure.USER, async (req, res) => {
    res.json(new Dashboards().fetch(db).publish());
  });

  return router;
}

module.exports = dashboardsApi;
