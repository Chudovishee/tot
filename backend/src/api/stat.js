const { each, keys } = require('lodash');
const express = require('express');

const Prometheus = require('../services/prometheus');
const secure = require('../services/secure');

const queries = {
  cpu: '100 - avg(rate(node_cpu{mode="idle"}[1m])) * 100',
  mem: 'node_memory_MemTotal - node_memory_MemAvailable'
};

function statApi(logger) {
  const router = express.Router();

  function queryHandler(query) {
    return function (req, res) {
      const start = parseFloat(req.query.start, 10);
      const end = parseFloat(req.query.end, 10);

      if (start && end && end > start) {
        Prometheus({ query, start, end })
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
    };
  }

  router.get('/', secure.USER, (req, res) => {
    res.json(keys(queries));
  });

  each(queries, (query, name) => {
    router.get(`/${name}`, secure.USER, queryHandler(query));
  });

  return router;
}

module.exports = statApi;
