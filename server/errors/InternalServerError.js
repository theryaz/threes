class InternalServerError extends Error{
  constructor(message, payload){
    super(message);
    this.name = this.constructor.name;
    this.status = 500;
    this.payload = payload;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = InternalServerError;
