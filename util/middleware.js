var middleware = {};
var _ = require('lodash');

middleware.error = function(err, req, res, next) {
  if (!err.statusCode) err.statusCode = 400;
  res.status(err.statusCode).send({
    status: err.statusCode,
    message: err.message,
    text: err.text
  });
};

module.exports = middleware;
