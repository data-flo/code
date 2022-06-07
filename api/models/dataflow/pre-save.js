module.exports = function (next) {
  const date = new Date();

  if (!this.createdAt) {
    this.createdAt = date;
  }
  this.updatedAt = date;

  next();
};
