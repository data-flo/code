const DataflowModel = require("../../models/dataflow");
const { StatusCodeError } = require("../../errors");

module.exports = function (req, res, next) {
  if (!req.params.id) {
    return next(new StatusCodeError(400)); // Invalid request
  }

  return DataflowModel.findByIdentifier(req.params.id, req.user).then((model) => {
    // Check that the model do exist
    if (!model) {
      return next(new StatusCodeError(404)); // Not found
    }

    // A private project can be accessed by the user who created it
    if (model.access === "private") {
      if (req.isAuthenticated && req.isAuthenticated() && req.user) {
        // a private project can be accessed by the user who created it
        if (model.user.toString() !== req.user.id) {
          return next(new StatusCodeError(403)); // Forbidden
        }
      } else {
        return next(new StatusCodeError(401)); // Unauthorized
      }
    }

    req.dataflow = model;
    return next();
  });
};
