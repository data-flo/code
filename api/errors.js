function StatusCodeError(message) {
  this.name = "StatusCodeError";
  this.message = message || "StatusCode Error";
  this.stack = (new Error()).stack;
}
StatusCodeError.prototype = Object.create(Error.prototype);
StatusCodeError.prototype.constructor = StatusCodeError;

function catchErrorResponse(res, error) {
  if (error instanceof StatusCodeError) {
    return res.sendStatus(error.message);
  }

  const errorMessge = `Something went wrong, please try again later (${(+new Date())}).`;
  console.error(errorMessge);
  console.error(error);
  return res.status(500).send(errorMessge);
}

module.exports = {
  catchErrorResponse,
  StatusCodeError,
};
