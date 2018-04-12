const Base = require('./base');

class BaseCollection extends Base {
  constructor(data) {
    super(data || []);
  }
}

module.exports = BaseCollection;
