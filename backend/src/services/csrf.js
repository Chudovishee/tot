function csrfService(req, res, next) {
  if ((req.headers['x-requested-with'] === 'XMLHttpRequest') &&
      ((req.method !== 'POST' && req.method !== 'PUT') ||
        (req.headers['content-type'].split(';').indexOf('application/json') >= 0))) {
    next();
  }
  else {
    res.status(400).end();
  }
}

module.exports = csrfService;
