function csrfService(req, res, next) {
  if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
    next();
  } else {
    res.status(400).end();
  }
}

module.exports = csrfService;
