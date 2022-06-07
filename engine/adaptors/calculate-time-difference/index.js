const moment = require("moment");

module.exports = function (args) {
  const referenceColumn = args.data.getColumn(args["reference column"]);
  const valueColumn = args.data.getColumn(args["value column"]);

  const data = args.data.clone();

  data.addColumn(
    args["target column"],
    (row) => {
      const refMoment = (
        (args["reerence format"] === "ISO8601") ?
          moment(row[referenceColumn]) :
          moment(row[referenceColumn], args["reference format"])
      );
      const valueMoment = (
        (args["value format"] === "ISO8601") ?
          moment(row[valueColumn]) :
          moment(row[valueColumn], args["value format"])
      );

      if (valueMoment.isValid() && refMoment.isValid()) {
        return valueMoment.diff(
          refMoment,
          args["difference unit"]
        );
      }

      return undefined;
    }
  );

  return {
    data,
  };
};
