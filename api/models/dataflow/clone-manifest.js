
module.exports = function (loggedUser) {
  const model = this;
  const isOwner = (loggedUser && model.user.toString() === loggedUser.id);
  return {
    input: (
      (model.manifest.input || []).map(
        (item) => {
          if (item.isSecret && !isOwner) {
            item.isRequired = true;
            item.default = null;
          }
          return item;
        }
      )
    ),
    output: model.manifest.output || [],
    transform: model.manifest.transform || [],
  };
};
