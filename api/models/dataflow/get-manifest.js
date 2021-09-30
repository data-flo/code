
module.exports = function (identifier, user) {
  return this.findByIdentifier(identifier, user).then((dataflow) => {
    if (!dataflow) {
      throw new Error(`Cannot find dataflow with identifier: ${identifier}.`);
    }
    return dataflow.manifest;
  });
};
