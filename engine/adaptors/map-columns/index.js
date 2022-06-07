module.exports = function (args) {
  // Create mappings
  const mappings = new Map();
  for (const { "old column": oldColumn, "old value": oldValue, "new column": newColumn, "new value": newValue } of args.mappings.rows) {
    const valueMap = mappings.get(oldColumn) || new Map();
    valueMap.set(oldValue, [ newColumn, newValue ]);
    mappings.set(oldColumn, valueMap);
  }

  const newRows = [];
  const columns = new Set();
  for (const oldRow of args.data.rows) {
    const newRow = {};
    for (const oldColumn of args.data.columns) {
      const oldValue = oldRow[oldColumn];
      const valueMap = mappings.get(oldColumn);
      if (valueMap && (valueMap.has(oldValue) || valueMap.get(""))) {
        const [ newColumn, newValue ] = valueMap.get(oldValue) || valueMap.get("");
        newRow[newColumn || oldColumn] = newValue || oldValue;
        columns.add(newColumn || oldColumn);
      }
      else if (!args.discard) {
        newRow[oldColumn] = oldRow[oldColumn];
        columns.add(oldColumn);
      }
    }
    newRows.push(newRow);
  }

  return {
    data: {
      columns: Array.from(columns),
      rows: newRows,
    },
  };
};
