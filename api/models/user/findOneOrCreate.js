
module.exports = function (condition, doc) {
  return this.findOne(condition)
    .then((foundDoc) => {
      if (foundDoc) {
        return foundDoc;
      } else {
        return this.create(doc);
      }
    });
};
