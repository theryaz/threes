class NotFoundError extends Error{
  constructor(message, payload){
    super(message);
    this.name = this.constructor.name;
    this.status = 404;
    this.payload = payload;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = NotFoundError;
