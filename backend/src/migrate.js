const dbAdapter = require('./services/db');
const logger = require('./services/logger');
const migrates = require('./migrates');

async function upMigration(from, to, db) {
  while (from < to) {
    if (migrates[from] && migrates[from].up) {
      await migrates[from].up(db);
      from += 1;
      await db.set('version', from).write();
    }
    else {
      throw new Error(`Migration from ${from} to ${from + 1} not exist`);
    }
  }
}

async function downMigration(from, to, db) {
  while (from > to) {
    if (migrates[from - 1] && migrates[from - 1].down) {
      await migrates[from - 1].down(db);
      from -= 1;
      await db.set('version', from).write();
    }
    else {
      throw new Error(`Migration from ${from} to ${from - 1} not exist`);
    }
  }
}

dbAdapter.then(async (db) => {
  const targetVersion = parseInt(process.argv[2], 10) || migrates.length;
  let version = db.get('version')
    .value();

  if (!version) {
    logger.warn('db version undefined or db is empty');
    version = 0;
  }
  if (targetVersion !== version) {
    logger.info(`start migrate db from ${version} to ${targetVersion} version`);

    if (targetVersion > version) {
      await upMigration(version, targetVersion, db);
    }
    else {
      await downMigration(version, targetVersion, db);
    }

    logger.info('migrate success');
  }
  else {
    logger.info(`db already have ${targetVersion} version, nothing to do`);
  }
})
  .catch((error) => {
    logger.error(error);
    throw error;
  });
