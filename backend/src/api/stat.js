// const _ = require('lodash');
const express = require('express');

const Prometheus = require('../services/prometheus');
const secure = require('../services/secure');

function statApi(logger) {
  const router = express.Router();

  router.get('/cpu', secure.USER, (req, res) => {
    const start = parseFloat(req.query.start, 10);
    const end = parseFloat(req.query.end, 10);

    if (start && end && end > start) {
      Prometheus({
        query: '100 - avg(rate(node_cpu{mode="idle"}[1m])) * 100',
        start,
        end
      })
        .then((prometheusResponse) => {
          res.status(200).json(prometheusResponse);
        })
        .catch((error) => {
          logger.error(`Unable to execute prometheus query: ${error}`);
          res.status(500).end();
        });
    }
    else {
      res.status(400).end();
    }
  });

  return router;
}

module.exports = statApi;
