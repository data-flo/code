module.exports = function (args) {
  const missingColumns = args.columns.filter((column) => (!args.data.hasColumn(column)));
  if (missingColumns.length) {
    throw new Error(`Data is missing columns '${missingColumns}'.`);
  }

  const data = args.data.clone();

  data.addColumn(
    args.target,
    (row) => {
      const concatenated = Array.prototype.join.call(
        args.columns.map((col) => row[col]),
        args.delimiter
      );
      return `${args.prefix}${concatenated}${args.postfix}`;
    }
  );

  return {
    data,
  };
};
