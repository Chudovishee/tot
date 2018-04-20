const express = require('express');
const secure = require('../services/secure');
const { version } = require('../../package.json');

const router = express.Router();

router.get('/', secure.ALL, (req, res) => {
  res.json({ version });
});

module.exports = router;
