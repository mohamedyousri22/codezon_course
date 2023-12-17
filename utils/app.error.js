class apperror extends Error {
  constructor() {
    super();
  }
  create(message, statuscode, statusText) {
    this.message = message;
    this.statuscode = statuscode;
    this.statusText = statusText;
    return this;
  }
}
module.exports = apperror;
