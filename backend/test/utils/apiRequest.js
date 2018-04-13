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
    },
    put(url) {
      return chai.request(app)
        .put(url)
        .set('x-requested-with', 'XMLHttpRequest')
        .set('content-type', 'application/json');
    },
    delete(url) {
      return chai.request(app)
        .delete(url)
        .set('x-requested-with', 'XMLHttpRequest');
    }
  };
}

module.exports = apiRequest;
