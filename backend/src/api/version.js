const config = require('config');
const version = config.get('version');

function getVersion(req, res) {
  res.json({ version });
}

module.exports = getVersion;
