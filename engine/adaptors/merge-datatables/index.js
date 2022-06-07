module.exports = function extendDatatable(args) {
  const firstTable = args["first data"];
  const secondTable = args["second data"];
  
  const columns = new Set();
  if (args.columns) {
    for (const column of args.columns) {
      if (args["common columns"]) {
        if (firstTable.columns.includes(column) && secondTable.columns.includes(column)) {
          columns.add(column);
        }
      }
      else {
        if (firstTable.columns.includes(column) || secondTable.columns.includes(column)) {
          columns.add(column);
        }
      }
    }
  }
  else {
    for (const column of firstTable.columns) {
      if (!args["intersect columns"] || secondTable.columns.includes(column)) {
        columns.add(column);
      }
    }
    for (const column of secondTable.columns) {
      if (!args["common columns"] || firstTable.columns.includes(column)) {
        columns.add(column);
      }
    }
  }

  const rows = [];
  for (const row of firstTable.rows) {
    rows.push(row);
  }
  for (const row of secondTable.rows) {
    rows.push(row);
  }

  return {
    data: {
      columns: Array.from(columns),
      rows,
    },
  };
};
