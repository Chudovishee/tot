const { find, uniqBy, keyBy, every } = require('lodash');
const validate = require('validate.js');

validate.validators.dashboardGrid = function (value, options) {
  if (value === undefined) {
    return null;
  }

  if (!Array.isArray(value)) {
    return 'is not array';
  }

  if (find(value, item =>
    (item.i === undefined || !(/^[\w]{1,20}$/).test(item.i) ||
      item.x === undefined || !Number.isInteger(item.x) ||
      item.y === undefined || !Number.isInteger(item.y) ||
      item.w === undefined || !Number.isInteger(item.w) ||
      item.h === undefined || !Number.isInteger(item.h)))) {
    return 'must have String "i" and Integer "x", "y", "w", "h" properties';
  }

  if (value.length !== uniqBy(value, 'i').length) {
    return 'must have items with unique "i" properties';
  }

  if (options.availableSources && options.availableSources.length) {
    const availableSourcesIndex = keyBy(options.availableSources);
    if (find(value, item =>
      (!item.sources || !item.sources.length ||
      !every(item.sources, source => availableSourcesIndex[source])))) {
      return 'have plot with unsupported source';
    }
  }

  if (options.availableTypes && options.availableTypes.length) {
    const availableTypesIndex = keyBy(options.availableTypes);
    if (find(value, item => (availableTypesIndex[item.type] === undefined))) {
      return 'have plot with unsupported type';
    }
  }

  return null;
};

module.exports = validate;
