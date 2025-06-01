const HttpError = require('./HttpError');

class Unauthorized extends HttpError {
  constructor(message) {
    super(message, 401);
    this.name = 'Unauthorized';
  }
}

module.exports = Unauthorized;
