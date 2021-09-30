const UserModel = require("./models/user");

module.exports = async function (req, res, next) {
  if (!req.user) {
    const token = (req.headers["access-token"] || req.query["access-token"]);
    if (typeof token === "string") {
      const user = await UserModel.findByAccessToken(token);
      if (user) {
        req.user = user;
      }
    }
  }

  next();
};
