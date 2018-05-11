const { each, pick, map } = require('lodash');
const express = require('express');

const { queryRange, availableQueries } = require('../services/prometheus');
const secure = require('../services/secure');

function statApi(logger) {
  const router = express.Router();

  function queryHandler(query) {
    return function (req, res) {
      const start = parseFloat(req.query.start, 10);
      const end = parseFloat(req.query.end, 10);

      if (start && end && end > start) {
        queryRange({ query, start, end })
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
    res.json(map(availableQueries, query => pick(query, ['key', 'name', 'description'])));
  });

  each(availableQueries, (query) => {
    router.get(`/${query.key}`, secure.USER, queryHandler(query.query));
  });

  return router;
}

module.exports = statApi;
