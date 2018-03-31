const crypto = require('crypto');

function sha256(str) {
  const hash = crypto.createHash('sha256');
  hash.update(str);
  return hash.digest('hex');
}

module.exports = sha256;
