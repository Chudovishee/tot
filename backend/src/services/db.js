const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const config = require('config');

const adapter = new FileAsync(config.get('db'));
const db = low(adapter);

module.exports = db;
