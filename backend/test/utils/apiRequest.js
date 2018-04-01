const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

function apiRequest(app) {
  return {
    get(url) {
      return chai.request(app)
        .get(url)
        .set('x-requested-with', 'XMLHttpRequest');
    },
    post(url) {
      return chai.request(app)
        .post(url)
        .set('x-requested-with', 'XMLHttpRequest')
        .set('content-type', 'application/json');
    }
  };
}

module.exports = apiRequest;
