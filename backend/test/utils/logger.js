const sinon = require('sinon');

module.exports = function () {
  return {
    error: sinon.spy(),
    warn: sinon.spy(),
    info: sinon.spy(),
    verbose: sinon.spy(),
    debug: sinon.spy(),
    silly: sinon.spy(),

    reset() {
      this.error.resetHistory();
      this.warn.resetHistory();
      this.info.resetHistory();
      this.verbose.resetHistory();
      this.debug.resetHistory();
      this.silly.resetHistory();
    }
  };
};
