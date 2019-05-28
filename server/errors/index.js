const errorHandler = require('./errorHandler');
const NotFoundError = require('./NotFoundError');
const InternalServerError = require('./InternalServerError');

module.exports = {
  errorHandler,
  NotFoundError,
  InternalServerError,
};
