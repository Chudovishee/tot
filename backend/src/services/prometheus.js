const Axios = require('axios');
const config = require('config');
const { map, reduce } = require('lodash');

const POINTS = 300;

const axios = Axios.create({
  timeout: 1000,
  baseURL: config.get('prometheus'),
  headers: {
    'x-requested-with': 'XMLHttpRequest'
  }
});

function putNulls(data, start, end, step) {
  return map(data, (row) => {
    const resultRow = { metric: row.metric };

    if (row.values.length) {
      resultRow.values = reduce(row.values, (memo, col, index, values) => {
        if (index > 0) {
          memo = memo.concat(
            map(
              Array(Math.max(Math.floor((col[0] - values[index - 1][0] - step) / step), 0)),
              (v, i) => [(col[0] + (step * (i + 1))), null]));
        }

        col = map(col, metric => +metric);
        memo.push(col);
        return memo;
      }, []);
    }
    else {
      resultRow.values = [];
    }

    return resultRow;
  });
}

function Prometheus(options) {
  const step = Math.max(Math.round((options.end - options.start) / POINTS), 1);

  return axios.get('/api/v1/query_range', {
    params: {
      query: options.query,
      start: options.start,
      end: options.end,
      step
    }
  })
    .then((res) => {
      if (res.data.status !== 'success') {
        throw Error('Parse error: status not success');
      }

      return putNulls(res.data.data.result, options.start, options.end, step);
    });
}

module.exports = Prometheus;
