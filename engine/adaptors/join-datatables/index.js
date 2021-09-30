const FuzzyMatching = require("fuzzy-matching");

module.exports = function extendDatatable(args) {
  if (args.distance > 100 || args.distance <= 0) {
    throw new Error("Argument `distance` should be greater than zero and less than or equal 100");
  }
  const distance = args.distance / 100;
  const isFuzzy = (args.distance < 100);
  const leftTable = args["main data"];
  const rightTable = args["other data"];
  const leftIdColumn = args["main column"];
  const rightIdColumn = args["other column"] || args["main column"];
  if (!leftTable.hasColumn(leftIdColumn)) {
    throw new Error(`Main datatable does not include a column named '${leftIdColumn}'`);
  }
  if (!rightTable.hasColumn(rightIdColumn)) {
    throw new Error(`Other datatable does not include a column named '${rightIdColumn}'`);
  }

  const joinedColumnMap = new Map();
  const joinedColumnNames = [];
  if (args.columns) {
    for (const [ oldName, newName ] of args.columns) {
      if (args.overwrite === true || !leftTable.columns.includes(newName)) {
        joinedColumnMap.set(oldName, newName);
        joinedColumnNames.push(newName);
      }
    }
  }
  else {
    const columns = rightTable.columns.filter((x) => args.overwrite === true || !leftTable.columns.includes(x));
    for (const columnName of columns) {
      joinedColumnMap.set(columnName, columnName);
      joinedColumnNames.push(columnName);
    }
  }

  const rightRows = new Map();
  const rightRowIds = [];
  for (const row of rightTable.rows) {
    if (row[rightIdColumn]) {
      const id = row[rightIdColumn].toString().toLowerCase();
      rightRows.set(id, row);
      rightRowIds.push(id);
    }
  }

  let fuzzyMatcher;
  if (isFuzzy) {
    fuzzyMatcher = new FuzzyMatching(rightRowIds);
  }

  const rows = [];
  const skippedRows = [];
  for (const leftRow of leftTable.rows) {
    const joinValue = leftRow[leftIdColumn];
    const row = { ...leftRow };
    if (joinValue) {
      let rightRow;
      if (isFuzzy) {
        const match = fuzzyMatcher.get(joinValue.toString().toLowerCase());
        if (match.distance >= distance) {
          rightRow = rightRows.get(match.value);
        }
      }
      else {
        rightRow = rightRows.get(joinValue.toString().toLowerCase());
      }
      if (rightRow) {
        for (const [ rightName, leftName ] of joinedColumnMap) {
          row[leftName] = rightRow[rightName];
        }
      }
      if (args["inner join"] === false || rightRow) {
        rows.push(row);
      }
      else {
        skippedRows.push(row);
      }
    } else if (args["inner join"] === false) {
      rows.push(row);
    }
    else {
      skippedRows.push(row);
    }
  }

  const columns = [
    ...leftTable.columns,
    ...joinedColumnNames,
  ];

  return {
    data: {
      columns,
      rows,
    },
    skipped: {
      columns,
      rows: skippedRows,
    },
  };
};
