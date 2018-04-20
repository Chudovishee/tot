// const _ = require('lodash');
const low = require('lowdb');
const { assert } = require('chai');

const Logger = require('../utils/logger');
const Adapter = require('../utils/testAdapter');
const Server = require('../../src/server');
const dbMock = require('../db-mock/dashboards');
const request = require('../utils/apiRequest');
const getUserToken = require('../utils/getUserToken');


describe('dashboards api', () => {
  describe('positive', () => {
    let serverData;
    let db;

    before(async () => {
      db = await low(new Adapter.ResolveAdapter(null, { defaultValue: dbMock }));
      serverData = Server(db, Logger());
    });
    after(() => serverData.server.close());

    beforeEach(() => db.read());

    it('get', async () => {
      await request(serverData.app)
        .get('/api/dashboards')
        .set('access-token', getUserToken(db, 'admin'))
        .then((res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, [
            { name: 'one', description: 'one one one' },
            { name: 'two', description: 'two two two' }
          ]);
        });

      await request(serverData.app)
        .get('/api/dashboards')
        .set('access-token', getUserToken(db, 'configure'))
        .then((res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, [
            { name: 'one', description: 'one one one' },
            { name: 'two', description: 'two two two' }
          ]);
        });

      await request(serverData.app)
        .get('/api/dashboards')
        .set('access-token', getUserToken(db, 'user'))
        .then((res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, [
            { name: 'one', description: 'one one one' },
            { name: 'two', description: 'two two two' }
          ]);
        });

      await request(serverData.app)
        .get('/api/dashboards')
        .then((res) => {
          assert.equal(res.status, 401);
          assert.deepEqual(res.body, {});
        });
    });

    it('get', async () => {
      const expected = {
        name: 'one',
        description: 'one one one',
        grid: [
          {
            span: 12
          },
          {
            span: 12
          }
        ]
      };
      await request(serverData.app)
        .get('/api/dashboards/one')
        .set('access-token', getUserToken(db, 'admin'))
        .then((res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, expected);
        });

      await request(serverData.app)
        .get('/api/dashboards/one')
        .set('access-token', getUserToken(db, 'configure'))
        .then((res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, expected);
        });

      await request(serverData.app)
        .get('/api/dashboards/one')
        .set('access-token', getUserToken(db, 'user'))
        .then((res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, expected);
        });

      await request(serverData.app)
        .get('/api/dashboards/one')
        .then((res) => {
          assert.equal(res.status, 401);
          assert.deepEqual(res.body, {});
        });

      await request(serverData.app)
        .get('/api/dashboards/three')
        .set('access-token', getUserToken(db, 'admin'))
        .then((res) => {
          assert.equal(res.status, 404);
          assert.deepEqual(res.body, {});
        });
    });
  });
});
