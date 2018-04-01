const low = require('lowdb');
const { assert } = require('chai');

const Adapter = require('../utils/testAdapter');
const Server = require('../../src/server');
const dbMock = require('../db-mock/user');
const request = require('../utils/apiRequest');

function getUserToken(db, user) {
  return db.get('users')
    .find({ name: user })
    .value()
    .token;
}

describe('user api', async () => {
  let serverData;
  let db;

  before(async () => {
    db = await low(new Adapter(null, { defaultValue: dbMock }));
    serverData = Server(db);
  });
  after(() => serverData.server.close());

  beforeEach(() => db.read());

  it('login', async () => {
    await request(serverData.app)
      .post('/api/user/admin/login')
      .send({ password: 'admin' })
      .then((res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.equal(res.body.token, getUserToken(db, 'admin'));
      });

    await request(serverData.app)
      .post('/api/user/admin/login')
      .then((res) => {
        assert.equal(res.status, 403);
        assert.deepEqual(res.body, {});
      });

    await request(serverData.app)
      .post('/api/user/admin/login')
      .send({ password: 'bad password' })
      .then((res) => {
        assert.equal(res.status, 403);
        assert.deepEqual(res.body, {});
      });
  });

  it('logout', async () => {
    const initToken = getUserToken(db, 'admin');

    await request(serverData.app)
      .post('/api/user/logout')
      .then((res) => {
        assert.equal(res.status, 403);
        assert.deepEqual(res.body, {});
      });

    await request(serverData.app)
      .post('/api/user/logout')
      .set('access-token', initToken)
      .then((res) => {
        assert.equal(res.status, 200);
      });

    assert.equal(getUserToken(db, 'admin'), false);

    await request(serverData.app)
      .post('/api/user/logout')
      .set('access-token', initToken)
      .then((res) => {
        assert.equal(res.status, 403);
        assert.deepEqual(res.body, {});
      });

    assert.equal(getUserToken(db, 'admin'), false);
  });

  it('get current user', async () => {
    await request(serverData.app)
      .get('/api/user')
      .set('access-token', getUserToken(db, 'admin'))
      .then((res) => {
        assert.equal(res.status, 200);
        assert.exists(res.body.name);
        assert.exists(res.body.token_expire);
        assert.exists(res.body.access);
        assert.equal(res.body.name, 'admin');
      });

    await request(serverData.app)
      .get('/api/user')
      .set('access-token', getUserToken(db, 'user'))
      .then((res) => {
        assert.equal(res.status, 200);
        assert.exists(res.body.name);
        assert.exists(res.body.token_expire);
        assert.exists(res.body.access);
        assert.equal(res.body.name, 'user');
      });

    await request(serverData.app)
      .get('/api/user')
      .then((res) => {
        assert.equal(res.status, 403);
        assert.deepEqual(res.body, {});
      });
  });

  it('get any user', async () => {
    await request(serverData.app)
      .get('/api/user/admin')
      .set('access-token', getUserToken(db, 'admin'))
      .then((res) => {
        assert.equal(res.status, 200);
        assert.exists(res.body.name);
        assert.exists(res.body.token_expire);
        assert.exists(res.body.access);
        assert.equal(res.body.name, 'admin');
      });

    await request(serverData.app)
      .get('/api/user/user')
      .set('access-token', getUserToken(db, 'admin'))
      .then((res) => {
        assert.equal(res.status, 200);
        assert.exists(res.body.name);
        assert.exists(res.body.token_expire);
        assert.exists(res.body.access);
        assert.equal(res.body.name, 'user');
      });

    await request(serverData.app)
      .get('/api/user/fail')
      .set('access-token', getUserToken(db, 'admin'))
      .then((res) => {
        assert.equal(res.status, 404);
        assert.deepEqual(res.body, {});
      });

    await request(serverData.app)
      .get('/api/user/admin')
      .set('access-token', getUserToken(db, 'user'))
      .then((res) => {
        assert.equal(res.status, 403);
        assert.deepEqual(res.body, {});
      });

    await request(serverData.app)
      .get('/api/user/user')
      .set('access-token', getUserToken(db, 'user'))
      .then((res) => {
        assert.equal(res.status, 403);
        assert.deepEqual(res.body, {});
      });

    await request(serverData.app)
      .get('/api/user/fail')
      .set('access-token', getUserToken(db, 'user'))
      .then((res) => {
        assert.equal(res.status, 403);
        assert.deepEqual(res.body, {});
      });
  });

  // it('post user', async () => {
  //   await request(serverData.app)
  //     .post('/api/user')
  //     .set('access-token', getUserToken(db, 'admin'))
  //     .send({
  //       name: 'new_user',
  //       password: 'new_password',
  //       access: 1
  //     })
  //     .then((res) => {
  //       assert.equal(res.status, 200);
  //     });
  // });
});
