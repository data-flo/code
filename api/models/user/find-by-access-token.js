
module.exports = function (token) {
  return (
    this.findOne({ apiAccessToken: token })
      .exec()
  );
};
