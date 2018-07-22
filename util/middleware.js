var middleware = {};
var _ = require('lodash');

middleware.error = function(err, req, res, next) {
  if (!err.statusCode) err.statusCode = 404;
  res.status(err.statusCode).send(err.message);
};

module.exports = middleware;
