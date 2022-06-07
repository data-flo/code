module.exports = function (args) {
  const rows = [];
  for (const oldRow of args.data.rows) {
    const newRow = {};
    for (const column of args.data.columns) {
      if (args.mapping.has(column)) {
        newRow[args.mapping.get(column) || column] = oldRow[column];
      }
      else if (!args.discard) {
        newRow[column] = oldRow[column];
      }
    }
    rows.push(newRow);
  }

  const columns = [];
  for (const column of args.data.columns) {
    if (args.mapping.has(column)) {
      columns.push(args.mapping.get(column) || column);
    }
    else if (!args.discard) {
      columns.push(column);
    }
  }

  return {
    data: {
      columns,
      rows,
    },
  };
};
