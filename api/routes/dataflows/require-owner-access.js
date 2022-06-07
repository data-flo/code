const { StatusCodeError } = require("../../errors");

module.exports = function (req, res, next) {
  if (!req.dataflow) {
    return next(new StatusCodeError(400)); // Invalid request
  }

  if (!req.dataflow.user) {
    return next(new StatusCodeError(400)); // Invalid request
  }

  if (!req.user) {
    return next(new StatusCodeError(401)); // Unauthorized
  }

  if (req.dataflow.user.toString() !== req.user.id.toString()) {
    return next(new StatusCodeError(403)); // Forbidden
  }

  return next();
};
