
module.exports = async function (args, context) {
  const keptColumns = args.columns;
  const gatheredColumns = args.data.columns.filter((x) => !keptColumns.includes(x));

  const rows = [];
  for (const wideRow of args.data.rows) {
    const baseRow = {};
    for (const column of keptColumns) {
      baseRow[column] = wideRow[column];
    }
    for (const column of gatheredColumns) {
      rows.push({
        ...baseRow,
        [args.key]: column,
        [args.value]: wideRow[column],
      });
    }
  }

  return {
    data: {
      columns: [
        ...keptColumns,
        args.key,
        args.value,
      ],
      rows,
    },
  };
};
