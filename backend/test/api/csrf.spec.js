const chai = require('chai');
const { assert } = require('chai');
const chaiHttp = require('chai-http');
const low = require('lowdb');

const Logger = require('../utils/logger');
const Adapter = require('../utils/testAdapter');
const Server = require('../../src/server');

chai.use(chaiHttp);

describe('csrf', async () => {
  let serverData;

  before(() => {
    serverData = Server(low(new Adapter.ResolveAdapter()), Logger());
  });
  after(() => serverData.server.close());

  it('positive', async () => {
    await chai.request(serverData.app)
      .get('/api/version')
      .set('x-requested-with', 'XMLHttpRequest')
      .then((res) => {
        assert.equal(res.status, 200);
      });

    await chai.request(serverData.app)
      .post('/api/version')
      .set('x-requested-with', 'XMLHttpRequest')
      .set('content-type', 'application/json')
      .then((res) => {
        // page not found, but if csrf failed, then return 400
        assert.equal(res.status, 404);
      });

    await chai.request(serverData.app)
      .put('/api/version')
      .set('x-requested-with', 'XMLHttpRequest')
      .set('content-type', 'application/json')
      .then((res) => {
        // page not found, but if csrf failed, then return 400
        assert.equal(res.status, 404);
      });
  });

  it('negative', async () => {
    await chai.request(serverData.app)
      .get('/api/version')
      .then((res) => {
        assert.equal(res.status, 400);
      });

    await chai.request(serverData.app)
      .post('/api/version')
      .set('x-requested-with', 'XMLHttpRequest')
      .then((res) => {
        assert.equal(res.status, 400);
      });

    await chai.request(serverData.app)
      .post('/api/version')
      .set('content-type', 'application/json')
      .then((res) => {
        assert.equal(res.status, 400);
      });

    await chai.request(serverData.app)
      .put('/api/version')
      .set('x-requested-with', 'XMLHttpRequest')
      .then((res) => {
        assert.equal(res.status, 400);
      });

    await chai.request(serverData.app)
      .put('/api/version')
      .set('content-type', 'application/json')
      .then((res) => {
        assert.equal(res.status, 400);
      });
  });
});
