const _ = require('lodash');
const low = require('lowdb');
const { assert } = require('chai');

const Logger = require('../utils/logger');
const Adapter = require('../utils/testAdapter');
const Server = require('../../src/server');
const dbMock = require('../db-mock/user');
const request = require('../utils/apiRequest');
const getUserToken = require('../utils/getUserToken');

describe('users api', async () => {
  describe('negative', () => {
    let serverData;
    let db;
    let logger;

    before(async () => {
      db = await low(new Adapter.RejectAdapter(null, { defaultValue: dbMock }));
      logger = Logger();
      serverData = Server(db, logger);
    });
    after(() => serverData.server.close());

    beforeEach(() => {
      logger.reset();
      return db.read();
    });

    it('login', async () => {
      await request(serverData.app)
        .post('/api/users/admin/login')
        .send({ password: 'admin' })
        .then((res) => {
          assert.equal(res.status, 500);
          assert.deepEqual(res.body, {});
        });
      assert(logger.error.calledOnce);
    });

    it('logout', async () => {
      const initToken = getUserToken(db, 'admin');
      await request(serverData.app)
        .post('/api/users/current/logout')
        .set('access-token', initToken)
        .then((res) => {
          assert.equal(res.status, 500);
        });

      assert(logger.error.calledOnce);
    });

    it('post user', async () => {
      await request(serverData.app)
        .post('/api/users')
        .set('access-token', getUserToken(db, 'admin'))
        .send({
          name: 'new_user',
          password: 'new_password',
          access: 1,
          more: 'more'
        })
        .then((res) => {
          assert.equal(res.status, 500);
          assert(logger.error.calledOnce);
        });
    });

    it('put user', async () => {
      await request(serverData.app)
        .put('/api/users/user')
        .set('access-token', getUserToken(db, 'admin'))
        .send({
          name: 'new_user',
          password: 'new_password',
          access: 2,
          more: 'more'
        })
        .then((res) => {
          assert.equal(res.status, 500);
          assert(logger.error.calledOnce);
        });
    });

    it('delete user', async () => {
      await request(serverData.app)
        .delete('/api/users/user')
        .set('access-token', getUserToken(db, 'admin'))
        .then((res) => {
          assert.equal(res.status, 500);
          assert(logger.error.calledOnce);
        });
    });
  });

  describe('positive', () => {
    let serverData;
    let db;

    before(async () => {
      db = await low(new Adapter.ResolveAdapter(null, { defaultValue: dbMock }));
      serverData = Server(db, Logger());
    });
    after(() => serverData.server.close());

    beforeEach(() => db.read());

    it('login', async () => {
      await request(serverData.app)
        .post('/api/users/admin/login')
        .send({ password: 'admin' })
        .then((res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.equal(res.body.token, getUserToken(db, 'admin'));
        });

      await request(serverData.app)
        .post('/api/users/admin/login')
        .then((res) => {
          assert.equal(res.status, 403);
          assert.deepEqual(res.body, {});
        });

      await request(serverData.app)
        .post('/api/users/admin/login')
        .send({ password: 'bad password' })
        .then((res) => {
          assert.equal(res.status, 403);
          assert.deepEqual(res.body, {});
        });
    });

    it('logout', async () => {
      const initToken = getUserToken(db, 'admin');

      await request(serverData.app)
        .post('/api/users/current/logout')
        .then((res) => {
          assert.equal(res.status, 401);
          assert.deepEqual(res.body, {});
        });

      await request(serverData.app)
        .post('/api/users/current/logout')
        .set('access-token', initToken)
        .then((res) => {
          assert.equal(res.status, 200);
        });

      assert.equal(getUserToken(db, 'admin'), false);

      await request(serverData.app)
        .post('/api/users/current/logout')
        .set('access-token', initToken)
        .then((res) => {
          assert.equal(res.status, 401);
          assert.deepEqual(res.body, {});
        });

      assert.equal(getUserToken(db, 'admin'), false);
    });

    it('get current user', async () => {
      await request(serverData.app)
        .get('/api/users/current')
        .set('access-token', getUserToken(db, 'admin'))
        .then((res) => {
          assert.equal(res.status, 200);
          assert.exists(res.body.name);
          assert.exists(res.body.token_expire);
          assert.exists(res.body.access);
          assert.notExists(res.body.password);
          assert.equal(res.body.name, 'admin');
        });

      await request(serverData.app)
        .get('/api/users/current')
        .set('access-token', getUserToken(db, 'user'))
        .then((res) => {
          assert.equal(res.status, 200);
          assert.exists(res.body.name);
          assert.exists(res.body.token_expire);
          assert.exists(res.body.access);
          assert.notExists(res.body.password);
          assert.equal(res.body.name, 'user');
        });

      await request(serverData.app)
        .get('/api/users/current')
        .then((res) => {
          assert.equal(res.status, 401);
          assert.deepEqual(res.body, {});
        });
    });

    it('get any user', async () => {
      await request(serverData.app)
        .get('/api/users/admin')
        .set('access-token', getUserToken(db, 'admin'))
        .then((res) => {
          assert.equal(res.status, 200);
          assert.exists(res.body.name);
          assert.exists(res.body.token_expire);
          assert.exists(res.body.access);
          assert.equal(res.body.name, 'admin');
        });

      await request(serverData.app)
        .get('/api/users/user')
        .set('access-token', getUserToken(db, 'admin'))
        .then((res) => {
          assert.equal(res.status, 200);
          assert.exists(res.body.name);
          assert.exists(res.body.token_expire);
          assert.exists(res.body.access);
          assert.notExists(res.body.password);
          assert.equal(res.body.name, 'user');
        });

      await request(serverData.app)
        .get('/api/users/fail')
        .set('access-token', getUserToken(db, 'admin'))
        .then((res) => {
          assert.equal(res.status, 404);
          assert.deepEqual(res.body, {});
        });

      await request(serverData.app)
        .get('/api/users/admin')
        .set('access-token', getUserToken(db, 'user'))
        .then((res) => {
          assert.equal(res.status, 403);
          assert.deepEqual(res.body, {});
        });

      await request(serverData.app)
        .get('/api/users/user')
        .set('access-token', getUserToken(db, 'user'))
        .then((res) => {
          assert.equal(res.status, 403);
          assert.deepEqual(res.body, {});
        });

      await request(serverData.app)
        .get('/api/users/fail')
        .set('access-token', getUserToken(db, 'user'))
        .then((res) => {
          assert.equal(res.status, 403);
          assert.deepEqual(res.body, {});
        });

      await request(serverData.app)
        .get('/api/users/admin')
        .then((res) => {
          assert.equal(res.status, 401);
          assert.deepEqual(res.body, {});
        });
    });

    it('post user', async () => {
      await request(serverData.app)
        .post('/api/users')
        .set('access-token', getUserToken(db, 'admin'))
        .send({
          name: 'new_user',
          password: 'new_password',
          access: 1,
          more: 'more'
        })
        .then((res) => {
          assert.equal(res.status, 200);

          const dbUser = db.get('users')
            .find({ name: 'new_user' })
            .value();

          assert.equal(dbUser.name, 'new_user');
          assert.exists(dbUser.password);
          assert.notEqual(dbUser.password, 'new_password');
          assert.equal(dbUser.access, 1);
          assert.exists(dbUser.token);
          assert.exists(dbUser.token_expire);
          assert.notExists(dbUser.more);
        });

      await request(serverData.app)
        .post('/api/users')
        .set('access-token', getUserToken(db, 'admin'))
        .send({
          name: '+_+_+',
          password: '123',
          access: 10
        })
        .then((res) => {
          assert.equal(res.status, 400);
          assert.deepEqual(res.body, {
            name: ['Name user name must be string with 4-20 characters'],
            access: ['10 is not included in the list']
          });
        });

      await request(serverData.app)
        .post('/api/users')
        .set('access-token', getUserToken(db, 'admin'))
        .send({
          name: 'asdfghjklqwertyuiopzxcvbnmasdfghjkqwertyuisdfgherasdfghjklqwertyuiopzxcvbnmasdfghjkqwertyuisdfgher',
          password: '1234567890123456789012345678901234567890',
          access: 1
        })
        .then((res) => {
          assert.equal(res.status, 400);
          assert.deepEqual(res.body, {
            name: ['Name user name must be string with 4-20 characters'],
          });
        });

      await request(serverData.app)
        .post('/api/users')
        .set('access-token', getUserToken(db, 'admin'))
        .send({})
        .then((res) => {
          assert.equal(res.status, 400);
          assert.deepEqual(res.body, {
            name: ['Name can\'t be blank'],
            password: ['Password can\'t be blank'],
            access: ['Access can\'t be blank']
          });
        });

      await request(serverData.app)
        .post('/api/users')
        .set('access-token', getUserToken(db, 'admin'))
        .send({
          name: 'admin',
          password: 'new_password',
          access: 1
        })
        .then((res) => {
          assert.equal(res.status, 400);
          assert.deepEqual(res.body, {
            name: ['User with name "admin" already exists'],
          });
        });

      await request(serverData.app)
        .post('/api/users')
        .set('access-token', getUserToken(db, 'user'))
        .send({
          name: 'new_user',
          password: 'new_password',
          access: 1
        })
        .then((res) => {
          assert.equal(res.status, 403);
        });

      await request(serverData.app)
        .post('/api/users')
        .send({
          name: 'new_user',
          password: 'new_password',
          access: 1
        })
        .then((res) => {
          assert.equal(res.status, 401);
        });
    });

    it('put user', async () => {
      const oldRecord = _.cloneDeep(db.get('users')
        .find({ name: 'user' })
        .value());

      await request(serverData.app)
        .put('/api/users/user')
        .set('access-token', getUserToken(db, 'admin'))
        .send({
          name: 'new_user',
          password: 'new_password',
          access: 2,
          more: 'more'
        })
        .then((res) => {
          assert.equal(res.status, 200);

          const newRecord = db.get('users')
            .find({ name: 'user' })
            .value();

          assert.exists(newRecord.password);
          assert.notEqual(newRecord.password, 'new_password');
          assert.notEqual(newRecord.password, oldRecord.password);
          assert.equal(newRecord.access, 2);
          assert.equal(newRecord.token, oldRecord.token);
          assert.equal(newRecord.token_expire, oldRecord.token_expire);
          assert.notExists(newRecord.more);
        });

      await request(serverData.app)
        .put('/api/users/user')
        .set('access-token', getUserToken(db, 'admin'))
        .send({
          access: 10
        })
        .then((res) => {
          assert.equal(res.status, 400);
          assert.deepEqual(res.body, {
            access: ['10 is not included in the list']
          });
        });

      await request(serverData.app)
        .put('/api/users/user')
        .set('access-token', getUserToken(db, 'admin'))
        .send({})
        .then((res) => {
          assert.equal(res.status, 200);
        });

      await request(serverData.app)
        .put('/api/users/user_not_exists')
        .set('access-token', getUserToken(db, 'admin'))
        .send({
          password: 'new_password',
          access: 3
        })
        .then((res) => {
          assert.equal(res.status, 404);
        });

      await request(serverData.app)
        .put('/api/users/admin')
        .set('access-token', getUserToken(db, 'user'))
        .send({
          password: 'new_password'
        })
        .then((res) => {
          assert.equal(res.status, 403);
        });

      await request(serverData.app)
        .put('/api/users/admin')
        .send({
          password: 'new_password'
        })
        .then((res) => {
          assert.equal(res.status, 401);
        });
    });

    it('get users', async () => {
      await request(serverData.app)
        .get('/api/users')
        .set('access-token', getUserToken(db, 'admin'))
        .then((res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.length, db.get('users').value().length);

          _.each(res.body, (user) => {
            assert.exists(user.name);
            assert.exists(user.token_expire);
            assert.exists(user.access);
            assert.notExists(user.password);
          });
        });

      await request(serverData.app)
        .get('/api/users')
        .set('access-token', getUserToken(db, 'user'))
        .then((res) => {
          assert.equal(res.status, 403);
          assert.deepEqual(res.body, {});
        });
    });

    it('delete user', async () => {
      await request(serverData.app)
        .delete('/api/users/admin')
        .set('access-token', getUserToken(db, 'user'))
        .then((res) => {
          assert.equal(res.status, 403);
        });

      await request(serverData.app)
        .delete('/api/users/user')
        .set('access-token', getUserToken(db, 'admin'))
        .then((res) => {
          assert.equal(res.status, 200);
          assert.equal(db.get('users').find({ name: 'user' }).value(), undefined);
        });

      await request(serverData.app)
        .delete('/api/users/user')
        .set('access-token', getUserToken(db, 'admin'))
        .then((res) => {
          assert.equal(res.status, 404);
        });
    });
  });
});
