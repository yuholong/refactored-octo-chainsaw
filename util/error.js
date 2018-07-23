module.exports = {
  invalidParams: function(text) {
    return {
      statusCode: 400,
      message: 'Bad Request',
      text: text
    };
  },
  conflict: function(text) {
    return {
      statusCode: 409,
      message: 'Conflict',
      text: text
    };
  }
};
