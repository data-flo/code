module.exports = function (args) {
  const data = args.data.clone();

  for (const column of args.columns) {
    data.getColumn(column);
  }

  for (let rowIndex = 0; rowIndex < data.rows.length; rowIndex++) {
    const row = args.data.rows[rowIndex];
    for (let columnIndex = 0; columnIndex < args.columns.length; columnIndex++) {
      const previousValue = (columnIndex === 0) ? args["start value"] : row[args.columns[columnIndex - 1]];
      const currentValue = row[args.columns[columnIndex]];
      data.rows[rowIndex][args.columns[columnIndex]] = (args["previous coefficient"] * previousValue) + (args["current coefficient"] * currentValue);
    }
  }

  return {
    data,
  };
};
