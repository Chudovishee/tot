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
          { i: '0', x: 0, y: 0, w: 1, h: 1 },
          { i: '1', x: 1, y: 0, w: 1, h: 1 }
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
          grid: [
            { x: 0, y: 0, w: 2, h: 2, k: 'kkk', i: '0', type: 'graph', sources: ['cpu', 'mem'] },
            { x: 2, y: 2, w: 2, h: 2, k: 'kkk', i: '1', type: 'value', sources: ['cpu'] }
          ],
          more: 'more'
        })
        .then((res) => {
          assert.equal(res.status, 200);

          const dbDashboard = db.get('dashboards')
            .find({ name: 'three' })
            .value();

          assert.equal(dbDashboard.name, 'three');
          assert.equal(dbDashboard.description, 'three three three');
          assert.deepEqual(dbDashboard.grid, [
            { x: 0, y: 0, w: 2, h: 2, i: '0', type: 'graph', sources: ['cpu', 'mem'] },
            { x: 2, y: 2, w: 2, h: 2, i: '1', type: 'value', sources: ['cpu'] }
          ]);
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
          grid: [
            { i: '0' },
            { i: '0' }
          ]
        })
        .then((res) => {
          assert.equal(res.status, 400);
          assert.deepEqual(res.body, {
            name: ['Name must be string with 1-20 characters'],
            description: ['Description must be string with 0-64 characters'],
            grid: ['Grid must have String "i" and Integer "x", "y", "w", "h" properties']
          });
        });

      await request(serverData.app)
        .post('/api/dashboards')
        .set('access-token', getUserToken(db, 'admin'))
        .send({
          name: 'one',
          grid: [
            { i: '0', x: 0, y: 0, w: 0, h: 0 },
            { i: '0', x: 0, y: 0, w: 0, h: 0 }
          ]
        })
        .then((res) => {
          assert.equal(res.status, 400);
          assert.deepEqual(res.body, {
            grid: ['Grid must have items with unique "i" properties']
          });
        });

      await request(serverData.app)
        .post('/api/dashboards')
        .set('access-token', getUserToken(db, 'admin'))
        .send({
          name: 'one',
          grid: [
            { i: '0', x: 0, y: 0, w: 0, h: 0, type: 'graph', sources: ['one', 'mem'] },
          ]
        })
        .then((res) => {
          assert.equal(res.status, 400);
          assert.deepEqual(res.body, {
            grid: ['Grid have plot with unsupported source']
          });
        });

      await request(serverData.app)
        .post('/api/dashboards')
        .set('access-token', getUserToken(db, 'admin'))
        .send({
          name: 'one',
          grid: [
            { i: '0', x: 0, y: 0, w: 0, h: 0, type: 'graph', sources: [] },
          ]
        })
        .then((res) => {
          assert.equal(res.status, 400);
          assert.deepEqual(res.body, {
            grid: ['Grid have plot with unsupported source']
          });
        });

      await request(serverData.app)
        .post('/api/dashboards')
        .set('access-token', getUserToken(db, 'admin'))
        .send({
          name: 'one',
          grid: [
            { i: '0', x: 0, y: 0, w: 0, h: 0, type: 'graph' },
          ]
        })
        .then((res) => {
          assert.equal(res.status, 400);
          assert.deepEqual(res.body, {
            grid: ['Grid have plot with unsupported source']
          });
        });

      await request(serverData.app)
        .post('/api/dashboards')
        .set('access-token', getUserToken(db, 'admin'))
        .send({
          name: 'one',
          grid: [
            { i: '0', x: 0, y: 0, w: 0, h: 0, type: 'one two', sources: ['mem'] },
          ]
        })
        .then((res) => {
          assert.equal(res.status, 400);
          assert.deepEqual(res.body, {
            grid: ['Grid have plot with unsupported type']
          });
        });

      await request(serverData.app)
        .post('/api/dashboards')
        .set('access-token', getUserToken(db, 'admin'))
        .send({
          name: 'one',
          grid: [
            { i: '0', x: 0, y: 0, w: 0, h: 0, sources: ['mem'] },
          ]
        })
        .then((res) => {
          assert.equal(res.status, 400);
          assert.deepEqual(res.body, {
            grid: ['Grid have plot with unsupported type']
          });
        });

      await request(serverData.app)
        .post('/api/dashboards')
        .set('access-token', getUserToken(db, 'admin'))
        .send({
          name: 'six',
          grid: [
            { i: '0', x: '0', y: 0, w: 0, h: 0 }
          ]
        })
        .then((res) => {
          assert.equal(res.status, 400);
          assert.deepEqual(res.body, {
            grid: ['Grid must have String "i" and Integer "x", "y", "w", "h" properties']
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

    it('put', async () => {
      await request(serverData.app)
        .put('/api/dashboards/one')
        .set('access-token', getUserToken(db, 'admin'))
        .send({
          name: 'three',
          description: 'three three three',
          grid: [
            { x: 0, y: 0, w: 2, h: 2, k: 'kkk', i: '0', type: 'graph', sources: ['cpu'] },
            { x: 2, y: 2, w: 2, h: 2, k: 'kkk', i: '1', type: 'graph', sources: ['cpu'] },
            { x: 4, y: 4, w: 2, h: 2, k: 'kkk', i: '2', type: 'graph', sources: ['cpu'] }
          ],
          more: 'more'
        })
        .then((res) => {
          assert.equal(res.status, 200);
          const dbDashboard = db.get('dashboards')
            .find({ name: 'three' })
            .value();

          assert.equal(dbDashboard.name, 'three');
          assert.equal(dbDashboard.description, 'three three three');
          assert.deepEqual(dbDashboard.grid, [
            { x: 0, y: 0, w: 2, h: 2, i: '0', type: 'graph', sources: ['cpu'] },
            { x: 2, y: 2, w: 2, h: 2, i: '1', type: 'graph', sources: ['cpu'] },
            { x: 4, y: 4, w: 2, h: 2, i: '2', type: 'graph', sources: ['cpu'] }
          ]);
          assert.notExists(dbDashboard.more);
        });

      await request(serverData.app)
        .put('/api/dashboards/one')
        .set('access-token', getUserToken(db, 'admin'))
        .send({ name: 'three' })
        .then((res) => {
          assert.equal(res.status, 404);
          assert.deepEqual(res.body, {});
        });

      await request(serverData.app)
        .put('/api/dashboards/three')
        .set('access-token', getUserToken(db, 'admin'))
        .send({
          name: 'three',
          description: '3 3 3'
        })
        .then((res) => {
          assert.equal(res.status, 200);
          const dbDashboard = db.get('dashboards')
            .find({ name: 'three' })
            .value();

          assert.equal(dbDashboard.name, 'three');
          assert.equal(dbDashboard.description, '3 3 3');
          assert.deepEqual(dbDashboard.grid, [
            { x: 0, y: 0, w: 2, h: 2, i: '0', type: 'graph', sources: ['cpu'] },
            { x: 2, y: 2, w: 2, h: 2, i: '1', type: 'graph', sources: ['cpu'] },
            { x: 4, y: 4, w: 2, h: 2, i: '2', type: 'graph', sources: ['cpu'] }
          ]);
        });

      await request(serverData.app)
        .put('/api/dashboards/three')
        .set('access-token', getUserToken(db, 'admin'))
        .send({
          grid: [
            { x: 0, y: 0, w: 2, h: 2, i: '3', type: 'graph', sources: ['mem'] },
            { x: 2, y: 2, w: 2, h: 2, i: '4', type: 'graph', sources: ['mem'] },
            { x: 4, y: 4, w: 2, h: 2, i: '5', type: 'graph', sources: ['mem'] }
          ]
        })
        .then((res) => {
          assert.equal(res.status, 200);
          const dbDashboard = db.get('dashboards')
            .find({ name: 'three' })
            .value();

          assert.equal(dbDashboard.name, 'three');
          assert.equal(dbDashboard.description, '3 3 3');
          assert.deepEqual(dbDashboard.grid, [
            { x: 0, y: 0, w: 2, h: 2, i: '3', type: 'graph', sources: ['mem'] },
            { x: 2, y: 2, w: 2, h: 2, i: '4', type: 'graph', sources: ['mem'] },
            { x: 4, y: 4, w: 2, h: 2, i: '5', type: 'graph', sources: ['mem'] }
          ]);
        });

      await request(serverData.app)
        .put('/api/dashboards/three')
        .send({
          description: '123123'
        })
        .then((res) => {
          assert.equal(res.status, 401);
          assert.deepEqual(res.body, {});
        });

      await request(serverData.app)
        .put('/api/dashboards/three')
        .set('access-token', getUserToken(db, 'user'))
        .send({
          description: '123123'
        })
        .then((res) => {
          assert.equal(res.status, 403);
          assert.deepEqual(res.body, {});
        });

      await request(serverData.app)
        .put('/api/dashboards/three')
        .set('access-token', getUserToken(db, 'configure'))
        .send({
          description: '123123'
        })
        .then((res) => {
          assert.equal(res.status, 200);
        });
    });

    it('delete', async () => {
      await request(serverData.app)
        .delete('/api/dashboards/one')
        .set('access-token', getUserToken(db, 'user'))
        .then((res) => {
          assert.equal(res.status, 403);
        });

      await request(serverData.app)
        .delete('/api/dashboards/one')
        .set('access-token', getUserToken(db, 'admin'))
        .then((res) => {
          assert.equal(res.status, 200);
          assert.equal(db.get('dashboards').find({ name: 'one' }).value(), undefined);
        });

      await request(serverData.app)
        .delete('/api/dashboards/two')
        .set('access-token', getUserToken(db, 'configure'))
        .then((res) => {
          assert.equal(res.status, 200);
          assert.equal(db.get('dashboards').find({ name: 'two' }).value(), undefined);
        });

      await request(serverData.app)
        .delete('/api/dashboards/one')
        .set('access-token', getUserToken(db, 'admin'))
        .then((res) => {
          assert.equal(res.status, 404);
        });
    });
  });
});
