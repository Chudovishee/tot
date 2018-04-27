const _ = require('lodash');
const validate = require('validate.js');

validate.validators.dashboardGrid = function (value) {
  if (value === undefined) {
    return null;
  }

  if (!Array.isArray(value)) {
    return 'is not array';
  }

  if (_.find(value, item =>
    (item.i === undefined || !(/^[\w]{1,20}$/).test(item.i) ||
      item.x === undefined || !Number.isInteger(item.x) ||
      item.y === undefined || !Number.isInteger(item.y) ||
      item.w === undefined || !Number.isInteger(item.w) ||
      item.h === undefined || !Number.isInteger(item.h)))) {
    return 'must have String "i" and Integer "x", "y", "w", "h" properties';
  }

  if (value.length !== _.uniqBy(value, 'i').length) {
    return 'must have items with unique "i" properties';
  }
  return null;
};

module.exports = validate;
