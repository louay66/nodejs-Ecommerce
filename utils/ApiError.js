class ApiError extends Error {
  constructor(message, statuscode) {
    super(message);
    this.statuscode = statuscode;
    this.status = `${statuscode}`.startsWith(4) ? "faill" : "Error";
    this.isOperationel = true;
  }
}

module.exports = ApiError;
