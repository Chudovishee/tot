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

    it('get all', async () => {
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

    it('get by id', async () => {
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

    it('post', async () => {
      await request(serverData.app)
        .post('/api/dashboards')
        .set('access-token', getUserToken(db, 'admin'))
        .send({
          name: 'three',
          description: 'three three three',
          more: 'more'
        })
        .then((res) => {
          assert.equal(res.status, 200);

          const dbDashboard = db.get('dashboards')
            .find({ name: 'three' })
            .value();

          assert.equal(dbDashboard.name, 'three');
          assert.equal(dbDashboard.description, 'three three three');
          assert.notExists(dbDashboard.more);
        });

      await request(serverData.app)
        .post('/api/dashboards')
        .set('access-token', getUserToken(db, 'admin'))
        .send({
          name: 'four'
        })
        .then((res) => {
          assert.equal(res.status, 200);

          const dbDashboard = db.get('dashboards')
            .find({ name: 'four' })
            .value();

          assert.equal(dbDashboard.name, 'four');
          assert.equal(dbDashboard.description, '');
        });

      await request(serverData.app)
        .post('/api/dashboards')
        .set('access-token', getUserToken(db, 'admin'))
        .send({
          name: '=-=-=-',
          description: '=-=-=',
        })
        .then((res) => {
          assert.equal(res.status, 400);
          assert.deepEqual(res.body, {
            name: ['Name must be string with 1-20 characters'],
            description: ['Description must be string with 0-64 characters']
          });
        });

      await request(serverData.app)
        .post('/api/dashboards')
        .set('access-token', getUserToken(db, 'admin'))
        .send({
          name: 'threethreethreethreethreethreethreethreethreethreethreethreethreethreethreethreethreethree',
          description: 'threethreethreethreethreethreethreethreethreethreethreethreethreethreethreethreethreethreethreethree',
        })
        .then((res) => {
          assert.equal(res.status, 400);
          assert.deepEqual(res.body, {
            name: ['Name must be string with 1-20 characters'],
            description: ['Description must be string with 0-64 characters']
          });
        });

      await request(serverData.app)
        .post('/api/dashboards')
        .set('access-token', getUserToken(db, 'admin'))
        .send({})
        .then((res) => {
          assert.equal(res.status, 400);
          assert.deepEqual(res.body, {
            name: ['Name can\'t be blank']
          });
        });

      await request(serverData.app)
        .post('/api/dashboards')
        .set('access-token', getUserToken(db, 'admin'))
        .send({
          name: 'one'
        })
        .then((res) => {
          assert.equal(res.status, 400);
          assert.deepEqual(res.body, {
            name: ['Dashboard with name "one" already exists']
          });
        });

      await request(serverData.app)
        .post('/api/dashboards')
        .send({
          name: 'five'
        })
        .then((res) => {
          assert.equal(res.status, 401);
          assert.deepEqual(res.body, {});
        });

      await request(serverData.app)
        .post('/api/dashboards')
        .set('access-token', getUserToken(db, 'user'))
        .send({
          name: 'five'
        })
        .then((res) => {
          assert.equal(res.status, 403);
          assert.deepEqual(res.body, {});
        });

      await request(serverData.app)
        .post('/api/dashboards')
        .set('access-token', getUserToken(db, 'configure'))
        .send({
          name: 'five'
        })
        .then((res) => {
          assert.equal(res.status, 200);
        });
    });
  });
});
