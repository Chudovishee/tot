const low = require('lowdb');
const assert = require('chai').assert;

const adapter = require('../utils/testAdapter');
const Server = require('../../src/server');
const dbMock = require('../db-mock/user');
const request = require('../utils/apiRequest');

describe('user api', async () => {
  let serverData;
  let db;

  before(async () => {    
    db = await low(new adapter(null, { defaultValue: dbMock }));
    serverData = Server(db);
  });
  after(() => {
    return serverData.server.close();
  });

  beforeEach(() => {
    return db.read();
  })

  it('login success', async () => {
    await request(serverData.app)
      .post('/api/user/admin/login')
      .send({ password: 'admin' })
      .then((res) => {
        const dbToken = db.get('users')
          .find({ name: 'admin' })
          .value()
          .token;

        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.equal(res.body.token, dbToken);
      })
  });

  it('login empty password', async () => {
    await request(serverData.app)
      .post('/api/user/admin/login')
      .then((res) => {
        assert.equal(res.status, 403);
      })
  });

  it('login bad password', async () => {
    await request(serverData.app)
      .post('/api/user/admin/login')
      .send({ password: 'bad password' })
      .then((res) => {
        assert.equal(res.status, 403);
      })
  });
});
