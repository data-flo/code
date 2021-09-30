
module.exports = function (identifier, user) {
  const query = {
    identifier,
    $or: [
      { access: "public" },
      { access: "protected" },
    ],
  };
  if (user) {
    query.$or.push({ user: user.id });
  }
  return this.findOne(query);
};
