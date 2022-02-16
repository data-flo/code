// define checkFunctions
const checkFunctions = {
  ">":  function(value, check) { return parseFloat(value) > parseFloat(check)  },
  ">=": function(value, check) { return parseFloat(value) >= parseFloat(check) },
  "<":  function(value, check) { return parseFloat(value) < parseFloat(check)  },
  "<=": function(value, check) { return parseFloat(value) <= parseFloat(check) }
};

module.exports = function (args) {
  const column = args.data.getColumn(args.column);
  const operator = args.operator
  const check = args.check
  const rows = [];
  const complementary = [];
  // Check comparison operator
  if ( ! [">", ">=", "<", "<="].includes(operator ) ) {
    throw new Error(`Invalid operator '${operator}'. Please use one of <, <=, >, >=`);
  }
  // Check the values that will be compared against
  if ( ! parseFloat(check) ) {
    throw new Error(`The value being used in the comparison (${check}) is not numeric.`);
  }

  for (const row of args.data.rows) {
    // check values
    if ( ! parseFloat(row[column]) ) {
      throw new Error(`At least one of the values in the column ${column} are not numeric e.g '${row[column]}'`);
    }
    if ( checkFunctions[operator](row[column], check) ) {
      rows.push(row);
    } else {
      complementary.push(row);
    }
  }
  return {
    complementary: {
      columns: args.data.columns,
      rows: complementary,
    },
    data: {
      columns: args.data.columns,
      rows,
    },
  };
};
