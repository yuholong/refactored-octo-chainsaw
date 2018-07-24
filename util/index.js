var express = require('express');

var middleware = require('./middleware');
var error = require('./error');

var util = {
  middleware,
  isInt: function(value) {
    return (
      !isNaN(value) && parseInt(value) == value && !isNaN(parseInt(value, 10))
    );
  },
  Error: error,
  formatter: function(data) {
    return {
      statusCode: 200,
      message: 'OK',
      data: data
    };
  }
};

module.exports = util;
