const { StatusCodeError } = require("../errors");

module.exports = function (req, res, next) {
  if (!req.user) {
    return next(new StatusCodeError(401)); // Unauthorized
  }

  return next();
};
